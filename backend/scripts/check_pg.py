# scripts/check_pg.py
from dotenv import load_dotenv
load_dotenv()  # يقرأ .env من نفس المجلد الجاري
import os, psycopg

url = os.getenv("DATABASE_URL")
print("DATABASE_URL:", url)
assert url, "DATABASE_URL غير موجود — تأكدي أنك داخل مجلد backend وأن .env صحيح"

with psycopg.connect(url) as con:
    with con.cursor() as cur:
        cur.execute("select 1")
        print("OK:", cur.fetchone())
