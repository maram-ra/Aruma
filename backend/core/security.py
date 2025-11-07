# core/security.py
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import Optional

# ندعم التحقق من bcrypt لو فيه كلمات مرور قديمة,
# بس الافتراضي للحفظ جديدًا: pbkdf2_sha256 (مستقر، بدون مشاكل على ويندوز)
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],
    deprecated="auto",
)

JWT_SECRET = "change-me-in-env"  # ضعيه من .env بالانتاج
JWT_ALG = "HS256"
JWT_EXPIRE_MIN = 60 * 24 * 7  # أسبوع

def hash_pwd(password: str) -> str:
    return pwd_context.hash(password)

def verify_pwd(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(sub: str, user_type: str, expires_minutes: int = JWT_EXPIRE_MIN) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=expires_minutes)
    to_encode = {"sub": sub, "user_type": user_type, "iat": int(now.timestamp()), "exp": int(exp.timestamp())}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except JWTError:
        return None
