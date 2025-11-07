# database.py
from storage.sql_repo_simple import SQLRepository

# استخدام SQLite
DATABASE_URL = "sqlite:///./aruma.db"

# تهيئة الريبوستوري
repo = SQLRepository(connection_string=DATABASE_URL)