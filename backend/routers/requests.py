# routers/requests.py
# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional, Union, Dict, Any

from ._deps import get_current_user
from database import repo

router = APIRouter(prefix="/requests", tags=["requests"])


# =======================
# Schemas
# =======================
class CreateRequest(BaseModel):
    """إنشاء طلب من العميل إلى الحرفي."""
    artisanId: Union[int, str] = Field(..., description="Artisan ID")
    requestType: Literal["product", "workshop", "live_show"]
    message: str = ""


class OfferPayload(BaseModel):
    """عرض الحرفي: السعر والموعد المقترحان."""
    budget: float = Field(..., ge=0)
    deadline: str = Field(..., description="YYYY-MM-DD")


class SimpleNote(BaseModel):
    """ملاحظة اختيارية (لا تُخزن هنا فعليًا لكن تبقى لواجهة أمامية)."""
    note: Optional[str] = None


# =======================
# Helpers
# =======================
def _to_int_id(value: Union[int, str]) -> int:
    if isinstance(value, int):
        return value
    try:
        return int(value)
    except Exception:
        digits = "".join(ch for ch in str(value) if ch.isdigit())
        if digits:
            return int(digits)
        raise HTTPException(status_code=422, detail="ID must be an integer")


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


# =======================
# Endpoints (السيناريو المتفق عليه)
# =======================

@router.post("")
def create_request(payload: CreateRequest, user=Depends(get_current_user)):
    """
    (1) العميل ينشئ طلب:
        - حالة العميل: pending
        - حالة الحرفي: new
    """
    if user.get("user_type") != "client":
        raise HTTPException(status_code=403, detail="Only clients can create requests")

    artisan_id = _to_int_id(payload.artisanId)
    client_id = _current_user_id(user)

    # تأكد أن الحرفي موجود
    if not repo.get_artisan_by_id(str(artisan_id)):
        raise HTTPException(status_code=404, detail="Artisan not found")

    row = repo.create_request_v2(
        client_id=client_id,
        artisan_id=artisan_id,
        request_type=payload.requestType,
        description=payload.message or "",
        status_client="pending",
        status_artisan="new",
    )
    return {"success": True, "request": row}


@router.put("/{request_id}/artisan/offer")
def artisan_offer(request_id: int, body: OfferPayload, user=Depends(get_current_user)):
    """
    (2) الحرفي يرسل عرض (budget, deadline):
        - حالة الحرفي: pending  (بانتظار موافقة العميل)
        - حالة العميل: accepted (ظهرت له تسعيرة)
    """
    if user.get("user_type") != "artisan":
        raise HTTPException(status_code=403, detail="Only artisans can send offers")

    r = repo.get_request_by_id(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if int(r["artisan_id"]) != _current_user_id(user):
        raise HTTPException(status_code=403, detail="Forbidden")

    row = repo.update_request_offer_and_statuses(
        request_id=request_id,
        offer_budget=body.budget,
        offer_deadline=body.deadline,
        status_client="accepted",
        status_artisan="pending",
    )
    return {"success": True, "request": row}


@router.put("/{request_id}/client/accept")
def client_accept_offer(request_id: int, body: SimpleNote, user=Depends(get_current_user)):
    """
    (3) العميل يوافق على العرض:
        - الحالتان: inprogress
        - إنشاء عقد من عناصر العرض
    """
    if user.get("user_type") != "client":
        raise HTTPException(status_code=403, detail="Only clients can accept offers")

    r = repo.get_request_by_id(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if int(r["client_id"]) != _current_user_id(user):
        raise HTTPException(status_code=403, detail="Forbidden")

    # يجب أن يكون لدى الطلب عرض سابقًا
    if r.get("offer_budget") is None or r.get("offer_deadline") is None:
        raise HTTPException(status_code=422, detail="No offer to accept")

    # حدّث الحالات للطرفين
    req_after = repo.update_request_statuses(
        request_id=request_id,
        status_client="inprogress",
        status_artisan="inprogress",
    )

    # أنشئ عقدًا نشطًا
    contract = repo.create_contract(
        request_id=request_id,
        artisan_id=int(r["artisan_id"]),
        client_id=int(r["client_id"]),
        cost=float(r["offer_budget"]),
        date=str(r["offer_deadline"]),
        status="active",
    )
    return {"success": True, "request": req_after, "contract": contract}


@router.put("/{request_id}/client/reject")
def client_reject(request_id: int, body: SimpleNote, user=Depends(get_current_user)):
    """
    (4) العميل يرفض:
        - الحالتان: rejected
    """
    if user.get("user_type") != "client":
        raise HTTPException(status_code=403, detail="Only clients can reject")

    r = repo.get_request_by_id(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if int(r["client_id"]) != _current_user_id(user):
        raise HTTPException(status_code=403, detail="Forbidden")

    row = repo.update_request_statuses(
        request_id=request_id,
        status_client="rejected",
        status_artisan="rejected",
    )
    return {"success": True, "request": row}


@router.put("/{request_id}/artisan/reject")
def artisan_reject(request_id: int, body: SimpleNote, user=Depends(get_current_user)):
    """
    (4) الحرفي يرفض:
        - الحالتان: rejected
    """
    if user.get("user_type") != "artisan":
        raise HTTPException(status_code=403, detail="Only artisans can reject")

    r = repo.get_request_by_id(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if int(r["artisan_id"]) != _current_user_id(user):
        raise HTTPException(status_code=403, detail="Forbidden")

    row = repo.update_request_statuses(
        request_id=request_id,
        status_client="rejected",
        status_artisan="rejected",
    )
    return {"success": True, "request": row}


@router.put("/{request_id}/artisan/complete")
def artisan_complete(request_id: int, body: SimpleNote, user=Depends(get_current_user)):
    """
    (5) الحرفي يعلّم الطلب مكتمل:
        - الحالتان: completed
        - زيادة عداد completed_work_count للحرفي
    """
    if user.get("user_type") != "artisan":
        raise HTTPException(status_code=403, detail="Only artisans can complete requests")

    r = repo.get_request_by_id(request_id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if int(r["artisan_id"]) != _current_user_id(user):
        raise HTTPException(status_code=403, detail="Forbidden")

    row = repo.update_request_statuses(
        request_id=request_id,
        status_client="completed",
        status_artisan="completed",
    )
    repo.increment_artisan_completed_work(int(r["artisan_id"]), inc=1)
    return {"success": True, "request": row}


# =======================
# (اختياري) قوائم أساسية
# تبقى للحفاظ على التوافق إن كان هناك استدعاءات قديمة.
# =======================
@router.get("/artisan/{artisan_id}/requests")
def list_artisan_requests(artisan_id: int, user=Depends(get_current_user)):
    if user.get("user_type") != "artisan" or _current_user_id(user) != int(artisan_id):
        raise HTTPException(status_code=403, detail="Forbidden")
    return repo.get_requests_by_artisan(str(artisan_id))


@router.get("/client/{client_id}/requests")
def list_client_requests(client_id: int, user=Depends(get_current_user)):
    if user.get("user_type") != "client" or _current_user_id(user) != int(client_id):
        raise HTTPException(status_code=403, detail="Forbidden")
    return repo.get_requests_by_client(str(client_id))
