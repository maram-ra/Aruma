# routers/artisans.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json

from ._deps import get_current_user
from database import repo

router = APIRouter(prefix="/artisans", tags=["artisans"])

# ====================== Schemas ======================
class WorkItem(BaseModel):
    url: str
    title: Optional[str] = ""

class ArtisanUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    craftType: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    offersWorkshop: Optional[bool] = None
    offersLiveShow: Optional[bool] = None
    offersProduct: Optional[bool] = None
    # دعم الأنظمة القديمة والجديدة:
    workImages: Optional[List[str]] = Field(default=None)
    workTitles: Optional[List[str]] = Field(default=None)
    work: Optional[List[WorkItem]] = None

# ====================== Helpers ======================
def _current_user_id(user: Dict[str, Any]) -> int:
    val = user.get("id") or user.get("user_id") or user.get("sub")
    if val is None:
        raise HTTPException(status_code=401, detail="Invalid auth payload (no user id)")
    if isinstance(val, int):
        return val
    try:
        return int(val)
    except Exception:
        digits = "".join(ch for ch in str(val) if ch.isdigit())
        if digits:
            return int(digits)
        raise HTTPException(status_code=401, detail="Invalid auth payload (bad user id)")

def _as_list(v) -> List[Any]:
    """
    يحوّل القيمة إلى list بأمان سواء كانت None أو نص JSON أو list/tuple.
    مفيد للتعامل مع JSONB (يرجع list) وSQLite (نص JSON).
    """
    if v is None:
        return []
    if isinstance(v, (list, tuple)):
        return list(v)
    if isinstance(v, str):
        s = v.strip()
        if not s:
            return []
        try:
            x = json.loads(s)
            return x if isinstance(x, list) else []
        except Exception:
            return []
    return []

# ====================== Endpoints ======================

@router.get("")
def list_artisans(limit: int = 12, page: Optional[int] = None):
    offset = (page - 1) * limit if page and page > 1 else 0
    rows = repo.get_all_artisans(limit=limit, offset=offset)
    result = []
    for r in rows:
        work_images = _as_list(r.get("work_images"))
        work_titles = _as_list(r.get("work_titles"))

        result.append({
            "_id": r["id"],
            "name": r.get("name", ""),
            "email": r.get("email", ""),
            "bio": r.get("bio", "") or "",
            "craftType": r.get("craft_type", "") or "",
            "images": [r.get("image")] if r.get("image") else [],
            "offersWorkshop": bool(r.get("offers_workshop")),
            "offersLiveShow": bool(r.get("offers_live_show")),
            "offersProduct": bool(r.get("offers_product")),
            "completedWorkCount": r.get("completed_work_count", 0) or 0,
            "workImages": work_images,
            "workTitles": work_titles,
        })
    return result


@router.get("/{artisan_id}")
def get_artisan(artisan_id: int):
    r = repo.get_artisan_by_id(str(artisan_id))
    if not r:
        raise HTTPException(status_code=404, detail="Artisan not found")

    work_images = _as_list(r.get("work_images"))
    work_titles = _as_list(r.get("work_titles"))

    return {
        "_id": r["id"],
        "name": r.get("name", ""),
        "email": r.get("email", ""),
        "bio": r.get("bio", "") or "",
        "craftType": r.get("craft_type", "") or "",
        "images": [r.get("image")] if r.get("image") else [],
        "offersWorkshop": bool(r.get("offers_workshop")),
        "offersLiveShow": bool(r.get("offers_live_show")),
        "offersProduct": bool(r.get("offers_product")),
        "completedWorkCount": r.get("completed_work_count", 0) or 0,
        "workImages": work_images,
        "workTitles": work_titles,
    }


