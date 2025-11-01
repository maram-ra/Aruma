from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# ----------------------------
# Shared
# ----------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str
    user_id: str


# ----------------------------
# Artisan
# ----------------------------
class ArtisanBase(BaseModel):
    """Base fields shared by Artisan models."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None
    craftType: Optional[str] = None
    images: List[str] = Field(default_factory=list)   # avoid mutable default
    offersWorkshop: bool = False
    offersLiveShow: bool = False
    completedWorkCount: int = 0


class ArtisanCreate(ArtisanBase):
    """Payload for creating an artisan user."""
    password: str = Field(min_length=6)


class ArtisanPublic(ArtisanBase):
    """Public representation of an artisan (DB-facing id alias)."""
    id: str = Field(alias="_id")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True  # optional: helps if using ORM objects


class ArtisanUpdate(BaseModel):
    """Partial update payload for an artisan."""
    bio: Optional[str] = None
    craftType: Optional[str] = None
    images: Optional[List[str]] = None
    offersWorkshop: Optional[bool] = None
    offersLiveShow: Optional[bool] = None


# ----------------------------
# Client
# ----------------------------
class ClientBase(BaseModel):
    """Base fields shared by Client models."""
    name: str
    email: EmailStr


class ClientCreate(ClientBase):
    """Payload for creating a client user."""
    password: str = Field(min_length=6)


class ClientPublic(ClientBase):
    """Public representation of a client (DB-facing id alias)."""
    id: str = Field(alias="_id")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True  # optional


# ----------------------------
# Auth
# ----------------------------
class LoginRequest(BaseModel):
    """Login payload for both artisan/client (by email)."""
    email: EmailStr
    password: str
