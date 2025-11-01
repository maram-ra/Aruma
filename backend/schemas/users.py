from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# =============================
# 🔸 Shared
# =============================
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str
    user_id: str


# =============================
# 🔸 Artisan Models
# =============================
class ArtisanBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None
    craftType: Optional[str] = None
    images: Optional[List[str]] = []
    galleryTitles: Optional[List[str]] = []  # 🆕 أسماء الأعمال (تطابق الصور)
    offersWorkshop: bool = False
    offersLiveShow: bool = False
    offersProduct: bool = False
    completedWorkCount: int = 0


class ArtisanCreate(ArtisanBase):
    password: str = Field(min_length=6)


class ArtisanUpdate(BaseModel):
    bio: Optional[str] = None
    craftType: Optional[str] = None
    images: Optional[List[str]] = None
    galleryTitles: Optional[List[str]] = None  # 🆕 إضافة دعم تحديث أسماء الصور
    offersWorkshop: Optional[bool] = None
    offersLiveShow: Optional[bool] = None
    offersProduct: Optional[bool] = None


class ArtisanPublic(ArtisanBase):
    """Public representation of an artisan (DB-facing id alias)."""
    id: str = Field(alias="_id")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True  # يسهل التوافق مع ORM مستقبلاً


# =============================
# 🔸 Client Models
# =============================
class ClientBase(BaseModel):
    name: str
    email: EmailStr


class ClientCreate(ClientBase):
    password: str = Field(min_length=6)


class ClientPublic(ClientBase):
    id: str = Field(alias="_id")

    class Config:
        allow_population_by_field_name = True


# =============================
# Auth
# =============================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
