# scripts/migrate_sqlite_to_pg.py
import os, sqlite3, json, re
from datetime import datetime
from psycopg.rows import dict_row

try:
    import psycopg
    from psycopg.types.json import Json
except Exception:
    raise SystemExit("⚠️ يلزم تثبيت: pip install psycopg psycopg-binary python-dotenv")

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

SQLITE_PATH = os.getenv("SQLITE_PATH", "aruma.db")
PG_URL      = os.getenv("DATABASE_URL")

if not PG_URL:
    raise SystemExit("⚠️ لم يتم العثور على DATABASE_URL في .env")

print(f"→ PostgreSQL host: {re.sub(r'^.*@', '', PG_URL).split('?')[0].split(':')[0]}, db: postgres")
print(f"→ SQLite file: {SQLITE_PATH}")
print("→ محاولة الاتصال بقاعدة Postgres...")

src = sqlite3.connect(SQLITE_PATH)
src.row_factory = sqlite3.Row
dst = psycopg.connect(PG_URL, row_factory=dict_row)
print("✅ اتصلنا بـ Postgres بنجاح.\n")

# ---------- Helpers ----------
def to_bool(v):
    if v is None: return None
    try:
        return bool(int(v))
    except Exception:
        if isinstance(v, str):
            return v.strip().lower() in ("true","t","yes","1")
        return bool(v)

def to_json(v):
    if v in (None, "", "null"): return Json([])
    if isinstance(v, (list, dict)): return Json(v)
    try:
        return Json(json.loads(v))
    except Exception:
        return Json([])

def to_ts(v):
    if not v or str(v).strip()=="":
        return None
    s = str(v)
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%Y/%m/%d %H:%M:%S"):
        try:
            return datetime.strptime(s, fmt)
        except Exception:
            pass
    return None

def pg_count(table):
    with dst.cursor() as c:
        c.execute(f"select count(*) from {table}")
        return c.fetchone()["count"]

# ---------- Copy functions (بدون with dst:) ----------
def copy_artisans():
    table = "artisans"
    cols  = ["id","name","email","password_hash","phone","craft_type",
             "offers_workshop","offers_live_show","offers_product",
             "image","bio","completed_work_count","work_images","work_titles","created_at"]

    rows = src.execute(f"select {', '.join(cols)} from {table}").fetchall()
    print(f"⏳ نسخ جدول: {table}\n   • SQLite rows:  {len(rows)}\n   • Postgres rows قبل النسخ: {pg_count(table)}")
    inserted = skipped = 0

    cur = dst.cursor()
    try:
        for r in rows:
            d = dict(r)
            d["offers_workshop"] = to_bool(d.get("offers_workshop"))
            d["offers_live_show"] = to_bool(d.get("offers_live_show"))
            d["offers_product"]   = to_bool(d.get("offers_product"))
            d["work_images"]      = to_json(d.get("work_images"))
            d["work_titles"]      = to_json(d.get("work_titles"))
            d["created_at"]       = to_ts(d.get("created_at"))
            try:
                cur.execute(
                    """
                    insert into artisans
                    (id,name,email,password_hash,phone,craft_type,
                     offers_workshop,offers_live_show,offers_product,
                     image,bio,completed_work_count,work_images,work_titles,created_at)
                    values
                    (%(id)s,%(name)s,%(email)s,%(password_hash)s,%(phone)s,%(craft_type)s,
                     %(offers_workshop)s,%(offers_live_show)s,%(offers_product)s,
                     %(image)s,%(bio)s,%(completed_work_count)s,%(work_images)s,%(work_titles)s,%(created_at)s)
                    on conflict (id) do nothing
                    """,
                    d
                )
                inserted += 1
            except Exception as e:
                skipped += 1
                print(f"   ! تخطّي صف بسبب خطأ: {e}")
        dst.commit()
    finally:
        cur.close()

    print(f"   • تم إدخال: {inserted}, تم تخطّي: {skipped}\n")

