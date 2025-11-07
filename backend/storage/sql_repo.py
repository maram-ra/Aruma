# storage/sql_repo.py (محدث)
import logging
from sqlalchemy import create_engine, Column, String, Boolean, Integer, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from typing import Optional, Dict, Any, List
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    user_type = Column(String, nullable=False)
    
    artisans = relationship("Artisan", back_populates="user")
    clients = relationship("Client", back_populates="user")
    requests = relationship("Request", back_populates="client")
    contracts = relationship("Contract", back_populates="client")

class Artisan(Base):
    __tablename__ = "artisans"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    bio = Column(Text)
    craft_type = Column(String)
    image = Column(String)
    offers_workshop = Column(Boolean, default=False)
    offers_live_show = Column(Boolean, default=False)
    completed_work_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="artisans")
    requests = relationship("Request", back_populates="artisan")
    contracts = relationship("Contract", back_populates="artisan")

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    phone = Column(String)
    address = Column(Text)
    
    user = relationship("User", back_populates="clients")

class Request(Base):
    __tablename__ = "requests"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text)
    budget = Column(Float)
    deadline = Column(String)
    status = Column(String, default="pending")
    client_id = Column(String, ForeignKey("users.id"))
    artisan_id = Column(String, ForeignKey("artisans.id"))
    
    client = relationship("User", back_populates="requests")
    artisan = relationship("Artisan", back_populates="requests")
    contracts = relationship("Contract", back_populates="request")

class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String, ForeignKey("requests.id"))
    client_id = Column(String, ForeignKey("users.id"))
    artisan_id = Column(String, ForeignKey("artisans.id"))
    terms = Column(Text)
    price = Column(Float)
    status = Column(String, default="active")
    
    request = relationship("Request", back_populates="contracts")
    client = relationship("User", back_populates="contracts")
    artisan = relationship("Artisan", back_populates="contracts")

class SQLRepository:
    def __init__(self, connection_string: str):
        if "sqlite" in connection_string:
            self.engine = create_engine(
                connection_string, 
                connect_args={"check_same_thread": False}
            )
        else:
            self.engine = create_engine(connection_string)
        
        Base.metadata.create_all(bind=self.engine)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.logger = logging.getLogger(__name__)

    # باقي الدوال مع التصحيحات...
    def _user_to_dict(self, user: User) -> Dict[str, Any]:
        user_dict = {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "password": user.password, 
            "user_type": user.user_type,
        }
        
        if user.user_type == "artisan" and user.artisans and len(user.artisans) > 0:
            artisan = user.artisans[0]
            user_dict.update({
                "bio": artisan.bio,
                "craftType": artisan.craft_type,
                "image": artisan.image,
                "offersWorkshop": artisan.offers_workshop,  # ✅ صححت
                "offersLiveShow": artisan.offers_live_show,
                "completedWorkCount": artisan.completed_work_count,  # ✅ صححت
                "rating": artisan.rating,
            })
        elif user.user_type == "client" and user.clients and len(user.clients) > 0:
            client = user.clients[0]
            user_dict.update({
                "phone": client.phone,
                "address": client.address,
            })
        
        return user_dict

    def _artisan_to_dict(self, artisan: Artisan) -> Dict[str, Any]:
        return {
            "id": str(artisan.id),
            "user_id": str(artisan.user_id),
            "name": artisan.user.name,
            "email": artisan.user.email,
            "bio": artisan.bio,
            "craftType": artisan.craft_type,
            "image": artisan.image,
            "rating": artisan.rating,
            "completedWorks": artisan.completed_work_count,  # ✅ صححت
            "offersWorkshop": artisan.offers_workshop,  # ✅ صححت
            "offersLiveShow": artisan.offers_live_show,
        }