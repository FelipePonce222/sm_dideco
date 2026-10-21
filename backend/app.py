from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
# Permitir que React (localhost:5173) se conecte sin bloqueos de CORS
CORS(app)

DATABASE = 'dideco.db'  # Nombre de tu base de datos SQLite

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Para retornar los datos como diccionarios/JSON
    return conn

# 1. API Subdirecciones (Capa Azul)
@app.route('/api/subdirecciones', methods=['GET'])
def get_subdirecciones():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM subdirecciones")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# 2. API Departamentos (Capa Amarilla)
@app.route('/api/departamentos', methods=['GET'])
def get_departamentos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM departamentos")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# 3. API Funcionarios (Capa Verde)
@app.route('/api/funcionarios', methods=['GET'])
def get_funcionarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT f.id, f.nombre, f.cargo, f.subdireccion_id, f.departamento_id,
               d.nombre as departamento, s.nombre as subdireccion
        FROM funcionarios f
        LEFT JOIN departamentos d ON f.departamento_id = d.id
        LEFT JOIN subdirecciones s ON f.subdireccion_id = s.id
    """)
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# 4. API Actividades por Funcionario y Fecha (Modal Agenda)
@app.route('/api/actividades', methods=['GET'])
def get_actividades():
    funcionario_id = request.args.get('funcionario_id')
    fecha = request.args.get('fecha')

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM actividades WHERE funcionario_id = ?"
    params = [funcionario_id]

    if fecha:
        query += " AND fecha = ?"
        params.append(fecha)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    # Ejecutar en el puerto 5000
    app.run(debug=True, port=5000)