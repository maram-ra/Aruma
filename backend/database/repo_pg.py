# database/repo_pg.py
# -*- coding: utf-8 -*-
"""
نسخة PostgreSQL من repository.
- استخدمي DATABASE_URL من .env (Supabase أو أي Postgres)
- الحقول المتوقعة في الجداول كما في SQLite مع الأعمدة الجديدة:
  requests: status_client, status_artisan, offer_budget, offer_deadline, contract_id, created_at
  artisans: work_images TEXT, work_titles TEXT, completed_work_count INT, image, bio, craft_type, ...
  contracts: request_id, artisan_id, client_id, cost, date, status, created_at
"""

import os
import json
from typing import Optional, List, Dict, Any

import psycopg2
import psycopg2.extras

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL env var is required for repo_pg.py (e.g. Supabase connection string)")

# ==========================
# Low-level helpers
# ==========================
def _connect():
    # Supabase يتطلب عادة sslmode=require
    return psycopg2.connect(DATABASE_URL, sslmode="require")

def _row_to_dict(row) -> Optional[Dict[str, Any]]:
    if row is None:
        return None
    # DictRow -> dict
    return dict(row)

def _rows_to_list(rows) -> List[Dict[str, Any]]:
    return [dict(r) for r in rows or []]


# ==========================
# Auth / Users
# ==========================
def create_artisan(
    name: str,
    email: str,
    password_hash: str,
    craft_type: str,
    phone: str = "",
    offers_workshop: bool = False,
    offers_live_show: bool = False,
    offers_product: bool = False,
    image: str = "",
    bio: str = "",
) -> Dict[str, Any]:
    """
    ينشئ حرفي جديد.
    جدول artisans يجب أن يحتوي الأعمدة على الأقل:
      id BIGSERIAL PK, name, email UNIQUE, password_hash,
      phone, craft_type, offers_workshop BOOL, offers_live_show BOOL, offers_product BOOL,
      image TEXT, bio TEXT, completed_work_count INT DEFAULT 0,
      work_images TEXT, work_titles TEXT, created_at TIMESTAMP DEFAULT now()
    """
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                INSERT INTO artisans
                  (name, email, password_hash, phone, craft_type,
                   offers_workshop, offers_live_show, offers_product,
                   image, bio, completed_work_count, work_images, work_titles)
                VALUES (%s, %s, %s, %s, %s,
                        %s, %s, %s,
                        %s, %s, 0, %s, %s)
                RETURNING *;
                """,
                (
                    name, email, password_hash, phone or "", craft_type or "",
                    bool(offers_workshop), bool(offers_live_show), bool(offers_product),
                    image or "", bio or "", "[]", "[]",
                ),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)  # type: ignore
    except psycopg2.errors.UniqueViolation as e:
        con.rollback()
        raise ValueError("EMAIL_TAKEN") from e
    finally:
        con.close()


def create_client(name: str, email: str, password_hash: str) -> Dict[str, Any]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                INSERT INTO clients (name, email, password_hash)
                VALUES (%s, %s, %s)
                RETURNING *;
                """,
                (name, email, password_hash),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)  # type: ignore
    except psycopg2.errors.UniqueViolation as e:
        con.rollback()
        raise ValueError("EMAIL_TAKEN") from e
    finally:
        con.close()


def get_user_by_email_and_type(email: str, user_type: str) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            if user_type == "artisan":
                cur.execute("SELECT * FROM artisans WHERE email = %s LIMIT 1;", (email,))
            elif user_type == "client":
                cur.execute("SELECT * FROM clients  WHERE email = %s LIMIT 1;", (email,))
            else:
                return None
            return _row_to_dict(cur.fetchone())
    finally:
        con.close()


def get_artisan_by_id(artisan_id: str) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM artisans WHERE id = %s;", (artisan_id,))
            return _row_to_dict(cur.fetchone())
    finally:
        con.close()


def get_client_by_id(client_id: str) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM clients WHERE id = %s;", (client_id,))
            return _row_to_dict(cur.fetchone())
    finally:
        con.close()


