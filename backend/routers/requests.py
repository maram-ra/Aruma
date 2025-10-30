from fastapi import APIRouter, HTTPException, Depends
from storage.json_repo import JSONRepository
from schemas.requests import RequestCreate
from pydantic import BaseModel
from ._deps import get_current_user

router = APIRouter(prefix="/requests", tags=["requests"])
repo = JSONRepository()

# ============================
# إنشاء طلب جديد من العميل
# ============================
@router.post("", status_code=201)
def create_request(payload: RequestCreate, user=Depends(get_current_user)):
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Clients only")

    if not repo.get_user("artisan", payload.artisanId):
        raise HTTPException(status_code=404, detail="Artisan not found")

    record = {
        "clientId": user["sub"],
        "artisanId": payload.artisanId,
        "requestType": payload.requestType,
        "message": payload.message,
        "status": "pending",
        "cost": None,
        "timeframe": None,
    }
    created = repo.create_request(record)
    return {"request": created}


# ============================
#  عرض طلب واحد بالتفصيل
# ============================
@router.get("/{request_id}")
def get_request(request_id: str, user=Depends(get_current_user)):
    r = repo.get_request(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if user["user_type"] == "client" and r["clientId"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if user["user_type"] == "artisan" and r["artisanId"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    return r


# ============================
#  قبول الطلب من الحرفي
# ============================
class ExtendedTermsRequest(BaseModel):
    cost: float
    message: str
    date: str  # YYYY-MM-DD format


@router.put("/{request_id}/accept")
def accept_request(request_id: str, terms: ExtendedTermsRequest, user=Depends(get_current_user)):
    if user["user_type"] != "artisan":
        raise HTTPException(status_code=403, detail="Artisans only")

    r = repo.get_request(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if r["artisanId"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if r["status"] != "pending":
        raise HTTPException(status_code=400, detail="Request not pending")

    # تحديث الطلب
    r = repo.update_request(
        request_id,
        {
            "status": "accepted",
            "cost": terms.cost,
            "message": terms.message,
            "date": terms.date,
        },
    )

    # إنشاء عقد جديد مرتبط بهذا الطلب
    contract = repo.create_contract(
        {
            "requestId": request_id,
            "artisanId": r["artisanId"],
            "clientId": r["clientId"],
            "status": "pending",
            "cost": terms.cost,
            "message": terms.message,
            "date": terms.date,
        }
    )

    return {"request": r, "contract": contract}


# ============================
#  رفض الطلب من الحرفي
# ============================
@router.put("/{request_id}/reject")
def reject_request(request_id: str, user=Depends(get_current_user)):
    if user["user_type"] != "artisan":
        raise HTTPException(status_code=403, detail="Artisans only")

    r = repo.get_request(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if r["artisanId"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if r["status"] != "pending":
        raise HTTPException(status_code=400, detail="Request not pending")

    r = repo.update_request(request_id, {"status": "rejected"})
    return {"request": r}


# ============================
# إنهاء الطلب (من الحرفي)
# ============================
@router.put("/{request_id}/complete")
def complete_request(request_id: str, user=Depends(get_current_user)):
    """Mark a request and its related contract as completed (by artisan)"""
    if user["user_type"] != "artisan":
        raise HTTPException(status_code=403, detail="Artisans only")

    r = repo.get_request(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if r["artisanId"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    # تحديث حالة الطلب
    updated_request = repo.update_request(request_id, {"status": "completed"})

    # تحديث حالة العقد المقابل
    all_contracts = repo.list_contracts_for_user(user["sub"])
    for c in all_contracts:
        if c["requestId"] == request_id:
            repo.update_contract(c["_id"], {"status": "completed"})

    return {"request": updated_request, "message": "Request and contract marked as completed"}

# ===================================================
# طلبات العميل (تشمل أسماء الحرفيين وأرقامهم والعقود)
# ===================================================
@router.get("/client/{client_id}/requests")
def list_requests_for_client(client_id: str, user=Depends(get_current_user)):
    """Return all requests made by a client including artisan names, phones, and contract details"""
    if user["user_type"] != "client":
        raise HTTPException(status_code=403, detail="Clients only")

    if user["sub"] != client_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    requests = repo.list_requests_for_client(client_id)
    contracts = repo.list_contracts_for_user(client_id)

    for r in requests:
        # 🔹 اسم الحرفي + رقم الجوال
        artisan = repo.get_user("artisan", r["artisanId"])
        if artisan:
            r["artisanName"] = artisan["name"]
            r["artisanPhone"] = artisan.get("phone")

        # 🔹 ربط تفاصيل العقد المرتبط
        for c in contracts:
            if c["requestId"] == r["_id"]:
                r["contractId"] = c["_id"]
                r["contractCost"] = c.get("cost")   
                r["contractDate"] = c.get("date")  
                break

    return {"requests": requests}


# ===================================================
#  طلبات الحرفي (تشمل أسماء العملاء)
# ===================================================
@router.get("/artisan/{artisan_id}/requests")
def list_requests_for_artisan(artisan_id: str, user=Depends(get_current_user)):
    """Return all requests for an artisan including client names"""
    if user["user_type"] != "artisan":
        raise HTTPException(status_code=403, detail="Artisans only")

    if user["sub"] != artisan_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    requests = repo.list_requests_for_artisan(artisan_id)

    for r in requests:
        client = repo.get_user("client", r["clientId"])
        if client:
            r["clientName"] = client["name"]

    return {"requests": requests}
