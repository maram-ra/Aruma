# backend/routers/auth.py
from fastapi import APIRouter, HTTPException
from storage.json_repo import find_user_by_email, insert_user
from core.security import hash_password, verify_password, create_access_token

from schemas.users import ArtisanCreate, ClientCreate

router = APIRouter()

@router.post("/artisan/register")
def register_artisan(payload: ArtisanCreate):
    if find_user_by_email(payload.email, "artisan"):
        raise HTTPException(status_code=409, detail="Email already registered (artisan)")
    user = payload.dict()
    user["password"] = hash_password(payload.password)
    user.setdefault("images", [])
    user.setdefault("completedWorkCount", 0)
    created = insert_user(user, "artisan")
    return {"success": True, "message": "Artisan registered successfully", "data": {"artisan": created}}

@router.post("/client/register")
def register_client(payload: ClientCreate):
    if find_user_by_email(payload.email, "client"):
        raise HTTPException(status_code=409, detail="Email already registered (client)")
    user = payload.dict()
    user["password"] = hash_password(payload.password)
    created = insert_user(user, "client")
    return {"success": True, "message": "Client registered successfully", "data": {"client": created}}

@router.post("/login")
def login_user(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="email and password required")
    artisan = find_user_by_email(email, "artisan")
    if artisan and verify_password(password, artisan["password"]):
        token = create_access_token({"email": email, "type": "artisan"})
        return {"success": True, "message": "Login successful", "data": {"userType": "artisan", "user": artisan, "token": token}}
    client = find_user_by_email(email, "client")
    if client and verify_password(password, client["password"]):
        token = create_access_token({"email": email, "type": "client"})
        return {"success": True, "message": "Login successful", "data": {"userType": "client", "user": client, "token": token}}
    raise HTTPException(status_code=401, detail="Invalid credentials")
