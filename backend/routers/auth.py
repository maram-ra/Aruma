# routers/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from database import repo
from core.security import hash_pwd, verify_pwd, create_access_token

# نخلي البادئة هنا، وبكذا المسارات تكون تحت /api/v1/auth/...
router = APIRouter(prefix="/auth", tags=["auth"])


# ====== Schemas ======
class ArtisanRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    craftType: str
    phone: str | None = ""                 # مهم عشان يظهر في Swagger
    offersWorkshop: bool = False
    offersLiveShow: bool = False
    offersProduct: bool = False


class ClientRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


# ====== Endpoints ======
@router.post("/artisan/register")
def artisan_register(body: ArtisanRegister):
    # فحص تكرار الإيميل
    existing = repo.get_user_by_email_and_type(body.email, "artisan")
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    try:
        artisan = repo.create_artisan(
            name=body.name,
            email=body.email,
            password_hash=hash_pwd(body.password),
            craft_type=body.craftType,
            phone=body.phone or "",
            offers_workshop=body.offersWorkshop,
            offers_live_show=body.offersLiveShow,
            offers_product=body.offersProduct,
        )
    except ValueError as e:
        # لو رجّع repo قيمة EMAIL_TAKEN
        if str(e) == "EMAIL_TAKEN":
            raise HTTPException(status_code=409, detail="Email already registered")
        raise

    token = create_access_token(sub=str(artisan["id"]), user_type="artisan")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "artisan",
        "user_id": artisan["id"],
        "name": artisan["name"],
    }


@router.post("/client/register")
def client_register(body: ClientRegister):
    existing = repo.get_user_by_email_and_type(body.email, "client")
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    client = repo.create_client(
        name=body.name,
        email=body.email,
        password_hash=hash_pwd(body.password),
    )

    token = create_access_token(sub=str(client["id"]), user_type="client")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "client",
        "user_id": client["id"],
        "name": client["name"],
    }


@router.post("/artisan/login")
def artisan_login(body: LoginPayload):
    user = repo.get_user_by_email_and_type(body.email, "artisan")
    if not user or not verify_pwd(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(sub=str(user["id"]), user_type="artisan")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "artisan",
        "user_id": user["id"],
        "name": user["name"],
    }


@router.post("/client/login")
def client_login(body: LoginPayload):
    user = repo.get_user_by_email_and_type(body.email, "client")
    if not user or not verify_pwd(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(sub=str(user["id"]), user_type="client")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_type": "client",
        "user_id": user["id"],
        "name": user["name"],
    }
