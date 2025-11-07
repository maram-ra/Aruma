import sqlite3

try:
    conn = sqlite3.connect('aruma.db')
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    print("📊 Database Tables:")
    for table in tables:
        print(f"✅ {table[0]}")
    
    # Check users table specifically
    if tables:
        print(f"\n📈 Total tables: {len(tables)}")
    else:
        print("❌ No tables found in database")
        
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")