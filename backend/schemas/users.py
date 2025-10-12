# backend/schemas/users.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserBase(BaseModel):
    name: str
    email: EmailStr

class ArtisanCreate(UserBase):
    password: str
    craftType: Optional[str] = ""
    bio: Optional[str] = ""
    offersWorkshop: Optional[bool] = False
    offersLiveShow: Optional[bool] = False
    images: Optional[List[str]] = []

class ClientCreate(UserBase):
    password: str

class UserOut(BaseModel):
    _id: str
    name: str
    email: EmailStr
    craftType: Optional[str] = None
    bio: Optional[str] = None
    offersWorkshop: Optional[bool] = False
    offersLiveShow: Optional[bool] = False
    images: Optional[List[str]] = []
    createdAt: str
    updatedAt: str

class TokenOut(BaseModel):
    userType: str
    token: str
