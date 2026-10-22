from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

# Configuración básica de CORS
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('dideco.db')
    conn.row_factory = sqlite3.Row
    return conn

# MANEJADOR GLOBAL PARA EVITAR ERRORES DE CORS Y PREFLIGHT (OPTIONS)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response, 200

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response

# API: Obtener subdirecciones
@app.route('/api/subdirecciones', methods=['GET'])
def get_subdirecciones():
    conn = get_db_connection()
    subs = conn.execute('SELECT * FROM subdirecciones').fetchall()
    conn.close()
    return jsonify([dict(row) for row in subs])

# API: Obtener departamentos
@app.route('/api/departamentos', methods=['GET'])
def get_departamentos():
    conn = get_db_connection()
    deps = conn.execute('SELECT * FROM departamentos').fetchall()
    conn.close()
    return jsonify([dict(row) for row in deps])

# API: Obtener funcionarios
@app.route('/api/funcionarios', methods=['GET'])
def get_funcionarios():
    conn = get_db_connection()
    query = '''
        SELECT f.id, f.nombre, f.cargo, f.tipo_contrato, 
               f.subdireccion_id, f.departamento_id,
               s.nombre as subdireccion, d.nombre as departamento
        FROM funcionarios f
        LEFT JOIN subdirecciones s ON f.subdireccion_id = s.id
        LEFT JOIN departamentos d ON f.departamento_id = d.id
    '''
    funcs = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(row) for row in funcs])

# API: Crear un nuevo funcionario
@app.route('/api/funcionarios', methods=['POST', 'OPTIONS'])
def agregar_funcionario():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        datos = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO funcionarios (nombre, cargo, tipo_contrato, subdireccion_id, departamento_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            datos.get('nombre'),
            datos.get('cargo'),
            datos.get('tipo_contrato', 'Contrata'),
            int(datos.get('subdireccion_id')) if datos.get('subdireccion_id') else None,
            int(datos.get('departamento_id')) if datos.get('departamento_id') else None
        ))
        conn.commit()
        nuevo_id = cursor.lastrowid
        conn.close()
        return jsonify({"mensaje": "Funcionario creado con éxito", "id": nuevo_id}), 201
    except Exception as e:
        print("Error en POST:", e)
        return jsonify({"error": str(e)}), 500

# API: Actualizar un funcionario
@app.route('/api/funcionarios/<int:id>', methods=['PUT', 'OPTIONS'])
def editar_funcionario(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        datos = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE funcionarios
            SET nombre = ?, cargo = ?, tipo_contrato = ?, subdireccion_id = ?, departamento_id = ?
            WHERE id = ?
        ''', (
            datos.get('nombre'),
            datos.get('cargo'),
            datos.get('tipo_contrato'),
            int(datos.get('subdireccion_id')) if datos.get('subdireccion_id') else None,
            int(datos.get('departamento_id')) if datos.get('departamento_id') else None,
            id
        ))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Funcionario actualizado correctamente"}), 200
    except Exception as e:
        print("Error en PUT:", e)
        return jsonify({"error": str(e)}), 500

# API: Eliminar un funcionario
@app.route('/api/funcionarios/<int:id>', methods=['DELETE', 'OPTIONS'])
def eliminar_funcionario(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM funcionarios WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Funcionario eliminado correctamente"}), 200
    except Exception as e:
        print("Error en DELETE:", e)
        return jsonify({"error": str(e)}), 500


# API: Obtener actividades de un funcionario específico
@app.route('/api/funcionarios/<int:funcionario_id>/actividades', methods=['GET'])
def get_actividades(funcionario_id):
    conn = get_db_connection()
    actividades = conn.execute('''
        SELECT * FROM actividades 
        WHERE funcionario_id = ? 
        ORDER BY fecha DESC, hora DESC
    ''', (funcionario_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in actividades])

# API: Crear una nueva actividad para un funcionario
@app.route('/api/actividades', methods=['POST', 'OPTIONS'])
def crear_actividad():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        datos = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO actividades (funcionario_id, titulo, descripcion, fecha, hora, estado, evidencia_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            int(datos.get('funcionario_id')),
            datos.get('titulo'),
            datos.get('descripcion', ''),
            datos.get('fecha'),
            datos.get('hora', ''),
            datos.get('estado', 'Pendiente'),
            datos.get('evidencia_url', '')
        ))
        conn.commit()
        nuevo_id = cursor.lastrowid
        conn.close()
        return jsonify({"mensaje": "Actividad creada correctamente", "id": nuevo_id}), 201
    except Exception as e:
        print("Error en POST /api/actividades:", e)
        return jsonify({"error": str(e)}), 500

# API: Actualizar una actividad existente
@app.route('/api/actividades/<int:id>', methods=['PUT', 'OPTIONS'])
def editar_actividad(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        datos = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE actividades
            SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, estado = ?, evidencia_url = ?
            WHERE id = ?
        ''', (
            datos.get('titulo'),
            datos.get('descripcion'),
            datos.get('fecha'),
            datos.get('hora'),
            datos.get('estado'),
            datos.get('evidencia_url'),
            id
        ))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Actividad actualizada correctamente"}), 200
    except Exception as e:
        print("Error en PUT /api/actividades:", e)
        return jsonify({"error": str(e)}), 500

# API: Eliminar una actividad
@app.route('/api/actividades/<int:id>', methods=['DELETE', 'OPTIONS'])
def eliminar_actividad(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM actividades WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "Actividad eliminada correctamente"}), 200
    except Exception as e:
        print("Error en DELETE /api/actividades:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)