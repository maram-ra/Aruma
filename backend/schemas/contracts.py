
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
    timeframe: str
    createdAt: str
    updatedAt: str

class SetTermsRequest(BaseModel):
    cost: float
    timeframe: str
    additionalNotes: Optional[str] = None
