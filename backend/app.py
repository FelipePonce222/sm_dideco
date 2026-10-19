import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db_connection, init_db

app = Flask(__name__)
# Permitir peticiones desde cualquier origen (CORS)
CORS(app)

# Inicializar la base de datos al arrancar
init_db()

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "online",
        "mensaje": "¡Bienvenido a la API del Sistema de Monitoreo DIDECO!"
    })

# API: Obtener lista de roles
@app.route("/api/roles", methods=["GET"])
def obtener_roles():
    conn = get_db_connection()
    roles = conn.execute("SELECT * FROM rol_usuario").fetchall()
    conn.close()
    return jsonify([dict(row) for row in roles])

# API: Obtener lista de subdirecciones
@app.route("/api/subdirecciones", methods=["GET"])
def obtener_subdirecciones():
    conn = get_db_connection()
    subdirecciones = conn.execute("SELECT * FROM subdireccion").fetchall()
    conn.close()
    return jsonify([dict(row) for row in subdirecciones])

# API: Actividades recientes para la tabla del Dashboard
@app.route("/api/actividades-recientes", methods=["GET"])
def obtener_actividades_recientes():
    try:
        conn = get_db_connection()
        query = """
            SELECT 
                f.nombre || ' ' || f.appaterno AS funcionario,
                t.titulo_tarea AS tarea,
                u.nombre_unidad AS unidad,
                e.nombre_estado AS estado
            FROM tareas t
            JOIN funcionario f ON t.fk_funcionario = f.id_funcionario
            JOIN unidad u ON f.fk_unidad = u.id_unidad
            JOIN estado_tarea e ON t.fk_estado = e.id_estado
            ORDER BY t.fecha_asignacion DESC
            LIMIT 10
        """
        actividades = conn.execute(query).fetchall()
        conn.close()
        return jsonify([dict(row) for row in actividades])
    except Exception as e:
        print("Error al consultar actividades:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# API: Autenticación de Usuario / Login
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        rut = data.get("rut")
        contrasena = data.get("contrasena")

        conn = get_db_connection()
        # Consulta para verificar credenciales
        query = """
            SELECT id_funcionario, nombre, appaterno, rut
            FROM funcionario
            WHERE (rut = ? OR email = ?)
        """
        funcionario = conn.execute(query, (rut, rut)).fetchone()
        conn.close()

        if funcionario:
            # Sesión exitosa
            return jsonify({
                "mensaje": "Login exitoso",
                "usuario": {
                    "id": funcionario["id_funcionario"],
                    "nombre": f"{funcionario['nombre']} {funcionario['appaterno']}",
                    "rut": funcionario["rut"]
                }
            }), 200
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401

    except Exception as e:
        print("Error en login:", e)
        return jsonify({"error": str(e)}), 500