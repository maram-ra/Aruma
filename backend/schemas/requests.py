
from pydantic import BaseModel, Field
from typing import Optional, Literal

RequestType = Literal["product", "workshop", "live_show"]
RequestStatus = Literal["pending", "accepted", "rejected"]

class RequestCreate(BaseModel):
    artisanId: str
    requestType: RequestType
    message: str = Field(min_length=1)

class RequestPublic(BaseModel):
    _id: str
    clientId: str
    artisanId: str
    requestType: RequestType
    message: str
    status: RequestStatus
    cost: Optional[float] = None
    timeframe: Optional[str] = None
    createdAt: str
    updatedAt: str
