
from fastapi import Header, HTTPException
from core.security import decode_token

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    ok, payload = decode_token(token)
    if not ok:
        raise HTTPException(status_code=401, detail=payload.get("detail", "Invalid token"))
    return payload  # contains sub (user id) and user_type
