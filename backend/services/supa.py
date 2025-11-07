# backend/services/supa.py
import os
from dotenv import load_dotenv, find_dotenv
from supabase import create_client, Client

# حمل .env مهما كان مكانه (طالما داخل المشروع)
load_dotenv(find_dotenv(), override=True)

SUPABASE_URL = (os.getenv("SUPABASE_URL") or "").strip()
# نسمح بـ SUPABASE_SERVICE_KEY أو SUPABASE_KEY (احتياط)
SUPABASE_KEY = (os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY") or "").strip()
BUCKET = (os.getenv("SUPABASE_BUCKET") or "uploads").strip()

if not SUPABASE_URL:
    raise RuntimeError("Missing SUPABASE_URL (check your .env and current working directory).")
if not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_SERVICE_KEY (put service role key in .env).")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_bytes(path_in_bucket: str, data: bytes, content_type: str = "application/octet-stream") -> str:
    """
    يرفع ملف إلى ستوريج Supabase ويُرجع المسار العام (public URL) لو البكَت public.
    """
    # ارفع الملف
    supabase.storage.from_(BUCKET).upload(path_in_bucket, data, {"content-type": content_type, "upsert": True})
    # ابنِ رابط الوصول العام (إذا كان البكت Public)
    public_url = supabase.storage.from_(BUCKET).get_public_url(path_in_bucket)
    # بعض إصدارات SDK ترجع dict، نتأكد نطلع الرابط كنص
    if isinstance(public_url, dict) and "publicUrl" in public_url:
        return public_url["publicUrl"]
    return str(public_url)
