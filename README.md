# 🏛️ Sistema de Monitoreo de Funciones y Tareas Municipales (SMM-DIDECO) 🏛️
> **Cliente:** Municipalidad de La Granja — Dirección de Desarrollo Comunitario (DIDECO)  
> **Institución Patrocinante:** Duoc UC — Escuela de Informática y Telecomunicaciones  
> **Jefe de Proyecto:** Felipe Ponce  
> **Versión:** 1.0 (Producto Mínimo Viable - PMV)  

---

## Descripción del Proyecto
El **Sistema Monitoreo DIDECO** es una plataforma híbrida (Web Responsiva / Progressive Web App - PWA) diseñada para optimizar la gestión, planificación y supervisión en tiempo real de las labores asignadas a los funcionarios municipalizados en terreno.

Permite automatizar:
* 📍 **Marcaje de Asistencia (Check-in / Check-out)** con captura obligatoria de coordenadas GPS.
* 📋 **Asignación y Seguimiento de Tareas** por funcionario o cuadrilla.
* 📸 **Carga de Evidencias Fotográficas** y actualización de estados en tiempo real.
* 🗺️ **Dashboard de Control Institucional** con mapa interactivo de la comuna de La Granja.
* 📑 **Gestión de Contratos** (Planta, Contrata, Honorarios y Código del Trabajo).

---

## Arquitectura y Tecnologías
* **Backend:** Python 3.11+ con Flask (API RESTful)
* **Frontend:** Web Responsiva / PWA (HTML5, CSS3, JavaScript ES6+, Bootstrap 5)
* **Mapas & Geolocation:** Leaflet.js (OpenStreetMap) + HTML5 Geolocation API
* **Base de Datos:** SQLite / MySQL (Diseño normalizado de 12 tablas en 3FN)
* **Control de Versiones:** Git / GitHub

---

## 📂 Estructura del Proyecto

```text
sistema-dideco/
├── backend/
│   ├── app.py               # Punto de entrada de la aplicación Flask
│   ├── database.py          # Conexión y gestión de la Base de Datos
│   └── routes/              # Endpoints de la API (Usuarios, Tareas, Marcas)
├── frontend/
│   ├── index.html           # Vista Login / PWA Móvil Funcionario
│   ├── dashboard.html       # Vista Web Escritorio para Jefaturas
│   ├── css/                 # Estilos personalizados
│   └── js/                  # Lógica de geolocalización, consumo de API y mapas
├── schema.sql               # Script de creación de la Base de Datos
├── .gitignore               # Archivos excluidos del control de versiones
├── README.md                # Documentación principal del proyecto
└── requirements.txt         # Dependencias de Python