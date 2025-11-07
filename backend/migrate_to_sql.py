# migrate_to_sql_simple.py
import json
import sqlite3
import uuid
from datetime import datetime

def create_tables_simple():
    """Create simple database tables"""
    conn = sqlite3.connect('aruma.db')
    
    # حذف الجداول القديمة أولاً
    tables = ['artisan_images', 'contracts', 'requests', 'clients', 'artisans', 'users']
    for table in tables:
        try:
            conn.execute(f'DROP TABLE IF EXISTS {table}')
        except:
            pass
    
    # إنشاء الجداول بشكل بسيط
    conn.execute('''
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            user_type TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    
    conn.execute('''
        CREATE TABLE artisans (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            bio TEXT,
            craft_type TEXT,
            image TEXT,
            offers_workshop BOOLEAN DEFAULT 0,
            offers_live_show BOOLEAN DEFAULT 0,
            completed_work_count INTEGER DEFAULT 0,
            rating REAL DEFAULT 0.0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE clients (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            phone TEXT,
            address TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE requests (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            budget REAL,
            deadline TEXT,
            status TEXT DEFAULT 'pending',
            client_id TEXT NOT NULL,
            artisan_id TEXT NOT NULL,
            FOREIGN KEY (client_id) REFERENCES users(id),
            FOREIGN KEY (artisan_id) REFERENCES artisans(id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE contracts (
            id TEXT PRIMARY KEY,
            request_id TEXT NOT NULL,
            client_id TEXT NOT NULL,
            artisan_id TEXT NOT NULL,
            terms TEXT,
            price REAL,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (request_id) REFERENCES requests(id),
            FOREIGN KEY (client_id) REFERENCES users(id),
            FOREIGN KEY (artisan_id) REFERENCES artisans(id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE artisan_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artisan_id TEXT,
            image_url TEXT,
            display_order INTEGER DEFAULT 0,
            FOREIGN KEY (artisan_id) REFERENCES artisans(id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database tables created successfully!")

def migrate_data_simple():
    """Simple migration from JSON to SQLite"""
    
    # قراءة البيانات من JSON
    try:
        with open('db.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ db.json file not found!")
        return
    
    # إنشاء الجداول
    create_tables_simple()
    
    conn = sqlite3.connect('aruma.db')
    
    try:
        print("🔄 Starting simple migration...")
        
        # هجرة الحرفيين
        print("📝 Migrating artisans...")
        for artisan in data.get('artisans', []):
            print(f"  - {artisan['name']}")
            
            # إضافة المستخدم
            conn.execute(
                "INSERT INTO users (id, user_type, name, email, password) VALUES (?, ?, ?, ?, ?)",
                (artisan['_id'], 'artisan', artisan['name'], artisan['email'], artisan['password'])
            )
            
            # إضافة الحرفي
            conn.execute(
                """INSERT INTO artisans (id, user_id, bio, craft_type, image, offers_workshop, offers_live_show, completed_work_count) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (artisan['_id'], artisan['_id'], artisan.get('bio', ''), artisan.get('craftType', ''),
                 artisan.get('images', [])[0] if artisan.get('images') else '',
                 artisan.get('offersWorkshop', False), artisan.get('offersLiveShow', False),
                 artisan.get('completedWorkCount', 0))
            )
            
            # إضافة الصور
            for i, img in enumerate(artisan.get('images', [])):
                conn.execute(
                    "INSERT INTO artisan_images (artisan_id, image_url, display_order) VALUES (?, ?, ?)",
                    (artisan['_id'], img, i)
                )
        
        # هجرة العملاء
        print("👥 Migrating clients...")
        for client in data.get('clients', []):
            print(f"  - {client['name']}")
            
            conn.execute(
                "INSERT INTO users (id, user_type, name, email, password) VALUES (?, ?, ?, ?, ?)",
                (client['_id'], 'client', client['name'], client['email'], client['password'])
            )
            
            conn.execute(
                "INSERT INTO clients (id, user_id) VALUES (?, ?)",
                (client['_id'], client['_id'])
            )
        
        # هجرة الطلبات
        print("📋 Migrating requests...")
        for req in data.get('requests', []):
            print(f"  - Request {req['_id']}")
            
            request_type = req.get('requestType', 'workshop')
            title_map = {
                'workshop': 'Workshop Request',
                'product': 'Product Request', 
                'live_show': 'Live Show Request'
            }
            title = title_map.get(request_type, 'Service Request')
            
            conn.execute(
                """INSERT INTO requests (id, title, description, budget, deadline, status, client_id, artisan_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (req['_id'], title, req['message'], req.get('cost'), req.get('date'), 
                 req['status'], req['clientId'], req['artisanId'])
            )
        
        # هجرة العقود
        print("📄 Migrating contracts...")
        for contract in data.get('contracts', []):
            print(f"  - Contract {contract['_id']}")
            
            conn.execute(
                """INSERT INTO contracts (id, request_id, artisan_id, client_id, terms, price, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (contract['_id'], contract['requestId'], contract['artisanId'], 
                 contract['clientId'], contract.get('message', ''), contract['cost'],
                 contract['status'])
            )
        
        conn.commit()
        print("✅ Migration completed successfully!")
        print(f"📊 Statistics:")
        print(f"   - Artisans: {len(data.get('artisans', []))}")
        print(f"   - Clients: {len(data.get('clients', []))}")
        print(f"   - Requests: {len(data.get('requests', []))}")
        print(f"   - Contracts: {len(data.get('contracts', []))}")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_data_simple()