from fastapi import APIRouter, HTTPException, Form, Depends, Header
from pydantic import BaseModel
from utils.db_handler import read_db, write_db
from utils.jwt_handler import create_access_token, decode_token
from passlib.hash import bcrypt
import uuid

router = APIRouter(prefix="/auth", tags=["Auth"])

# ========== نموذج التسجيل ==========
class RegisterInput(BaseModel):
    name: str
    email: str
    password: str
    role: str
    craftTypes: list[str] | None = []
    services: list[str] | None = []


# ========== تسجيل المستخدم ==========
@router.post("/register")
def register_user(data: RegisterInput):
    db = read_db()
    # اختيار القسم الصحيح حسب الدور
    collection_key = "clients" if data.role == "client" else "artisans"
    users = db[collection_key]

    # التحقق من وجود الإيميل مسبقًا في نفس النوع
    if any(u["email"] == data.email for u in users):
        raise HTTPException(status_code=400, detail="Email already registered for this role")

    new_user = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password": bcrypt.hash(data.password),
        "role": data.role,
        "craftTypes": data.craftTypes,
        "services": data.services,
    }

    users.append(new_user)
    db[collection_key] = users
    write_db(db)

    user_public = {k: v for k, v in new_user.items() if k != "password"}
    return {"message": "User registered successfully", "user": user_public}


# ========== تسجيل الدخول ==========
@router.post("/login")
def login_user(email: str = Form(...), password: str = Form(...), role: str = Form(...)):
    db = read_db()
    users = db["clients"] if role == "client" else db["artisans"]

    user = next((u for u in users if u["email"] == email), None)
    if not user or not bcrypt.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user["id"], "role": user["role"], "email": user["email"]})
    user_public = {k: v for k, v in user.items() if k != "password"}

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": user_public
    }


# ========== التحقق من التوكن ==========
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1].strip()
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = read_db()
    role = payload.get("role")
    users = db["clients"] if role == "client" else db["artisans"]

    user = next((u for u in users if u["id"] == payload.get("sub")), None)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {k: v for k, v in user.items() if k != "password"}


# ========== المسار المحمي ==========
@router.get("/me")
def read_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}
