# backend/database/__init__.py
import os

# تأكدنا أن .env تم تحميله حتى لو ما انقرأ في main بعد
try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
except Exception:
    pass

VAL = (os.getenv("USE_POSTGRES", "0") or "").strip().lower()
USE_PG = VAL in ("1", "true", "yes")

if USE_PG:
    # 👈 المهم: نستخدم repo_pg ونصدّره باسم repo
    from . import repo_pg as repo
    # في حال الراوترات تحتاج دوال/كلاسات بالاسم المباشر
    from .repo_pg import *  # noqa
else:
    from . import repo as repo
    from .repo import *  # noqa

# تتبع بسيط يظهر وقت الاستيراد (يظهر في Console مرة واحدة)
try:
    print(f"[database.__init__] USE_POSTGRES={VAL} -> using: {repo.__name__ if hasattr(repo,'__name__') else repo}")
except Exception:
    pass
