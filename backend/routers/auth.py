
from fastapi import APIRouter, HTTPException
from fastapi import Depends
from pydantic import BaseModel
from storage.json_repo import JSONRepository
from core.security import hash_password, verify_password, create_access_token
from schemas.users import ArtisanCreate, ClientCreate, LoginRequest, Token, ArtisanPublic, ClientPublic

router = APIRouter(prefix="/auth", tags=["auth"])
repo = JSONRepository()

@router.post("/artisan/register", response_model=ArtisanPublic, status_code=201)
def register_artisan(payload: ArtisanCreate):
    if repo.find_user_by_email("artisan", payload.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    record = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "bio": payload.bio,
        "craftType": payload.craftType,
        "images": payload.images or [],
        "offersWorkshop": payload.offersWorkshop,
        "offersLiveShow": payload.offersLiveShow,
        "completedWorkCount": 0
    }
    created = repo.create_artisan(record)
    created.pop("password", None)
    return created

@router.post("/client/register", response_model=ClientPublic, status_code=201)
def register_client(payload: ClientCreate):
    if repo.find_user_by_email("client", payload.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    record = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
    }
    created = repo.create_client(record)
    created.pop("password", None)
    return created

@router.post("/artisan/login", response_model=Token)
def login_artisan(payload: LoginRequest):
    user = repo.find_user_by_email("artisan", payload.email)
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user["_id"], "user_type": "artisan"})
    return {"access_token": token, "user_type": "artisan", "user_id": user["_id"]}

@router.post("/client/login", response_model=Token)
def login_client(payload: LoginRequest):
    user = repo.find_user_by_email("client", payload.email)
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user["_id"], "user_type": "client"})
    return {"access_token": token, "user_type": "client", "user_id": user["_id"]}
