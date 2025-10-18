# utils/jwt_handler.py
import time
import jwt  # PyJWT

SECRET_KEY = "CHANGE_ME_SUPER_SECRET_KEY_Aruma"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 60 * 60 * 24  # 24 ساعة

def create_access_token(payload: dict, expires_in: int = ACCESS_TOKEN_EXPIRE_SECONDS) -> str:
    to_encode = payload.copy()
    to_encode.update({"exp": int(time.time()) + expires_in, "iat": int(time.time())})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict | None:
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
