# database/repo.py
# -*- coding: utf-8 -*-

import sqlite3
import json
from typing import Optional, List, Dict, Any

DB_PATH = "aruma.db"

# ============================== #
# اتصال القاعدة
# ============================== #
def _connect() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def _row_to_dict(row: Optional[sqlite3.Row]) -> Optional[Dict[str, Any]]:
    return dict(row) if row else None

def _rows_to_list(rows: List[sqlite3.Row]) -> List[Dict[str, Any]]:
    return [dict(r) for r in rows]


# ============================== #
# المستخدمين (Clients / Artisans)
# ============================== #
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
    con = _connect()
    cur = con.cursor()
    try:
        cur.execute(
            """
            INSERT INTO artisans (
                name, email, password_hash, phone, craft_type,
                offers_workshop, offers_live_show, offers_product,
                image, bio, completed_work_count,
                work_images, work_titles
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '[]', '[]')
            """,
            (
                name, email, password_hash, phone, craft_type,
                1 if offers_workshop else 0,
                1 if offers_live_show else 0,
                1 if offers_product else 0,
                image or "", bio or ""
            ),
        )
        con.commit()
        new_id = cur.lastrowid
        row = cur.execute("SELECT * FROM artisans WHERE id=?", (new_id,)).fetchone()
        return _row_to_dict(row)
    except sqlite3.IntegrityError as e:
        if "UNIQUE" in str(e).upper():
            raise ValueError("EMAIL_TAKEN")
        raise
    finally:
        con.close()

def create_client(name: str, email: str, password_hash: str) -> Dict[str, Any]:
    con = _connect()
    cur = con.cursor()
    try:
        cur.execute(
            "INSERT INTO clients (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, password_hash),
        )
        con.commit()
        new_id = cur.lastrowid
        row = cur.execute("SELECT * FROM clients WHERE id=?", (new_id,)).fetchone()
        return _row_to_dict(row)
    finally:
        con.close()

def get_user_by_email_and_type(email: str, user_type: str) -> Optional[Dict[str, Any]]:
    con = _connect(); cur = con.cursor()
    try:
        if user_type == "artisan":
            row = cur.execute("SELECT * FROM artisans WHERE email=?", (email,)).fetchone()
        elif user_type == "client":
            row = cur.execute("SELECT * FROM clients WHERE email=?", (email,)).fetchone()
        else:
            row = None
        return _row_to_dict(row)
    finally:
        con.close()

def get_artisan_by_id(artisan_id: str) -> Optional[Dict[str, Any]]:
    con = _connect(); cur = con.cursor()
    row = cur.execute("SELECT * FROM artisans WHERE id=?", (artisan_id,)).fetchone()
    con.close()
    return _row_to_dict(row)

def get_client_by_id(client_id: str) -> Optional[Dict[str, Any]]:
    con = _connect(); cur = con.cursor()
    row = cur.execute("SELECT * FROM clients WHERE id=?", (client_id,)).fetchone()
    con.close()
    return _row_to_dict(row)


