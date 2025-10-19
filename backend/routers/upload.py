from fastapi import APIRouter, File, UploadFile
from pathlib import Path
import uuid, shutil

router = APIRouter(prefix="/upload", tags=["upload"])

# 🔹 المسار الكامل لمجلد الصور داخل مشروع الفرونت
FRONT_IMAGES = Path("..") / "frontend" / "public" / "images"
FRONT_IMAGES.mkdir(parents=True, exist_ok=True)

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    # توليد اسم فريد للملف
    ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{ext}"
    file_path = FRONT_IMAGES / file_name

    # حفظ الملف فعليًا داخل مجلد الصور
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # إرجاع الرابط النسبي المستخدم في الواجهة
    return {"url": f"/images/{file_name}"}
