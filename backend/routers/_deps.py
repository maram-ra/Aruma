# routers/_deps.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.security import decode_token

bearer_scheme = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if not credentials or not credentials.scheme or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # credentials.scheme = "Bearer", credentials.credentials = token
    token = credentials.credentials
    try:
        payload = decode_token(token)
        # payload: {"sub": "<user_id>", "user_type": "artisan|client", ...}
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
