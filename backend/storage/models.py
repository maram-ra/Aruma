
# Merge these into your existing SQLAlchemy models (edit names if needed)
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class RequestStatusEnum(enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class ContractStatusEnum(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"

class Artisan(Base):
    __tablename__ = "artisans"
    # ... your columns ...
    requests = relationship("Request", back_populates="artisan", cascade="all,delete")

class Client(Base):
    __tablename__ = "clients"
    # ... your columns ...
    requests = relationship("Request", back_populates="client", cascade="all,delete")

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=False)
    requestType = Column(String, nullable=False)  # product/workshop/live_show
    message = Column(Text, default="")
    status = Column(Enum(RequestStatusEnum), default=RequestStatusEnum.pending)
    contract_cost = Column(Float, nullable=True)
    contract_date = Column(String, nullable=True) # ISO date string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = relationship("Client", back_populates="requests")
    artisan = relationship("Artisan", back_populates="requests")
    contract = relationship("Contract", back_populates="request", uselist=False, cascade="all,delete")

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=False, unique=True)
    status = Column(Enum(ContractStatusEnum), default=ContractStatusEnum.pending)
    cost = Column(Float, nullable=True)
    timeframe = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    request = relationship("Request", back_populates="contract")
