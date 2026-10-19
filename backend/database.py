import sqlite3
import os

# Fuerza a que busque o cree dideco.db dentro de la carpeta 'backend'
DB_PATH = os.path.join(os.path.dirname(__file__), "dideco.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    schema_path = os.path.join(os.path.dirname(__file__), "..", "schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r", encoding="utf-8") as f:
            conn.executescript(f.read())
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Base de datos inicializada con éxito :)")