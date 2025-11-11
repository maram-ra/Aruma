# routers/clients.py
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from datetime import datetime, date

from database import repo
from ._deps import get_current_user

router = APIRouter(tags=["clients"])


def _current_user_id(user: Dict[str, Any]) -> str:
    """
    يحاول أخذ المعرّف من عدة مفاتيح محتملة ويعيده كنص للمقارنة.
    """
    val = user.get("sub") or user.get("id") or user.get("user_id")
    if val is None:
        raise HTTPException(status_code=401, detail="Invalid auth payload (no user id)")
    return str(val)


def _fmt_dt(v: Optional[Any]) -> Optional[str]:
    """
    تنسيق التاريخ والوقت لعرضه كتاريخ + وقت (YYYY-MM-DD HH:MM).
    يقبل datetime أو نص ISO أو أي نص آخر.
    """
    if not v:
        return None
    # إذا هو datetime / date مباشرةً
    if isinstance(v, (datetime, date)):
        dt = datetime(v.year, v.month, v.day, getattr(v, "hour", 0), getattr(v, "minute", 0))
        return dt.strftime("%Y-%m-%d %H:%M")

    s = str(v)
    # إزالة Z أو تحويل +00:00 إن لزم
    s = s.replace("Z", "").replace("z", "")
    try:
        # يدعم "YYYY-MM-DD HH:MM:SS" أو with T
        s2 = s.replace("T", " ").split(".")[0]  # نحذف أجزاء الثواني الطويلة
        # لو في timezone مثل +00:00، نشيله
        if "+" in s2:
            s2 = s2.split("+")[0]
        if "-" in s2 and ":" in s2:
            dt = datetime.fromisoformat(s2)
            return dt.strftime("%Y-%m-%d %H:%M")
    except Exception:
        pass
    # لو ما قدرنا نفسّرها، نرجعها كما هي
    return s


@router.get("/clients/{client_id}/requests")
def list_client_requests(client_id: str, current_user: dict = Depends(get_current_user)):
    """
    يعيد طلبات العميل مع اسم الحرفي +
    الحقول المهمة للعرض في واجهة العميل.

    الواجهة تقرأ:
      - message (نضمن التقاطها من عدة أسماء محتملة)
      - status (حالة العميل: status_client)
      - createdAt (بتنسيق تاريخ + وقت)
      - offerBudget/offerDeadline و/أو contractCost/contractDate
    """
    if current_user.get("user_type") != "client" or _current_user_id(current_user) != str(client_id):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        rows = repo.get_requests_by_client_with_artisan_name(client_id)
        out = []
        for r in rows:
            # التقط الرسالة من أي اسم محتمل
            msg = (
                r.get("description") or
                r.get("request_desc") or
                r.get("req_message") or
                r.get("message") or
                r.get("note") or
                ""
            )

            created = (
                r.get("created_at") or
                r.get("createdAt") or
                r.get("date")
            )

            out.append({
                "_id": r.get("id"),
                "requestType": r.get("request_type", "request"),
                "message": msg,

                # الحالة الظاهرة للعميل = حالة العميل
                "status": r.get("status_client") or r.get("status", "pending"),

                "artisanId": r.get("artisan_id"),
                "artisanName": r.get("artisan_name") or "Unknown",
                "artisanPhone": r.get("artisan_phone"),

                # عرض الحرفي (fallback إلى حقول عامة إن وُجدت)
                "offerBudget": r.get("offer_budget") or r.get("budget"),
                "offerDeadline": r.get("offer_deadline") or r.get("deadline"),

                # بيانات العقد إن وُجدت
                "contractId": r.get("contract_id"),
                "contractCost": r.get("contract_cost"),
                "contractDate": r.get("contract_date"),

                # تاريخ الإنشاء منسّق
                "createdAt": _fmt_dt(created),
            })
        return {"requests": out}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
