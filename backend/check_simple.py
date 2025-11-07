import sqlite3

conn = sqlite3.connect('aruma.db')
cursor = conn.cursor()

# شوفي محتوى جدول users
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()

print('👥 بيانات المستخدمين:')
for user in users:
    print(f'🆔 {user[0]} | 👤 {user[2]} | 📧 {user[3]} | 🏷️ {user[1]}')

print(f'\n📈 عدد المستخدمين: {len(users)}')

conn.close()