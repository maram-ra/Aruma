from fastapi import FastAPI
from routers import auth
from fastapi.middleware.cors import CORSMiddleware  

app = FastAPI(title="Aruma MVP Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Aruma API is running"}
