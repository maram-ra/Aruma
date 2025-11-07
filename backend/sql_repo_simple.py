# storage/sql_repo_simple.py
import logging
from sqlalchemy import create_engine, Column, String, Boolean, Integer, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from typing import Optional, Dict, Any, List
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    user_type = Column(String, nullable=False)
    
    artisans = relationship("Artisan", back_populates="user")
    clients = relationship("Client", back_populates="user")

class Artisan(Base):
    __tablename__ = "artisans"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    bio = Column(Text)
    craft_type = Column(String)
    image = Column(String)
    offers_workshop = Column(Boolean, default=False)
    offers_live_show = Column(Boolean, default=False)
    completed_work_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="artisans")

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    phone = Column(String)
    address = Column(Text)
    
    user = relationship("User", back_populates="clients")

class Request(Base):
    __tablename__ = "requests"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    budget = Column(Float)
    deadline = Column(String)
    status = Column(String, default="pending")
    client_id = Column(String, ForeignKey("users.id"))
    artisan_id = Column(String, ForeignKey("artisans.id"))
    
    client = relationship("User", foreign_keys=[client_id])
    artisan = relationship("Artisan", foreign_keys=[artisan_id])

class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True, index=True)
    request_id = Column(String, ForeignKey("requests.id"))
    client_id = Column(String, ForeignKey("users.id"))
    artisan_id = Column(String, ForeignKey("artisans.id"))
    terms = Column(Text)
    price = Column(Float)
    status = Column(String, default="active")
    
    request = relationship("Request")
    client = relationship("User", foreign_keys=[client_id])
    artisan = relationship("Artisan", foreign_keys=[artisan_id])

class ArtisanImage(Base):
    __tablename__ = "artisan_images"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    artisan_id = Column(String, ForeignKey("artisans.id"))
    image_url = Column(String)
    display_order = Column(Integer, default=0)
    
    artisan = relationship("Artisan")

