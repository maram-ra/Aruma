from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.config import get_settings
from routers import auth, artisans, clients, requests as reqs, contracts, upload  

settings = get_settings()
app = FastAPI(title=settings.APP_NAME, version="0.1.0")

# 🔹 Mount images directory
app.mount("/images", StaticFiles(directory="../frontend/public/images"), name="images")

# 🔹 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(artisans.router, prefix=settings.API_V1_STR)
app.include_router(clients.router, prefix=settings.API_V1_STR)
app.include_router(reqs.router, prefix=settings.API_V1_STR)
app.include_router(contracts.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)  # ← هنا المهم جدًا

@app.get("/")
def root():
    return {"message": "Aruma backend is running", "docs": "/docs"}