def copy_clients():
    table = "clients"
    cols  = ["id","name","email","password_hash","created_at"]
    rows = src.execute(f"select {', '.join(cols)} from {table}").fetchall()
    print(f"⏳ نسخ جدول: {table}\n   • SQLite rows:  {len(rows)}\n   • Postgres rows قبل النسخ: {pg_count(table)}")
    inserted = skipped = 0

    cur = dst.cursor()
    try:
        for r in rows:
            d = dict(r)
            d["created_at"] = to_ts(d.get("created_at"))
            try:
                cur.execute(
                    """
                    insert into clients (id,name,email,password_hash,created_at)
                    values (%(id)s,%(name)s,%(email)s,%(password_hash)s,%(created_at)s)
                    on conflict (id) do nothing
                    """,
                    d
                )
                inserted += 1
            except Exception as e:
                skipped += 1
                print(f"   ! تخطّي صف بسبب خطأ: {e}")
        dst.commit()
    finally:
        cur.close()

    print(f"   • تم إدخال: {inserted}, تم تخطّي: {skipped}\n")

def copy_requests():
    table = "requests"
    cols  = ["id","client_id","artisan_id","request_type","description",
             "status_client","status_artisan","offer_budget","offer_deadline",
             "budget","deadline","contract_id","created_at"]
    rows = src.execute(f"select {', '.join(cols)} from {table}").fetchall()
    print(f"⏳ نسخ جدول: {table}\n   • SQLite rows:  {len(rows)}\n   • Postgres rows قبل النسخ: {pg_count(table)}")
    inserted = skipped = 0

    cur = dst.cursor()
    try:
        for r in rows:
            d = dict(r)
            d["created_at"] = to_ts(d.get("created_at"))
            try:
                cur.execute(
                    """
                    insert into requests
                    (id,client_id,artisan_id,request_type,description,
                     status_client,status_artisan,offer_budget,offer_deadline,
                     budget,deadline,contract_id,created_at)
                    values
                    (%(id)s,%(client_id)s,%(artisan_id)s,%(request_type)s,%(description)s,
                     %(status_client)s,%(status_artisan)s,%(offer_budget)s,%(offer_deadline)s,
                     %(budget)s,%(deadline)s,%(contract_id)s,%(created_at)s)
                    on conflict (id) do nothing
                    """,
                    d
                )
                inserted += 1
            except Exception as e:
                skipped += 1
                print(f"   ! تخطّي صف بسبب خطأ: {e}")
        dst.commit()
    finally:
        cur.close()

    print(f"   • تم إدخال: {inserted}, تم تخطّي: {skipped}\n")

def copy_contracts():
    table = "contracts"
    cols  = ["id","request_id","artisan_id","client_id","cost","date","status","created_at"]
    rows = src.execute(f"select {', '.join(cols)} from {table}").fetchall()
    print(f"⏳ نسخ جدول: {table}\n   • SQLite rows:  {len(rows)}\n   • Postgres rows قبل النسخ: {pg_count(table)}")
    inserted = skipped = 0

    cur = dst.cursor()
    try:
        for r in rows:
            d = dict(r)
            d["created_at"] = to_ts(d.get("created_at"))
            try:
                cur.execute(
                    """
                    insert into contracts
                    (id,request_id,artisan_id,client_id,cost,date,status,created_at)
                    values
                    (%(id)s,%(request_id)s,%(artisan_id)s,%(client_id)s,%(cost)s,%(date)s,%(status)s,%(created_at)s)
                    on conflict (id) do nothing
                    """,
                    d
                )
                inserted += 1
            except Exception as e:
                skipped += 1
                print(f"   ! تخطّي صف بسبب خطأ: {e}")
        dst.commit()
    finally:
        cur.close()

    print(f"   • تم إدخال: {inserted}, تم تخطّي: {skipped}\n")

# ---------- Run ----------
try:
    copy_artisans()
    copy_clients()
    copy_requests()
    copy_contracts()
    print("🎉 اكتمل بنجاح — تم ترحيل البيانات إلى Postgres.")
except Exception as e:
    print(f"❌ حدث خطأ أثناء الترحيل: {e}")
finally:
    try: src.close()
    except Exception: pass
    try: dst.close()
    except Exception: pass
