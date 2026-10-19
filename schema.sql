-- 1. TABLAS CATALOGO / PARAMÉTRICAS
CREATE TABLE IF NOT EXISTS subdireccion (
    id_subdireccion INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_subdireccion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS departamento (
    id_departamento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_departamento TEXT NOT NULL,
    fk_subdireccion INTEGER NOT NULL,
    FOREIGN KEY (fk_subdireccion) REFERENCES subdireccion(id_subdireccion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS unidad (
    id_unidad INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_unidad TEXT NOT NULL,
    fk_departamento INTEGER NOT NULL,
    FOREIGN KEY (fk_departamento) REFERENCES departamento(id_departamento) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tipo_contrato (
    id_contrato INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_contrato TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rol_usuario (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_rol TEXT NOT NULL
);

-- 2. TABLA PRINCIPAL DE USUARIOS
CREATE TABLE IF NOT EXISTS funcionario (
    id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
    rut TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    segundo_nombre TEXT,
    appaterno TEXT NOT NULL,
    apmaterno TEXT,
    telefono TEXT,
    correo TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    activo BOOLEAN DEFAULT 1,
    fk_unidad INTEGER NOT NULL,
    fk_contrato INTEGER NOT NULL,
    fk_rol INTEGER NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_unidad) REFERENCES unidad(id_unidad),
    FOREIGN KEY (fk_contrato) REFERENCES tipo_contrato(id_contrato),
    FOREIGN KEY (fk_rol) REFERENCES rol_usuario(id_rol)
);

-- 3. GESTIÓN DE TAREAS Y EVIDENCIAS
CREATE TABLE IF NOT EXISTS estado_tarea (
    id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_estado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tareas (
    id_tarea INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo_tarea TEXT NOT NULL,
    descripcion TEXT,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATETIME,
    latitud_tarea REAL,
    longitud_tarea REAL,
    fk_estado INTEGER NOT NULL DEFAULT 1,
    fk_funcionario INTEGER NOT NULL,
    fk_jefatura_asigna INTEGER NOT NULL,
    FOREIGN KEY (fk_estado) REFERENCES estado_tarea(id_estado),
    FOREIGN KEY (fk_funcionario) REFERENCES funcionario(id_funcionario),
    FOREIGN KEY (fk_jefatura_asigna) REFERENCES funcionario(id_funcionario)
);

CREATE TABLE IF NOT EXISTS evidencias_tarea (
    id_evidencia INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_tarea INTEGER NOT NULL,
    url_imagen TEXT NOT NULL,
    observacion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_tarea) REFERENCES tareas(id_tarea) ON DELETE CASCADE
);

-- 4. MARCAJE Y GEOLOCALIZACIÓN GPS
CREATE TABLE IF NOT EXISTS tipo_marca (
    id_tipo_marca INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_marca TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS historial_marca (
    id_marca INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_marca DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitud REAL NOT NULL,
    longitud REAL NOT NULL,
    fk_tipo_marca INTEGER NOT NULL,
    fk_funcionario INTEGER NOT NULL,
    FOREIGN KEY (fk_tipo_marca) REFERENCES tipo_marca(id_tipo_marca),
    FOREIGN KEY (fk_funcionario) REFERENCES funcionario(id_funcionario)
);

CREATE TABLE IF NOT EXISTS log_geolocalizacion (
    id_log INTEGER PRIMARY KEY AUTOINCREMENT,
    latitud REAL NOT NULL,
    longitud REAL NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_funcionario INTEGER NOT NULL,
    FOREIGN KEY (fk_funcionario) REFERENCES funcionario(id_funcionario)
);

-- 5. DATOS SEMILLA
INSERT OR IGNORE INTO tipo_contrato (id_contrato, nombre_contrato) VALUES 
(1, 'Planta'), (2, 'Contrata'), (3, 'Honorarios'), (4, 'Código del Trabajo');

INSERT OR IGNORE INTO rol_usuario (id_rol, nombre_rol) VALUES 
(1, 'Administrador'), (2, 'Director'), (3, 'Supervisor / Jefatura'), (4, 'Funcionario / Operador');

INSERT OR IGNORE INTO estado_tarea (id_estado, nombre_estado) VALUES 
(1, 'Pendiente'), (2, 'En Proceso'), (3, 'Pausada'), (4, 'Completada'), (5, 'Cancelada');

INSERT OR IGNORE INTO tipo_marca (id_tipo_marca, nombre_marca) VALUES 
(1, 'Entrada (Check-in)'), (2, 'Salida (Check-out)');

INSERT OR IGNORE INTO subdireccion (id_subdireccion, nombre_subdireccion) VALUES (1, 'Subdirección Social DIDECO');
INSERT OR IGNORE INTO departamento (id_departamento, nombre_departamento, fk_subdireccion) VALUES (1, 'Departamento de Gestión Social', 1);
INSERT OR IGNORE INTO unidad (id_unidad, nombre_unidad, fk_departamento) VALUES (1, 'Unidad de Asistencia y Terreno', 1);

-- FUNCIONARIOS DE PRUEBA (con clave de prueba "123456")
INSERT OR IGNORE INTO funcionario (id_funcionario, rut, nombre, appaterno, apmaterno, correo, password_hash, fk_unidad, fk_contrato, fk_rol) VALUES 
(1, '12345678-9', 'Juan', 'Perez', 'Soto', 'juan.perez@lagranja.cl', '123456', 1, 1, 3),
(2, '98765432-1', 'Dayanna', 'Retamal', 'Lopez', 'dayanna.retamal@lagranja.cl', '123456', 2, 2, 3),
(3, '11223344-5', 'Patricia', 'Valenzuela', 'Rojas', 'patricia.valenzuela@lagranja.cl', '123456', 3, 1, 2);
