# _migrate_db.py
import sqlite3

DB = "aruma.db"
con = sqlite3.connect(DB)
cur = con.cursor()

def add(col, type_sql):
    try:
        cur.execute(f"ALTER TABLE artisans ADD COLUMN {col} {type_sql}")
        print(f"+ added artisans.{col}")
    except sqlite3.OperationalError as e:
        msg = str(e).lower()
        if "duplicate column name" in msg or "already exists" in msg:
            print(f"= exists artisans.{col}")
        else:
            print(f"! {col}: {e}")

# لو الجدول قديم/غير موجود، نضمن وجوده كبداية
cur.execute("""
CREATE TABLE IF NOT EXISTS artisans(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
""")

# الأعمدة المطلوبة
add("email", "TEXT")
add("password_hash", "TEXT")
add("phone", "TEXT")
add("craft_type", "TEXT")
add("offers_workshop", "INTEGER DEFAULT 0")
add("offers_live_show", "INTEGER DEFAULT 0")
add("offers_product", "INTEGER DEFAULT 0")
add("image", "TEXT")
add("bio", "TEXT")
add("completed_work_count", "INTEGER DEFAULT 0")

# جداول أساسية أخرى (لن تُعاد إن كانت موجودة)
cur.execute("""
CREATE TABLE IF NOT EXISTS clients(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS requests(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  artisan_id INTEGER NOT NULL,
  request_type TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  budget REAL,
  deadline TEXT,
  created_at TEXT DEFAULT (datetime('now'))
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS contracts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER,
  client_id INTEGER,
  artisan_id INTEGER,
  cost REAL,
  date TEXT,
  status TEXT DEFAULT 'created',
  created_at TEXT DEFAULT (datetime('now'))
)
""")

# فهارس البريد (تتجاهل إذا موجودة)
try:
    cur.execute("CREATE UNIQUE INDEX idx_artisans_email ON artisans(email)")
except sqlite3.OperationalError:
    pass

try:
    cur.execute("CREATE UNIQUE INDEX idx_clients_email ON clients(email)")
except sqlite3.OperationalError:
    pass

con.commit()
con.close()
print("Migration OK")
