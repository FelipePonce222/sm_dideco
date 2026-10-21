import sqlite3
import pandas as pd

def poblar_base_datos():
    # 1. Cargar archivo Excel
    excel_path = 'FUNCIONARIOS.xlsx'
    df = pd.read_excel(excel_path)

    # Filtrar solo filas que contengan nombre de funcionario
    df = df.dropna(subset=['Funcionario(a)']).copy()

    # Rellenar valores vacíos hacia abajo para mantener la jerarquía
    df['Subdirección'] = df['Subdirección'].ffill()
    df['Departamento/ Programa/ Unidad'] = df['Departamento/ Programa/ Unidad'].ffill()
    df['Nombre del Departamento/ Programa/ Unidad'] = df['Nombre del Departamento/ Programa/ Unidad'].ffill()

    conn = sqlite3.connect('dideco.db')
    cursor = conn.cursor()

    # Recrear tablas limpias
    cursor.execute('DROP TABLE IF EXISTS actividades')
    cursor.execute('DROP TABLE IF EXISTS funcionarios')
    cursor.execute('DROP TABLE IF EXISTS departamentos')
    cursor.execute('DROP TABLE IF EXISTS subdirecciones')

    cursor.execute('''
        CREATE TABLE subdirecciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
        )
    ''')

    cursor.execute('''
        CREATE TABLE departamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            subdireccion_id INTEGER,
            FOREIGN KEY (subdireccion_id) REFERENCES subdirecciones (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            cargo TEXT,
            tipo_contrato TEXT,
            subdireccion_id INTEGER,
            departamento_id INTEGER,
            FOREIGN KEY (subdireccion_id) REFERENCES subdirecciones (id),
            FOREIGN KEY (departamento_id) REFERENCES departamentos (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE actividades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            funcionario_id INTEGER,
            titulo TEXT NOT NULL,
            descripcion TEXT,
            estado TEXT DEFAULT 'Pendiente',
            fecha TEXT,
            hora TEXT,
            evidencia_url TEXT,
            FOREIGN KEY (funcionario_id) REFERENCES funcionarios (id)
        )
    ''')

    # Diccionarios para mapear IDs
    sub_map = {}
    dep_map = {}

    # 2. Insertar Subdirecciones
    subdirecciones_unicas = df['Subdirección'].unique()
    for sub in subdirecciones_unicas:
        cursor.execute("INSERT INTO subdirecciones (nombre) VALUES (?)", (str(sub).strip(),))
        sub_map[str(sub).strip()] = cursor.lastrowid

    # 3. Insertar Departamentos
    deptos_unicos = df[['Subdirección', 'Departamento/ Programa/ Unidad']].drop_duplicates()
    for _, row in deptos_unicos.iterrows():
        sub_nombre = str(row['Subdirección']).strip()
        dep_nombre = str(row['Departamento/ Programa/ Unidad']).strip()
        sub_id = sub_map[sub_nombre]

        cursor.execute(
            "INSERT INTO departamentos (nombre, subdireccion_id) VALUES (?, ?)",
            (dep_nombre, sub_id)
        )
        dep_map[(sub_nombre, dep_nombre)] = cursor.lastrowid

    # 4. Insertar Funcionarios
    count = 0
    for _, row in df.iterrows():
        nombre = str(row['Funcionario(a)']).strip()
        cargo = str(row['Nombre del Departamento/ Programa/ Unidad']).strip()
        contrato = str(row['Tipo de Contrato']).strip() if pd.notna(row['Tipo de Contrato']) else ''
        sub_nombre = str(row['Subdirección']).strip()
        dep_nombre = str(row['Departamento/ Programa/ Unidad']).strip()

        sub_id = sub_map[sub_nombre]
        dep_id = dep_map[(sub_nombre, dep_nombre)]

        cursor.execute('''
            INSERT INTO funcionarios (nombre, cargo, tipo_contrato, subdireccion_id, departamento_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (nombre, cargo, contrato, sub_id, dep_id))
        count += 1

    conn.commit()
    conn.close()
    print(f"¡Éxito total! Se cargaron {len(sub_map)} subdirecciones, {len(dep_map)} departamentos y {count} funcionarios. 🎉")

if __name__ == '__main__':
    poblar_base_datos()