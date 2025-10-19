from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# Shared
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str
    user_id: str

# Artisan
class ArtisanBase(BaseModel):
    name: str
    email: EmailStr
    bio: Optional[str] = None
    craftType: Optional[str] = None
    images: Optional[List[str]] = []
    offersWorkshop: bool = False
    offersLiveShow: bool = False
    completedWorkCount: int = 0


class ArtisanCreate(ArtisanBase):
    password: str = Field(min_length=6)


class ArtisanPublic(ArtisanBase):
    id: str = Field(alias="_id")

    class Config:
        allow_population_by_field_name = True


class ArtisanUpdate(BaseModel):
    bio: Optional[str] = None
    craftType: Optional[str] = None
    images: Optional[List[str]] = None
    offersWorkshop: Optional[bool] = None
    offersLiveShow: Optional[bool] = None


# Client
class ClientBase(BaseModel):
    name: str
    email: EmailStr


class ClientCreate(ClientBase):
    password: str = Field(min_length=6)


class ClientPublic(ClientBase):
    id: str = Field(alias="_id")

    class Config:
        allow_population_by_field_name = True


# Auth
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
