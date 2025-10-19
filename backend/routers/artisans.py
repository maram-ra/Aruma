
from fastapi import APIRouter, HTTPException, Depends, Query
from storage.json_repo import JSONRepository
from schemas.users import ArtisanUpdate, ArtisanPublic
from ._deps import get_current_user

router = APIRouter(prefix="/artisans", tags=["artisans"])
repo = JSONRepository()
@router.get("", response_model=list[ArtisanPublic])
def list_artisans(page: int = 1, limit: int = 12, craftType: str | None = None):
    # قراءة بيانات الحرفيين من ملف JSON
    data = repo._read().get("artisans", [])

    fixed_data = []
    for a in data:
        # نحذف كلمة المرور من البيانات
        item = {k: v for k, v in a.items() if k != "password"}

        # ✅ نضمن وجود المفتاح _id في كل عنصر
        if "_id" in a:
            item["_id"] = a["_id"]
        elif "id" in a:
            item["_id"] = a["id"]
        else:
            # لو مفقود ننشئ معرف مؤقت من رقم الفهرس
            item["_id"] = f"art{len(fixed_data) + 1:06d}"

        fixed_data.append(item)

    # فلترة حسب نوع الحرفة إن وجد
    if craftType:
        fixed_data = [
            a for a in fixed_data
            if (a.get("craftType") or "").lower() == craftType.lower()
        ]

    # تقسيم النتائج (pagination)
    start = (page - 1) * limit
    end = start + limit

    # نطبع في الكونسول للتأكد أن كل عنصر فيه _id
    print("✅ Sending artisans with IDs:", [a.get("_id") for a in fixed_data])

    return fixed_data[start:end]

@router.get("/{artisan_id}", response_model=ArtisanPublic)
def get_artisan(artisan_id: str):
    a = repo.get_user("artisan", artisan_id)
    if not a:
        raise HTTPException(status_code=404, detail="Artisan not found")
    a.pop("password", None)
    return a

@router.put("/{artisan_id}", response_model=ArtisanPublic)
def update_artisan(artisan_id: str, payload: ArtisanUpdate, user=Depends(get_current_user)):
    if user["user_type"] != "artisan" or user["sub"] != artisan_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    updated = repo.update_user("artisan", artisan_id, {k:v for k,v in payload.dict(exclude_unset=True).items()})
    if not updated:
        raise HTTPException(status_code=404, detail="Artisan not found")
    updated.pop("password", None)
    return updated

@router.get("/{artisan_id}/requests")
def get_incoming_requests(artisan_id: str, status: str | None = Query(default=None), user=Depends(get_current_user)):
    if user["user_type"] != "artisan" or user["sub"] != artisan_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"requests": repo.list_requests_for_artisan(artisan_id, status=status)}

@router.get("/{artisan_id}/completed-work")
def completed_work(artisan_id: str):
    # Using contracts with completed status to show portfolio entries
    items = [c for c in repo._read()["contracts"] if c.get("artisanId")==artisan_id and c.get("status")=="completed"]
    return {"completed": items}
