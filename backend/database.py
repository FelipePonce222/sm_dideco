import sqlite3
import os

DB_NAME = "dideco.db"

def get_db_connection():
    """Retorna una conexión a la base de datos configurada para devolver dicts."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Permite acceder a las columnas por nombre (ej: row['nombre_rol'])
    return conn

def init_db():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    schema_path = os.path.join(base_dir, "schema.sql")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    with open(schema_path, "r", encoding="utf-8") as f:
        cursor.executescript(f.read())
        
    conn.commit()
    conn.close()
    print("Base de datos SQLite 'dideco.db' inicializada con éxito :)")

if __name__ == "__main__":
    init_db()