# migrations_add_cols.py
import sqlite3

DB = "aruma.db"

def add_column(cur, table, col, type_sql, default_value=None):
    try:
        cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {type_sql};")
        if default_value is not None:
            cur.execute(f"UPDATE {table} SET {col}=? WHERE {col} IS NULL;", (default_value,))
        print(f"✓ added {table}.{col}")
    except Exception as e:
        # موجودة من قبل؟ طنّشي
        print(f"ℹ skip {table}.{col} -> {e}")

def main():
    con = sqlite3.connect(DB)
    cur = con.cursor()

    # (1) requests — حالات منفصلة + العرض
    add_column(cur, "requests", "status_client", "TEXT", "pending")
    add_column(cur, "requests", "status_artisan", "TEXT", "new")
    add_column(cur, "requests", "offer_budget", "REAL", None)
    add_column(cur, "requests", "offer_deadline", "TEXT", None)

    # (2) artisans — عناوين My Work
    add_column(cur, "artisans", "work_titles", "TEXT", "[]")
    # (اختياري) تأكيد work_images فيها قيمة افتراضية [] لو فاضية
    try:
        cur.execute("UPDATE artisans SET work_images='[]' WHERE work_images IS NULL;")
    except Exception as e:
        print(f"ℹ ensure work_images default -> {e}")

    con.commit()
    con.close()
    print("✅ Migration done.")

if __name__ == "__main__":
    main()
