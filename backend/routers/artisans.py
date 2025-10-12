# backend/routers/artisans.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from core.security import get_current_user
from storage.json_repo import get_user_by_id, update_user, load_db, find_user_by_email, list_requests_for_artisan

router = APIRouter()

@router.get("/")
def get_artisans(page: int = 1, limit: int = 12, craftType: str = None):
    db = load_db()
    artisans = db.get("artisans", [])
    if craftType:
        artisans = [a for a in artisans if a.get("craftType") == craftType]
    total = len(artisans)
    start = (page - 1) * limit
    end = start + limit
    paginated = artisans[start:end]
    return {"success": True, "message": "Artisans retrieved successfully", "data": {"artisans": paginated, "pagination": {"page": page, "limit": limit, "total": total, "pages": (total + limit -1)//limit}}}

@router.get("/{artisan_id}")
def get_artisan_profile(artisan_id: str):
    artisan = get_user_by_id(artisan_id, "artisan")
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found")
    return {"success": True, "message": "Artisan profile retrieved", "data": {"artisan": artisan}}

@router.put("/{artisan_id}")
def update_artisan_profile(artisan_id: str, payload: dict, current_user: dict = Depends(get_current_user)):
    if current_user["type"] != "artisan":
        raise HTTPException(status_code=403, detail="Forbidden")
    artisan = find_user_by_email(current_user["email"], "artisan")
    if not artisan or artisan.get("_id") != artisan_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")
    allowed = {"name","bio","craftType","offersWorkshop","offersLiveShow","images"}
    updates = {k:v for k,v in payload.items() if k in allowed}
    updated = update_user(artisan_id, updates, "artisan")
    return {"success": True, "message": "Profile updated successfully", "data": {"artisan": updated}}

@router.get("/{artisan_id}/requests")
def get_artisan_requests(artisan_id: str, status: str = None, current_user: dict = Depends(get_current_user)):
    if current_user["type"] != "artisan":
        raise HTTPException(status_code=403, detail="Forbidden")
    artisan = find_user_by_email(current_user["email"], "artisan")
    if not artisan or artisan.get("_id") != artisan_id:
        raise HTTPException(status_code=403, detail="You can only view your own requests")
    reqs = list_requests_for_artisan(artisan_id, status)
    return {"success": True, "message": "Requests retrieved successfully", "data": {"requests": reqs}}
