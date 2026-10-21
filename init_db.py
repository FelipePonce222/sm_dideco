import sqlite3

def init_db():
    conn = sqlite3.connect('dideco.db')
    cursor = conn.cursor()

    # 1. Crear tabla Subdirecciones
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subdirecciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL
        )
    ''')

    # 2. Crear tabla Departamentos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS departamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            subdireccion_id INTEGER,
            FOREIGN KEY (subdireccion_id) REFERENCES subdirecciones (id)
        )
    ''')

    # 3. Crear tabla Funcionarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            cargo TEXT,
            subdireccion_id INTEGER,
            departamento_id INTEGER,
            FOREIGN KEY (subdireccion_id) REFERENCES subdirecciones (id),
            FOREIGN KEY (departamento_id) REFERENCES departamentos (id)
        )
    ''')

    # 4. Crear tabla Actividades
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actividades (
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

    # Insertar datos base si las tablas están vacías
    cursor.execute("SELECT COUNT(*) FROM subdirecciones")
    if cursor.fetchone()[0] == 0:
        # Subdirecciones de prueba
        cursor.execute("INSERT INTO subdirecciones (id, nombre) VALUES (1, 'Subdirección Social')")
        cursor.execute("INSERT INTO subdirecciones (id, nombre) VALUES (2, 'Subdirección Comunitarias')")
        
        # Departamentos de prueba
        cursor.execute("INSERT INTO departamentos (id, nombre, subdireccion_id) VALUES (1, 'Dpto. Social', 1)")
        cursor.execute("INSERT INTO departamentos (id, nombre, subdireccion_id) VALUES (2, 'Programa Adulto Mayor', 2)")

        # Funcionario de prueba
        cursor.execute("INSERT INTO funcionarios (id, nombre, cargo, subdireccion_id, departamento_id) VALUES (1, 'Ana María Pérez', 'Coordinadora de Terreno', 1, 1)")

        # Actividad de prueba
        cursor.execute("INSERT INTO actividades (funcionario_id, titulo, descripcion, estado, fecha, hora) VALUES (1, 'Operativo Social en Terreno', 'Atención de vecinos e inscripción de beneficios', 'Realizada', date('now'), '10:00')")

    conn.commit()
    conn.close()
    print("¡Base de datos dideco.db estructurada e inicializada con éxito! 🎉")

if __name__ == '__main__':
    init_db()