class SQLRepository:
    def __init__(self, connection_string: str):
        self.engine = create_engine(
            connection_string, 
            connect_args={"check_same_thread": False}
        )
        
        Base.metadata.create_all(bind=self.engine)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.logger = logging.getLogger(__name__)

    def get_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def find_user_by_email(self, user_type: str, email: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                return None
            
            if user.user_type != user_type:
                return None
            
            return self._user_to_dict(user)
        except Exception as e:
            self.logger.error(f"Error finding user by email: {e}")
            return None
        finally:
            db.close()

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        db = self.SessionLocal()
        try:
            user = User(
                id=user_data.get("id", str(uuid.uuid4())),
                name=user_data["name"],
                email=user_data["email"],
                password=user_data["password"],
                user_type=user_data["user_type"]
            )
            db.add(user)
            
            if user_data["user_type"] == "artisan":
                artisan = Artisan(
                    id=user_data.get("id", str(uuid.uuid4())),
                    user_id=user.id,
                    bio=user_data.get("bio", ""),
                    craft_type=user_data.get("craft_type", ""),
                    image=user_data.get("image", ""),
                    offers_workshop=user_data.get("offers_workshop", False),
                    offers_live_show=user_data.get("offers_live_show", False),
                    completed_work_count=user_data.get("completed_work_count", 0)
                )
                db.add(artisan)
            
            elif user_data["user_type"] == "client":
                client = Client(
                    id=user_data.get("id", str(uuid.uuid4())),
                    user_id=user.id,
                    phone=user_data.get("phone", ""),
                    address=user_data.get("address", "")
                )
                db.add(client)
            
            db.commit()
            return self._user_to_dict(user)
        except Exception as e:
            db.rollback()
            self.logger.error(f"Error creating user: {e}")
            raise
        finally:
            db.close()

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            return self._user_to_dict(user)
        except Exception as e:
            self.logger.error(f"Error getting user by id: {e}")
            return None
        finally:
            db.close()

    def get_all_artisans(self) -> List[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            artisans = db.query(Artisan).all()
            return [self._artisan_to_dict(artisan) for artisan in artisans]
        except Exception as e:
            self.logger.error(f"Error getting all artisans: {e}")
            return []
        finally:
            db.close()

    def get_artisan_by_id(self, artisan_id: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
            if not artisan:
                return None
            return self._artisan_to_dict(artisan)
        except Exception as e:
            self.logger.error(f"Error getting artisan by id: {e}")
            return None
        finally:
            db.close()

    def update_artisan(self, artisan_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
            if not artisan:
                return None
            
            for key, value in update_data.items():
                if hasattr(artisan, key):
                    setattr(artisan, key, value)
            
            db.commit()
            db.refresh(artisan)
            return self._artisan_to_dict(artisan)
        except Exception as e:
            db.rollback()
            self.logger.error(f"Error updating artisan: {e}")
            return None
        finally:
            db.close()

    def create_request(self, request_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            request = Request(
                id=str(uuid.uuid4()),
                title=request_data["title"],
                description=request_data.get("description", ""),
                budget=request_data.get("budget", 0),
                deadline=request_data.get("deadline"),
                client_id=request_data["client_id"],
                artisan_id=request_data["artisan_id"]
            )
            db.add(request)
            db.commit()
            db.refresh(request)
            return self._request_to_dict(request)
        except Exception as e:
            db.rollback()
            self.logger.error(f"Error creating request: {e}")
            return None
        finally:
            db.close()

    def get_request_by_id(self, request_id: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            request = db.query(Request).filter(Request.id == request_id).first()
            if not request:
                return None
            return self._request_to_dict(request)
        except Exception as e:
            self.logger.error(f"Error getting request by id: {e}")
            return None
        finally:
            db.close()

    def get_requests_by_artisan(self, artisan_id: str) -> List[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            requests = db.query(Request).filter(Request.artisan_id == artisan_id).all()
            return [self._request_to_dict(req) for req in requests]
        except Exception as e:
            self.logger.error(f"Error getting requests by artisan: {e}")
            return []
        finally:
            db.close()

    def get_requests_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            requests = db.query(Request).filter(Request.client_id == client_id).all()
            return [self._request_to_dict(req) for req in requests]
        except Exception as e:
            self.logger.error(f"Error getting requests by client: {e}")
            return []
        finally:
            db.close()

    def update_request_status(self, request_id: str, status: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            request = db.query(Request).filter(Request.id == request_id).first()
            if not request:
                return None
            
            request.status = status
            db.commit()
            db.refresh(request)
            return self._request_to_dict(request)
        except Exception as e:
            db.rollback()
            self.logger.error(f"Error updating request status: {e}")
            return None
        finally:
            db.close()

    def create_contract(self, contract_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            contract = Contract(
                id=str(uuid.uuid4()),
                request_id=contract_data["request_id"],
                client_id=contract_data["client_id"],
                artisan_id=contract_data["artisan_id"],
                terms=contract_data.get("terms", ""),
                price=contract_data.get("price", 0)
            )
            db.add(contract)
            db.commit()
            db.refresh(contract)
            return self._contract_to_dict(contract)
        except Exception as e:
            db.rollback()
            self.logger.error(f"Error creating contract: {e}")
            return None
        finally:
            db.close()

    def get_contract_by_id(self, contract_id: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            contract = db.query(Contract).filter(Contract.id == contract_id).first()
            if not contract:
                return None
            return self._contract_to_dict(contract)
        except Exception as e:
            self.logger.error(f"Error getting contract by id: {e}")
            return None
        finally:
            db.close()

    def update_contract_status(self, contract_id: str, status: str) -> Optional[Dict[str, Any]]:
        db = self.SessionLocal()
        try:
            contract = db.query(Contract).filter(Contract.id == contract_id).first()
            if not contract:
                return None
            
            contract.status = status
            db.commit()
            db.refresh(contract)
            return self._contract_to_dict(contract)
        except Exception as e:
            db.rollback()
            self.logger.error(f"Error updating contract status: {e}")
            return None
        finally:
            db.close()

    def _user_to_dict(self, user: User) -> Dict[str, Any]:
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "password": user.password,
            "user_type": user.user_type,
        }

    def _artisan_to_dict(self, artisan: Artisan) -> Dict[str, Any]:
        return {
            "id": artisan.id,
            "user_id": artisan.user_id,
            "name": artisan.user.name,
            "email": artisan.user.email,
            "bio": artisan.bio,
            "craftType": artisan.craft_type,
            "image": artisan.image,
            "offersWorkshop": artisan.offers_workshop,
            "offersLiveShow": artisan.offers_live_show,
            "completedWorkCount": artisan.completed_work_count,
            "rating": artisan.rating,
        }

    def _request_to_dict(self, request: Request) -> Dict[str, Any]:
        return {
            "id": request.id,
            "title": request.title,
            "description": request.description,
            "budget": request.budget,
            "deadline": request.deadline,
            "status": request.status,
            "client_id": request.client_id,
            "artisan_id": request.artisan_id,
            "client_name": request.client.name if request.client else "Unknown",
            "artisan_name": request.artisan.user.name if request.artisan and request.artisan.user else "Unknown",
        }

    def _contract_to_dict(self, contract: Contract) -> Dict[str, Any]:
        return {
            "id": contract.id,
            "request_id": contract.request_id,
            "client_id": contract.client_id,
            "artisan_id": contract.artisan_id,
            "terms": contract.terms,
            "price": contract.price,
            "status": contract.status,
            "client_name": contract.client.name if contract.client else "Unknown",
            "artisan_name": contract.artisan.user.name if contract.artisan and contract.artisan.user else "Unknown",
            "request_title": contract.request.title if contract.request else "Unknown",
        }