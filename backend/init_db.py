# init_db.py  (شغّليه من داخل مجلد backend)
import sqlite3, os

DB = "aruma.db"
if os.path.exists(DB):
    os.remove(DB)

con = sqlite3.connect(DB)
cur = con.cursor()

# ===== artisans =====
cur.execute("""
CREATE TABLE IF NOT EXISTS artisans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    craft_type TEXT,
    offers_workshop INTEGER DEFAULT 0,
    offers_live_show INTEGER DEFAULT 0,
    offers_product INTEGER DEFAULT 0,
    image TEXT,
    bio TEXT,
    completed_work_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
""")

# ===== clients =====
cur.execute("""
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
""")

# ===== requests =====
cur.execute("""
CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    artisan_id INTEGER NOT NULL,
    request_type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    budget REAL,
    deadline TEXT,
    contract_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id),
    FOREIGN KEY(artisan_id) REFERENCES artisans(id)
);
""")

# ===== contracts =====
cur.execute("""
CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    artisan_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    cost REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(request_id) REFERENCES requests(id),
    FOREIGN KEY(artisan_id) REFERENCES artisans(id),
    FOREIGN KEY(client_id) REFERENCES clients(id)
);
""")

con.commit()
con.close()
print("DB initialized ✔")
