from pydantic import BaseModel
from typing import Optional, Literal

ContractStatus = Literal["pending", "confirmed", "completed"]

class ContractPublic(BaseModel):
    _id: str
    requestId: str
    artisanId: str
    clientId: str
    status: ContractStatus
    cost: float
    message: Optional[str] = None
    date: Optional[str] = None
    createdAt: str
    updatedAt: str


class SetTermsRequest(BaseModel):
    cost: float
    message: str
    date: str  # YYYY-MM-DD format
