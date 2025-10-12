# backend/core/config.py
# initial ver
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env" if (BASE_DIR / ".env").exists() else None)

class Settings:
    DB_PATH = str(BASE_DIR / "db.json")
    JWT_SECRET = os.getenv("ARUMA_SECRET", "change_this_in_production")
    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", 3600))

settings = Settings()