# ============================== #
# تحديث معلومات الحرفي
# ============================== #
def update_artisan(artisan_id: str, update: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not update:
        return get_artisan_by_id(artisan_id)

    mapping = {
        "craftType": "craft_type",
        "offersWorkshop": "offers_workshop",
        "offersLiveShow": "offers_live_show",
        "offersProduct": "offers_product",
    }

    if "images" in update:
        imgs = update.get("images")
        if isinstance(imgs, list) and imgs:
            update["image"] = imgs[0]
        update.pop("images", None)

    set_parts = []
    params = []
    for k, v in update.items():
        col = mapping.get(k, k)
        if col in ("offers_workshop", "offers_live_show", "offers_product"):
            v = 1 if bool(v) else 0
        set_parts.append(f"{col} = ?")
        params.append(v)

    params.append(artisan_id)
    con = _connect()
    cur = con.cursor()
    try:
        cur.execute(
            f"UPDATE artisans SET {', '.join(set_parts)} WHERE id = ?",
            tuple(params),
        )
        con.commit()
        row = cur.execute("SELECT * FROM artisans WHERE id = ?", (artisan_id,)).fetchone()
        return _row_to_dict(row)
    finally:
        con.close()


def get_all_artisans(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    con = _connect()
    cur = con.cursor()
    rows = cur.execute(
        "SELECT * FROM artisans ORDER BY id DESC LIMIT ? OFFSET ?",
        (limit, offset),
    ).fetchall()
    con.close()
    return _rows_to_list(rows)


# ============================== #
# الطلبات (Requests)
# ============================== #
def create_request_v2(client_id: int, artisan_id: int, request_type: str,
                      description: str, status_client: str, status_artisan: str):
    con = _connect(); cur = con.cursor()
    cur.execute("""
        INSERT INTO requests (client_id, artisan_id, request_type, description,
                              status_client, status_artisan, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
    """, (client_id, artisan_id, request_type, description, status_client, status_artisan))
    con.commit()
    rid = cur.lastrowid
    row = cur.execute("SELECT * FROM requests WHERE id=?", (rid,)).fetchone()
    con.close()
    return _row_to_dict(row)

def get_request_by_id(request_id: int):
    con = _connect(); cur = con.cursor()
    row = cur.execute("SELECT * FROM requests WHERE id=?", (request_id,)).fetchone()
    con.close()
    return _row_to_dict(row)

def get_requests_by_artisan(artisan_id: str) -> List[Dict[str, Any]]:
    con = _connect(); cur = con.cursor()
    rows = cur.execute(
        "SELECT * FROM requests WHERE artisan_id=? ORDER BY id DESC", (artisan_id,)
    ).fetchall()
    con.close()
    return _rows_to_list(rows)

def get_requests_by_client(client_id: str) -> List[Dict[str, Any]]:
    con = _connect(); cur = con.cursor()
    rows = cur.execute(
        "SELECT * FROM requests WHERE client_id=? ORDER BY id DESC", (client_id,)
    ).fetchall()
    con.close()
    return _rows_to_list(rows)
# database/repo.py

def get_requests_by_client_with_artisan_name(client_id: str) -> List[Dict[str, Any]]:
    con = _connect()
    cur = con.cursor()
    try:
        rows = cur.execute("""
            SELECT r.*,
                   a.name  AS artisan_name,
                   a.phone AS artisan_phone
            FROM requests r
            LEFT JOIN artisans a ON a.id = r.artisan_id
            WHERE r.client_id = ?
            ORDER BY COALESCE(r.created_at, r.id) DESC
        """, (client_id,)).fetchall()
        return _rows_to_list(rows)
    finally:
        con.close()


def update_request_offer_and_statuses(request_id:int, offer_budget:float, offer_deadline:str,
                                      status_client:str, status_artisan:str):
    con=_connect(); cur=con.cursor()
    cur.execute("""
        UPDATE requests
        SET offer_budget=?, offer_deadline=?, status_client=?, status_artisan=?
        WHERE id=?
    """, (offer_budget, offer_deadline, status_client, status_artisan, request_id))
    con.commit()
    row=cur.execute("SELECT * FROM requests WHERE id=?", (request_id,)).fetchone()
    con.close()
    return _row_to_dict(row)

def update_request_statuses(request_id:int, status_client:str, status_artisan:str):
    con=_connect(); cur=con.cursor()
    cur.execute("""
        UPDATE requests
        SET status_client=?, status_artisan=?
        WHERE id=?
    """, (status_client, status_artisan, request_id))
    con.commit()
    row=cur.execute("SELECT * FROM requests WHERE id=?", (request_id,)).fetchone()
    con.close()
    return _row_to_dict(row)


# ============================== #
# العقود (Contracts)
# ============================== #
def create_contract(request_id:int, artisan_id:int, client_id:int, cost:float,
                    date:str, status:str="active") -> Dict[str, Any]:
    con=_connect(); cur=con.cursor()
    cur.execute("""
        INSERT INTO contracts (request_id, artisan_id, client_id, cost, date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (request_id, artisan_id, client_id, cost, date, status))
    con.commit()
    new_id = cur.lastrowid
    cur.execute("UPDATE requests SET contract_id=? WHERE id=?", (new_id, request_id))
    con.commit()
    row=cur.execute("SELECT * FROM contracts WHERE id=?", (new_id,)).fetchone()
    con.close()
    return _row_to_dict(row)

def get_contract_by_request(request_id:int) -> Optional[Dict[str,Any]]:
    con=_connect(); cur=con.cursor()
    row=cur.execute("SELECT * FROM contracts WHERE request_id=?", (request_id,)).fetchone()
    con.close()
    return _row_to_dict(row)


# ============================== #
# عداد الإنجازات
# ============================== #
def increment_artisan_completed_work(artisan_id:int, inc:int=1):
    con=_connect(); cur=con.cursor()
    cur.execute("""
        UPDATE artisans
        SET completed_work_count = COALESCE(completed_work_count, 0) + ?
        WHERE id=?
    """, (inc, artisan_id))
    con.commit()
    row=cur.execute("SELECT * FROM artisans WHERE id=?", (artisan_id,)).fetchone()
    con.close()
    return _row_to_dict(row)
