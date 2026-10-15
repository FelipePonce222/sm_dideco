import sqlite3
import os

DB_NAME = "dideco.db"

def init_db():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    schema_path = os.path.join(base_dir, "schema.sql")
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    with open(schema_path, "r", encoding="utf-8") as f:
        cursor.executescript(f.read())
        
    conn.commit()
    conn.close()
    print("Base de datos SQLite 'dideco.db' inicializada con exito!")

if __name__ == "__main__":
    init_db()