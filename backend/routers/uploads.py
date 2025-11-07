# routers/uploads.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.supa import supabase, BUCKET
import uuid

# ✅ استخدم prefix بالجمع ليطابق المسار في الفرونت
router = APIRouter(prefix="/uploads", tags=["uploads"])

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    يرفع الصورة إلى Supabase Storage ويعيد رابطها العام.
    """
    try:
        # استخراج الامتداد من اسم الملف
        ext = (file.filename or "").split(".")[-1].lower() or "bin"
        key = f"{uuid.uuid4().hex}.{ext}"

        # قراءة بيانات الملف
        data = await file.read()

        # رفع إلى Supabase Storage
        res = supabase.storage.from_(BUCKET).upload(
            key,
            data,
            {"content-type": file.content_type},
        )

        # جعل الرابط عامًا (طالما البكت Public للقراءة)
        public_url = supabase.storage.from_(BUCKET).get_public_url(key)

        # ✅ ارجاع الرابط للفرونت مباشرة
        return {"url": public_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")
