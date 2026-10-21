import sqlite3
import pandas as pd
import os

# Determinar rutas absolutas
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dideco.db')
EXCEL_PATH = os.path.join(BASE_DIR, 'FUNCIONARIOS.xlsx')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Tabla Subdirección
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subdireccion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
        )
    ''')

    # 2. Tabla Departamento
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS departamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            subdireccion_id INTEGER NOT NULL,
            FOREIGN KEY (subdireccion_id) REFERENCES subdireccion (id)
        )
    ''')

    # 3. Tabla Funcionario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS funcionario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rut TEXT UNIQUE,
            nombre TEXT NOT NULL,
            correo TEXT,
            password TEXT DEFAULT '123456',
            cargo_unidad TEXT,
            tipo_contrato TEXT,
            departamento_id INTEGER,
            rol TEXT DEFAULT 'funcionario',
            FOREIGN KEY (departamento_id) REFERENCES departamento (id)
        )
    ''')

    # 4. Tabla Actividad Diaria
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actividad_diaria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            funcionario_id INTEGER NOT NULL,
            fecha DATE NOT NULL,
            hora_inicio TIME NOT NULL,
            hora_fin TIME,
            titulo_actividad TEXT NOT NULL,
            descripcion TEXT,
            estado TEXT NOT NULL DEFAULT 'Pendiente',
            url_evidencia TEXT,
            observaciones TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (funcionario_id) REFERENCES funcionario (id)
        )
    ''')

    conn.commit()
    conn.close()
    print("Tablas creadas exitosamente en SQLite.")

def poblar_desde_excel():
    if not os.path.exists(EXCEL_PATH):
        print(f"No se encontró el archivo Excel en {EXCEL_PATH}")
        return

    df = pd.read_excel(EXCEL_PATH, sheet_name='Hoja1')
    
    df['subdireccion_clean'] = df['Subdirección'].ffill()
    df['depto_clean'] = df['Departamento/ Programa/ Unidad'].ffill()
    
    df_func = df[df['Funcionario(a)'].notna()].copy()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for idx, row in df_func.iterrows():
        sub_name = str(row['subdireccion_clean']).strip()
        dep_name = str(row['depto_clean']).strip()
        cargo = str(row['Nombre del Departamento/ Programa/ Unidad']).strip() if pd.notna(row['Nombre del Departamento/ Programa/ Unidad']) else "Funcionario"
        func_name = str(row['Funcionario(a)']).strip()
        contrato = str(row['Tipo de Contrato']).strip() if pd.notna(row['Tipo de Contrato']) else "Honorario"

        cursor.execute("INSERT OR IGNORE INTO subdireccion (nombre) VALUES (?)", (sub_name,))
        cursor.execute("SELECT id FROM subdireccion WHERE nombre = ?", (sub_name,))
        sub_id = cursor.fetchone()[0]

        cursor.execute("SELECT id FROM departamento WHERE nombre = ? AND subdireccion_id = ?", (dep_name, sub_id))
        dep_res = cursor.fetchone()
        if not dep_res:
            cursor.execute("INSERT INTO departamento (nombre, subdireccion_id) VALUES (?, ?)", (dep_name, sub_id))
            dep_id = cursor.lastrowid
        else:
            dep_id = dep_res[0]

        rut_dummy = f"{10000000 + idx}-K"
        correo_dummy = func_name.lower().replace(" ", ".").replace("ñ", "n") + "@lagranja.cl"

        cursor.execute('''
            INSERT OR IGNORE INTO funcionario 
            (rut, nombre, correo, cargo_unidad, tipo_contrato, departamento_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (rut_dummy, func_name, correo_dummy, cargo, contrato, dep_id))

    conn.commit()
    conn.close()
    print("Los funcionarios y sus departamentos fueron cargados exitosamente!")

if __name__ == '__main__':
    # Si existe una base de datos vieja, la eliminamos para empezar de cero limpio
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("Base de datos previa eliminada para aplicar la nueva estructura.")

    init_db()
    poblar_desde_excel()