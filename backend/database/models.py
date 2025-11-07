
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Float, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base
import enum

class RequestStatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class ContractStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"

class Artisan(Base):
    __tablename__ = "artisans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    bio = Column(Text, default="")
    craft_type = Column(String, default="")
    image = Column(Text, nullable=True)  # profile image URL
    offers_workshop = Column(Boolean, default=False)
    offers_live_show = Column(Boolean, default=False)
    offers_product = Column(Boolean, default=False)
    completed_work_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    requests = relationship("Request", back_populates="artisan", cascade="all,delete")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    requests = relationship("Request", back_populates="client", cascade="all,delete")

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    artisan_id = Column(Integer, ForeignKey("artisans.id"), nullable=False)
    request_type = Column(String, nullable=False)  # product/workshop/live_show
    description = Column(Text, default="")
    status = Column(Enum(RequestStatusEnum), default=RequestStatusEnum.pending)
    budget = Column(Float, nullable=True)  # == contract_cost
    deadline = Column(String, nullable=True)  # == contract_date (ISO string)
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