@router.put("/{artisan_id}")
def update_artisan(artisan_id: int, body: ArtisanUpdate, user=Depends(get_current_user)):
    if user.get("user_type") != "artisan" or _current_user_id(user) != int(artisan_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    payload: Dict[str, Any] = {}

    # الحقول العامة
    for field in ["name", "bio", "craftType", "image", "images",
                  "offersWorkshop", "offersLiveShow", "offersProduct"]:
        val = getattr(body, field)
        if val is not None:
            payload[field] = val

    # توافق قديم (workImages + workTitles)
    if body.workImages is not None:
        payload["work_images"] = json.dumps(body.workImages)
        payload["work_titles"] = json.dumps(body.workTitles or [""] * len(body.workImages))

    # النظام الجديد: work = [{url, title}]
    if body.work is not None:
        payload["work_images"] = json.dumps([w.url for w in body.work])
        payload["work_titles"] = json.dumps([w.title or "" for w in body.work])

    row = repo.update_artisan(str(artisan_id), payload)
    if not row:
        raise HTTPException(status_code=404, detail="Artisan not found")

    work_images = _as_list(row.get("work_images"))
    work_titles  = _as_list(row.get("work_titles"))

    return {
        "_id": row["id"],
        "name": row.get("name", ""),
        "email": row.get("email", ""),
        "bio": row.get("bio", "") or "",
        "craftType": row.get("craft_type", "") or "",
        "images": [row.get("image")] if row.get("image") else [],
        "offersWorkshop": bool(row.get("offers_workshop")),
        "offersLiveShow": bool(row.get("offers_live_show")),
        "offersProduct": bool(row.get("offers_product")),
        "completedWorkCount": row.get("completed_work_count", 0) or 0,
        "workImages": work_images,
        "workTitles": work_titles,
    }

# ====================== My Work Management ======================

@router.post("/{artisan_id}/work")
def add_work_item(artisan_id: int, item: WorkItem, user=Depends(get_current_user)):
    if user.get("user_type") != "artisan" or _current_user_id(user) != int(artisan_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    art = repo.get_artisan_by_id(str(artisan_id))
    if not art:
        raise HTTPException(status_code=404, detail="Artisan not found")

    imgs   = _as_list(art.get("work_images"))
    titles = _as_list(art.get("work_titles"))

    imgs.append(item.url)
    titles.append(item.title or "")

    repo.update_artisan(str(artisan_id), {
        "work_images": json.dumps(imgs),
        "work_titles": json.dumps(titles),
    })

    return {"success": True, "workImages": imgs, "workTitles": titles}


@router.put("/{artisan_id}/work/{index}")
def update_work_item(artisan_id: int, index: int, item: WorkItem, user=Depends(get_current_user)):
    if user.get("user_type") != "artisan" or _current_user_id(user) != int(artisan_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    art = repo.get_artisan_by_id(str(artisan_id))
    if not art:
        raise HTTPException(status_code=404, detail="Artisan not found")

    imgs   = _as_list(art.get("work_images"))
    titles = _as_list(art.get("work_titles"))

    if index < 0 or index >= len(imgs):
        raise HTTPException(status_code=404, detail="Work item not found")

    imgs[index] = item.url
    if len(titles) < len(imgs):
        titles += [""] * (len(imgs) - len(titles))
    titles[index] = item.title or ""

    repo.update_artisan(str(artisan_id), {
        "work_images": json.dumps(imgs),
        "work_titles": json.dumps(titles),
    })

    return {"success": True, "workImages": imgs, "workTitles": titles}


@router.delete("/{artisan_id}/work/{index}")
def delete_work_item(artisan_id: int, index: int, user=Depends(get_current_user)):
    if user.get("user_type") != "artisan" or _current_user_id(user) != int(artisan_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    art = repo.get_artisan_by_id(str(artisan_id))
    if not art:
        raise HTTPException(status_code=404, detail="Artisan not found")

    imgs   = _as_list(art.get("work_images"))
    titles = _as_list(art.get("work_titles"))

    if index < 0 or index >= len(imgs):
        raise HTTPException(status_code=404, detail="Work item not found")

    imgs.pop(index)
    if index < len(titles):
        titles.pop(index)

    repo.update_artisan(str(artisan_id), {
        "work_images": json.dumps(imgs),
        "work_titles": json.dumps(titles),
    })

    return {"success": True, "workImages": imgs, "workTitles": titles}


# ✅ عرض طلبات الحرفي مع اسم العميل
@router.get("/{artisan_id}/requests")
def list_artisan_requests_for_ui(artisan_id: int, user=Depends(get_current_user)):
    if user.get("user_type") != "artisan" or _current_user_id(user) != int(artisan_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    rows = repo.get_requests_by_artisan(str(artisan_id))
    out = []
    for r in rows:
        client_name = ""
        try:
            c = repo.get_client_by_id(str(r.get("client_id")))
            if c:
                client_name = c.get("name", "") or c.get("email", "")
        except Exception:
            pass

        out.append({
            "_id": r.get("id"),
            "clientId": r.get("client_id"),
            "artisanId": r.get("artisan_id"),
            "requestType": r.get("request_type"),
            "message": r.get("description"),
            "status": r.get("status_artisan") or r.get("status"),
            "budget": r.get("offer_budget") or r.get("budget"),
            "deadline": r.get("offer_deadline") or r.get("deadline"),
            "contractId": r.get("contract_id"),
            "createdAt": r.get("created_at"),
            "clientName": client_name,
        })
    return {"requests": out}
