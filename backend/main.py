# --- imports ---
from dotenv import load_dotenv
load_dotenv(override=True)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import debug as debug_router

from routers import auth, artisans, clients, requests as requests_router, contracts
from routers import uploads as uploads_router   # ✅ اسم الملف الصحيح

app = FastAPI(title="Aruma API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static
app.mount("/static", StaticFiles(directory="static"), name="static")

# routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(artisans.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
app.include_router(requests_router.router, prefix="/api/v1")
app.include_router(contracts.router, prefix="/api/v1")
app.include_router(uploads_router.router, prefix="/api/v1", tags=["upload"])  # ✅



app.include_router(debug_router.router, prefix="/api/v1")
