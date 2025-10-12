# backend/storage/json_repo.py
import json
import os
from threading import Lock
from datetime import datetime
from uuid import uuid4
from core.config import settings

_lock = Lock()

def _ensure_db():
    if not os.path.exists(settings.DB_PATH):
        with open(settings.DB_PATH, "w", encoding="utf-8") as f:
            json.dump({"artisans": [], "clients": [], "requests": [], "contracts": []}, f, indent=4, ensure_ascii=False)

def load_db():
    _ensure_db()
    with open(settings.DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(db):
    with _lock:
        with open(settings.DB_PATH, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=4, ensure_ascii=False)

# Users
def find_user_by_email(email: str, user_type: str):
    db = load_db()
    key = "artisans" if user_type == "artisan" else "clients"
    for u in db.get(key, []):
        if u.get("email") == email:
            return u
    return None

def insert_user(user: dict, user_type: str):
    db = load_db()
    key = "artisans" if user_type == "artisan" else "clients"
    user["_id"] = str(uuid4())
    user["createdAt"] = datetime.utcnow().isoformat()
    user["updatedAt"] = user["createdAt"]
    db[key].append(user)
    save_db(db)
    return user

def update_user(user_id: str, data: dict, user_type: str):
    db = load_db()
    key = "artisans" if user_type == "artisan" else "clients"
    for i, u in enumerate(db.get(key, [])):
        if u.get("_id") == user_id:
            db[key][i].update(data)
            db[key][i]["updatedAt"] = datetime.utcnow().isoformat()
            save_db(db)
            return db[key][i]
    return None

def get_user_by_id(user_id: str, user_type: str):
    db = load_db()
    key = "artisans" if user_type == "artisan" else "clients"
    for u in db.get(key, []):
        if u.get("_id") == user_id:
            return u
    return None

# Requests
def insert_request(request: dict):
    db = load_db()
    request["_id"] = str(uuid4())
    request["status"] = "pending"
    request["createdAt"] = datetime.utcnow().isoformat()
    request["updatedAt"] = request["createdAt"]
    db["requests"].append(request)
    save_db(db)
    return request

def get_request_by_id(req_id: str):
    db = load_db()
    for r in db.get("requests", []):
        if r.get("_id") == req_id:
            return r
    return None

def update_request(req_id: str, updates: dict):
    db = load_db()
    for i, r in enumerate(db.get("requests", [])):
        if r.get("_id") == req_id:
            db["requests"][i].update(updates)
            db["requests"][i]["updatedAt"] = datetime.utcnow().isoformat()
            save_db(db)
            return db["requests"][i]
    return None

def list_requests_for_artisan(artisan_id: str, status: str = None):
    db = load_db()
    res = [r for r in db.get("requests", []) if r.get("artisanId") == artisan_id]
    if status:
        res = [r for r in res if r.get("status") == status]
    return res

def list_requests_for_client(client_id: str):
    db = load_db()
    return [r for r in db.get("requests", []) if r.get("clientId") == client_id]

# Contracts
def insert_contract(contract: dict):
    db = load_db()
    contract["_id"] = str(uuid4())
    contract["status"] = contract.get("status", "pending")
    contract["createdAt"] = datetime.utcnow().isoformat()
    contract["updatedAt"] = contract["createdAt"]
    db["contracts"].append(contract)
    save_db(db)
    return contract

def get_contract_by_id(cid: str):
    db = load_db()
    for c in db.get("contracts", []):
        if c.get("_id") == cid:
            return c
    return None

def update_contract(cid: str, updates: dict):
    db = load_db()
    for i, c in enumerate(db.get("contracts", [])):
        if c.get("_id") == cid:
            db["contracts"][i].update(updates)
            db["contracts"][i]["updatedAt"] = datetime.utcnow().isoformat()
            save_db(db)
            return db["contracts"][i]
    return None

def list_contracts_for_user(user_id: str):
    db = load_db()
    return [c for c in db.get("contracts", []) if c.get("artisanId") == user_id or c.get("clientId") == user_id]