# ==========================
# Artisans listing / update
# ==========================
def get_all_artisans(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                SELECT *
                  FROM artisans
                 ORDER BY id DESC
                 LIMIT %s OFFSET %s;
                """,
                (limit, offset),
            )
            return _rows_to_list(cur.fetchall())
    finally:
        con.close()


def update_artisan(artisan_id: str, update: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    يقبل مفاتيح مثل repo القديم:
      craftType -> craft_type
      offersWorkshop -> offers_workshop (bool -> 0/1 لا حاجة هنا؛ PostgreSQL يتفهم BOOL)
      images -> نأخذ أول صورة ونحفظها في image
      work_images, work_titles كـ TEXT (JSON string)
    """
    if not update:
        return get_artisan_by_id(artisan_id)

    mapping = {
        "craftType": "craft_type",
        "offersWorkshop": "offers_workshop",
        "offersLiveShow": "offers_live_show",
        "offersProduct": "offers_product",
    }

    # دعم images: لو وصلت كمصفوفة => خذ الأولى كصورة ملف شخصي
    if "images" in update:
        imgs = update.get("images")
        if isinstance(imgs, list) and imgs:
            update["image"] = imgs[0]
        update.pop("images", None)

    sets = []
    params: List[Any] = []
    for k, v in update.items():
        col = mapping.get(k, k)
        sets.append(f"{col} = %s")
        params.append(v)
    params.append(artisan_id)

    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                f"UPDATE artisans SET {', '.join(sets)} WHERE id = %s RETURNING *;",
                tuple(params),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)
    finally:
        con.close()


# ==========================
# Requests
# ==========================
def create_request(
    client_id: int,
    artisan_id: int,
    request_type: str,
    description: str = "",
) -> Dict[str, Any]:
    """(قديمة لو احتجتيها) تحفظ status='pending' التقليدية."""
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                INSERT INTO requests (client_id, artisan_id, request_type, description, status, created_at)
                VALUES (%s, %s, %s, %s, 'pending', now())
                RETURNING *;
                """,
                (client_id, artisan_id, request_type, description or ""),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)  # type: ignore
    finally:
        con.close()


def create_request_v2(
    client_id: int,
    artisan_id: int,
    request_type: str,
    description: str,
    offer_budget=None,
    offer_deadline=None,
    budget=None,
    deadline=None,
    contract_id=None,
    status_client: str = "pending",
    status_artisan: str = "pending",
) -> Dict[str, Any]:
    """النسخة الصحيحة بدون عمود status"""
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                INSERT INTO requests
                  (client_id, artisan_id, request_type, description,
                   status_client, status_artisan,
                   offer_budget, offer_deadline, budget, deadline, contract_id, created_at)
                VALUES (%s, %s, %s, %s,
                        %s, %s,
                        %s, %s, %s, %s, %s, now())
                RETURNING *;
                """,
                (
                    client_id, artisan_id, request_type, description,
                    status_client, status_artisan,
                    offer_budget, offer_deadline, budget, deadline, contract_id
                ),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)  # type: ignore
    finally:
        con.close()



def get_request_by_id(request_id: int) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM requests WHERE id = %s;", (request_id,))
            return _row_to_dict(cur.fetchone())
    finally:
        con.close()


def update_request_offer_and_statuses(
    request_id: int,
    offer_budget: float,
    offer_deadline: str,
    status_client: str,
    status_artisan: str,
) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                UPDATE requests
                   SET offer_budget = %s,
                       offer_deadline = %s,
                       status_client = %s,
                       status_artisan = %s
                 WHERE id = %s
             RETURNING *;
                """,
                (offer_budget, offer_deadline, status_client, status_artisan, request_id),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)
    finally:
        con.close()


def update_request_statuses(request_id: int, status_client: str, status_artisan: str) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                UPDATE requests
                   SET status_client = %s,
                       status_artisan = %s
                 WHERE id = %s
             RETURNING *;
                """,
                (status_client, status_artisan, request_id),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)
    finally:
        con.close()


