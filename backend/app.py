from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'dideco.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Permite acceder a los campos por nombre
    return conn

# 1. API: Obtener todas las Subdirecciones
@app.route('/api/subdirecciones', methods=['GET'])
def get_subdirecciones():
    conn = get_db_connection()
    subdirecciones = conn.execute('SELECT * FROM subdireccion').fetchall()
    conn.close()
    return jsonify([dict(row) for row in subdirecciones])

# 2. API: Obtener Departamentos por Subdirección
@app.route('/api/departamentos/<int:subdireccion_id>', methods=['GET'])
def get_departamentos(subdireccion_id):
    conn = get_db_connection()
    departamentos = conn.execute(
        'SELECT * FROM departamento WHERE subdireccion_id = ?', 
        (subdireccion_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in departamentos])

# 3. API: Obtener Funcionarios por Departamento
@app.route('/api/funcionarios/<int:departamento_id>', methods=['GET'])
def get_funcionarios(departamento_id):
    conn = get_db_connection()
    funcionarios = conn.execute(
        'SELECT id, rut, nombre, correo, cargo_unidad, tipo_contrato FROM funcionario WHERE departamento_id = ?', 
        (departamento_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in funcionarios])

# 4. API: Obtener Actividades Diarias de un Funcionario por Fecha
@app.route('/api/actividades/<int:funcionario_id>/<string:fecha>', methods=['GET'])
def get_actividades_funcionario(funcionario_id, fecha):
    conn = get_db_connection()
    actividades = conn.execute(
        'SELECT * FROM actividad_diaria WHERE funcionario_id = ? AND fecha = ? ORDER BY hora_inicio ASC', 
        (funcionario_id, fecha)
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in actividades])

# 5. API: Registrar Nueva Actividad Diaria
@app.route('/api/actividades', methods=['POST'])
def add_actividad():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO actividad_diaria 
        (funcionario_id, fecha, hora_inicio, hora_fin, titulo_actividad, descripcion, estado, url_evidencia, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('funcionario_id'),
        data.get('fecha'),
        data.get('hora_inicio'),
        data.get('hora_fin'),
        data.get('titulo_actividad'),
        data.get('descripcion'),
        data.get('estado', 'Pendiente'),
        data.get('url_evidencia'),
        data.get('observaciones')
    ))
    
    conn.commit()
    actividad_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'message': 'Actividad registrada con éxito', 'id': actividad_id}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)