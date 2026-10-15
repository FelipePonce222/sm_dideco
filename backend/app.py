from flask import Flask, jsonify
from flask_cors import CORS
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)  # Permite que el frontend (HTML/JS) se conecte sin bloqueos de navegador

# Asegurar que la base de datos exista al arrancar
init_db()

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "online",
        "mensaje": "Bienvenido a la API del Sistema de Monitoreo DIDECO"
    })

@app.route("/api/roles", methods=["GET"])
def obtener_roles():
    conn = get_db_connection()
    roles = conn.execute("SELECT * FROM rol_usuario").fetchall()
    conn.close()
    
    # Convertir cada fila de SQLite a un diccionario de Python
    resultado = [dict(row) for row in roles]
    return jsonify(resultado)

@app.route("/api/subdirecciones", methods=["GET"])
def obtener_subdirecciones():
    conn = get_db_connection()
    subdirecciones = conn.execute("SELECT * FROM subdireccion").fetchall()
    conn.close()
    
    resultado = [dict(row) for row in subdirecciones]
    return jsonify(resultado)

if __name__ == "__main__":
    app.run(debug=True, port=5000)