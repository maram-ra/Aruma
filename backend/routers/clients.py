# routers/clients.py
from fastapi import APIRouter, HTTPException, Depends
from database import repo
from ._deps import get_current_user
from typing import Dict, Any

router = APIRouter(tags=["clients"])

def _current_user_id(user: Dict[str, Any]) -> str:
    """
    يحاول أخذ المعرّف من عدة مفاتيح محتملة ويعيده كنص للمقارنة.
    """
    val = user.get("sub") or user.get("id") or user.get("user_id")
    if val is None:
        raise HTTPException(status_code=401, detail="Invalid auth payload (no user id)")
    return str(val)

@router.get("/clients/{client_id}/requests")
def list_client_requests(client_id: str, current_user: dict = Depends(get_current_user)):
    """
    يعيد طلبات العميل مع اسم الحرفي (وجواله إن وُجد) +
    حقول العرض (offerBudget/offerDeadline) والعقد (contractCost/contractDate/contractId).
    واجهة العميل تقرأ:
      - artisanName
      - status (هي حالة العميل: status_client)
      - contractCost/contractDate أو fallback إلى offerBudget/offerDeadline
    """
    if current_user.get("user_type") != "client" or _current_user_id(current_user) != str(client_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        rows = repo.get_requests_by_client_with_artisan_name(client_id)
        out = []
        for r in rows:
            out.append({
                "_id": r.get("id"),
                "requestType": r.get("request_type", "workshop"),
                "message": r.get("description", "") or r.get("message", ""),

                # الحالة الظاهرة للعميل هي حالة العميل
                "status": r.get("status_client") or r.get("status", "pending"),

                "artisanId": r.get("artisan_id"),
                "artisanName": r.get("artisan_name") or "Unknown",
                "artisanPhone": r.get("artisan_phone"),

                # عرض الحرفي (يُعرض إن لم يوجد عقد بعد)
                "offerBudget": r.get("offer_budget") or r.get("budget"),
                "offerDeadline": r.get("offer_deadline") or r.get("deadline"),

                # بيانات العقد (إن وُجد بعد تأكيد العميل)
                "contractId": r.get("contract_id"),
                "contractCost": r.get("contract_cost"),
                "contractDate": r.get("contract_date"),

                # تواريخ عرضية للواجهة
                "createdAt": r.get("created_at"),
                "date": r.get("date"),
            })
        return {"requests": out}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
