
from fastapi import APIRouter, HTTPException, Depends
from storage.json_repo import JSONRepository
from schemas.requests import RequestCreate
from schemas.contracts import SetTermsRequest
from ._deps import get_current_user

router = APIRouter(prefix="/requests", tags=["requests"])
repo = JSONRepository()

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
        "timeframe": None
    }
    created = repo.create_request(record)
    return {"request": created}

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

@router.put("/{request_id}/accept")
def accept_request(request_id: str, terms: SetTermsRequest, user=Depends(get_current_user)):
    if user["user_type"] != "artisan":
        raise HTTPException(status_code=403, detail="Artisans only")
    r = repo.get_request(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    if r["artisanId"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    if r["status"] != "pending":
        raise HTTPException(status_code=400, detail="Request not pending")
    r = repo.update_request(request_id, {"status":"accepted", "cost": terms.cost, "timeframe": terms.timeframe})
    # create contract in pending status
    contract = repo.create_contract({
        "requestId": request_id,
        "artisanId": r["artisanId"],
        "clientId": r["clientId"],
        "status": "pending",
        "cost": terms.cost,
        "timeframe": terms.timeframe
    })
    return {"request": r, "contract": contract}

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
    r = repo.update_request(request_id, {"status":"rejected"})
    return {"request": r}
