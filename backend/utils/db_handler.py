import json
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "db.json"

def read_db():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def write_db(data):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_collection(role):
    db = read_db()
    if role == "client":
        return db["clients"]
    elif role == "artisan":
        return db["artisans"]
    else:
        raise ValueError("Invalid role")

def save_collection(role, collection):
    db = read_db()
    db_key = "clients" if role == "client" else "artisans"
    db[db_key] = collection
    write_db(db)
