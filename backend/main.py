from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routers import auth, artisans, clients  # requests.py and contracts.py will be added later

# Create FastAPI application instance
app = FastAPI(title=settings.APP_NAME)

# Enable CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow all origins (can be restricted later to specific domains)
    allow_credentials=True,
    allow_methods=["*"],        # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],        # Allow all headers
)

# Health check endpoint (useful for testing if the server is running)
@app.get("/")
def health_check():
    return {
        "name": settings.APP_NAME,
        "env": settings.APP_ENV,
        "ok": True
    }

# Register API routers (authentication, artisan, client, etc.)
app.include_router(auth.router)
app.include_router(artisans.router)
app.include_router(clients.router)