def get_requests_by_client(client_id: str) -> List[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                SELECT *
                  FROM requests
                 WHERE client_id = %s
                 ORDER BY created_at DESC, id DESC;
                """,
                (client_id,),
            )
            return _rows_to_list(cur.fetchall())
    finally:
        con.close()


def get_requests_by_artisan(artisan_id: str) -> List[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                SELECT *
                  FROM requests
                 WHERE artisan_id = %s
                 ORDER BY created_at DESC, id DESC;
                """,
                (artisan_id,),
            )
            return _rows_to_list(cur.fetchall())
    finally:
        con.close()


# ======= قوائم منضمة للاستخدام في الواجهات =======
def get_requests_by_client_with_artisan_name(client_id: str) -> List[Dict[str, Any]]:
    """
    ترجع معلومات الطلبات مع اسم الحرفي + عقد (إن وجد) + عرض (إن وجد)
    حقول إضافية:
      artisan_name, artisan_phone,
      contract_id, contract_cost, contract_date,
      offer_budget, offer_deadline
    """
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                SELECT r.*,
                       a.name  AS artisan_name,
                       a.phone AS artisan_phone,
                       c.id    AS contract_id,
                       c.cost  AS contract_cost,
                       c.date  AS contract_date
                  FROM requests r
             LEFT JOIN artisans a ON a.id = r.artisan_id
             LEFT JOIN contracts c ON c.request_id = r.id
                 WHERE r.client_id = %s
              ORDER BY r.created_at DESC, r.id DESC;
                """,
                (client_id,),
            )
            rows = cur.fetchall()
            return _rows_to_list(rows)
    finally:
        con.close()


def get_requests_by_artisan_with_client_name(artisan_id: str) -> List[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                SELECT r.*,
                       c.name  AS client_name,
                       c.email AS client_email
                  FROM requests r
             LEFT JOIN clients c ON c.id = r.client_id
                 WHERE r.artisan_id = %s
              ORDER BY r.created_at DESC, r.id DESC;
                """,
                (artisan_id,),
            )
            rows = cur.fetchall()
            return _rows_to_list(rows)
    finally:
        con.close()


# ==========================
# Contracts
# ==========================
def create_contract(
    request_id: int,
    artisan_id: int,
    client_id: int,
    cost: float,
    date: str,
    status: str = "pending",
) -> Dict[str, Any]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                INSERT INTO contracts (request_id, artisan_id, client_id, cost, date, status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, now())
                RETURNING *;
                """,
                (request_id, artisan_id, client_id, cost, date, status),
            )
            contract = cur.fetchone()
            # اربط رقم العقد على الطلب
            cur.execute("UPDATE requests SET contract_id = %s WHERE id = %s;", (contract["id"], request_id))
            con.commit()
            return _row_to_dict(contract)  # type: ignore
    finally:
        con.close()


def get_contract_by_id(contract_id: int) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM contracts WHERE id = %s;", (contract_id,))
            return _row_to_dict(cur.fetchone())
    finally:
        con.close()


def get_contract_by_request(request_id: int) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT * FROM contracts WHERE request_id = %s;", (request_id,))
            return _row_to_dict(cur.fetchone())
    finally:
        con.close()


def set_contract_status(contract_id: int, status: str) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                "UPDATE contracts SET status = %s WHERE id = %s RETURNING *;",
                (status, contract_id),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)
    finally:
        con.close()


# ==========================
# Completion counter helper
# ==========================
def increment_artisan_completed_work(artisan_id: int, inc: int = 1) -> Optional[Dict[str, Any]]:
    con = _connect()
    try:
        with con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(
                """
                UPDATE artisans
                   SET completed_work_count = COALESCE(completed_work_count, 0) + %s
                 WHERE id = %s
             RETURNING *;
                """,
                (inc, artisan_id),
            )
            row = cur.fetchone()
            con.commit()
            return _row_to_dict(row)
    finally:
        con.close()
