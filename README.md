# Sistema de Monitoreo Operativo DIDECO

Un dashboard ejecutivo moderno e interactivo diseñado para la gestión, control de agenda y seguimiento de evidencias operativas de los 93 funcionarios municipales de la Dirección de Desarrollo Comunitario (DIDECO).

---

## 🚀 Características Principales

- **Navegación Multinivel (Organigrama Interactivo):**
  - **Capa 1:** Selección por Subdirección.
  - **Capa 2:** Filtrado dinámico por Departamento o Programa.
  - **Capa 3:** Tarjetas interactivas de Funcionarios.
- **Buscador en Tiempo Real:** Filtrado instantáneo por nombre o cargo del funcionario.
- **Gestión Integral de Personal (CRUD Funcionarios):**
  - Alta de nuevos funcionarios asignando Subdirección y Departamento.
  - Edición de perfiles (nombre, cargo, tipo de contrato).
  - Eliminación con actualización inmediata en interfaz.
- **Control de Agenda y Tareas (CRUD Actividades):**
  - Registro de actividades diarias con fecha, hora y estado (*Pendiente, En Proceso, Realizada*).
  - Vinculación de evidencias fotográficas o documentales por tarea.
- **Diseño Institucional Responsive:** Interfaz estilizada con Bootstrap 5, paleta corporativa y logotipo municipal.

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React** (Vite)
- **Bootstrap 5** + Bootstrap Icons
- **Axios** (Cliente HTTP)

### **Backend**
- **Python** (Flask)
- **Flask-CORS** (Manejo de CORS & Preflight Requests)
- **SQLite3** (Base de datos relacional lightweight)

---

## 📁 Estructura del Proyecto

```text
├── backend/
│   ├── app.py                # Servidor Flask y API RESTful
│   ├── dideco.db             # Base de datos SQLite
│   └── seed_data.py          # Script de carga inicial (93 funcionarios)
│
└── frontend_react/
    ├── public/
    │   └── logo_muni.png     # Logo institucional
    └── src/
        ├── components/
        │   └── AgendaModal.jsx # Modal CRUD de actividades y evidencias
        ├── App.jsx           # Componente principal y CRUD de funcionarios
        ├── main.jsx          # Punto de entrada de React
        └── index.css         # Personalización de estilos y variables CSS
---

## **⚡ Instalación de backend Flask**

# Navegar a la carpeta del backend
cd backend

# (Opcional) Activar entorno virtual
python -m venv venv
# En Windows: venv\Scripts\activate

# Instalar dependencias
pip install flask flask-cors

# Ejecutar el servidor (Corre en [http://127.0.0.1:5000](http://127.0.0.1:5000))
python app.py

##⚡ Instalación de React

# Abrir otra terminal y navegar al frontend
cd frontend_react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (Corre en http://localhost:5173)
npm run dev