from fastapi import APIRouter, HTTPException, Depends
from storage.json_repo import JSONRepository
from ._deps import get_current_user

router = APIRouter(prefix="/contracts", tags=["contracts"])
repo = JSONRepository()

@router.post("", status_code=201)
def create_contract(payload: dict, user=Depends(get_current_user)):
    # فقط الحرفي (artisan) يمكنه إنشاء العقد
    if user["user_type"] != "artisan":
        raise HTTPException(status_code=403, detail="Artisans only")

    # التحقق من وجود الطلب أو المستخدمين
    request_id = payload.get("requestId")
    artisan_id = payload.get("artisanId")
    client_id = payload.get("clientId")

    if not request_id or not artisan_id or not client_id:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # إنشاء العقد الجديد
    contract = repo.create_contract({
        "requestId": request_id,
        "artisanId": artisan_id,
        "clientId": client_id,
        "status": payload.get("status", "pending"),
        "cost": payload.get("cost"),
        "timeframe": payload.get("timeframe"),
    })

    return {"contract": contract}
