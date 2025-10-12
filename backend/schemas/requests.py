# backend/schemas/requests.py
from pydantic import BaseModel
from typing import Optional

class RequestCreate(BaseModel):
    artisanId: str
    requestType: str  # product, workshop, live_show
    message: str

class RequestOut(BaseModel):
    _id: str
    clientId: str
    artisanId: str
    requestType: str
    message: str
    status: str
    cost: Optional[float] = None
    timeframe: Optional[str] = None
    createdAt: str
    updatedAt: str
