
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Aruma Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "CHANGE_ME_SUPER_SECRET"  # override via env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    ALGORITHM: str = "HS256"
    DB_FILE: str = "db.json"

    class Config:
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
