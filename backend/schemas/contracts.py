# backend/schemas/contracts.py
from pydantic import BaseModel
from typing import Optional

class ContractTerms(BaseModel):
    cost: float
    timeframe: str
    additionalNotes: Optional[str] = None

class ContractOut(BaseModel):
    _id: str
    requestId: str
    artisanId: str
    clientId: str
    status: str
    cost: float
    timeframe: str
    createdAt: str
    updatedAt: str
