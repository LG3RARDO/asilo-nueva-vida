-- SEGURIDAD Y ACCESO
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INTEGER REFERENCES rol(id_rol),
    correo VARCHAR(120) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo'
);

-- PACIENTES Y FAMILIARES
CREATE TABLE paciente (
    id_paciente SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    fecha_ingreso DATE,
    motivo_reclusion TEXT,
    psicopatologia TEXT,
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE familiar (
    id_familiar SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120),
    telefono VARCHAR(20),
    direccion TEXT
);

CREATE TABLE paciente_familiar (
    id_relacion SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    id_familiar INTEGER REFERENCES familiar(id_familiar),
    parentesco VARCHAR(40)
);

-- PROCESO MÉDICO
CREATE TABLE especialidad (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE medico (
    id_medico SERIAL PRIMARY KEY,
    id_especialidad INTEGER REFERENCES especialidad(id_especialidad),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    colegiado VARCHAR(30)
);

CREATE TABLE enfermero (
    id_enfermero SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    turno VARCHAR(30)
);

CREATE TABLE solicitud_medica (
    id_solicitud SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    id_medico_general INTEGER REFERENCES medico(id_medico),
    id_especialidad INTEGER REFERENCES especialidad(id_especialidad),
    id_enfermero INTEGER REFERENCES enfermero(id_enfermero),
    motivo TEXT,
    estado VARCHAR(30) DEFAULT 'creada',
    fecha_solicitud TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cita_medica (
    id_cita SERIAL PRIMARY KEY,
    id_solicitud INTEGER REFERENCES solicitud_medica(id_solicitud),
    id_especialista INTEGER REFERENCES medico(id_medico),
    fecha DATE,
    hora TIME,
    costo NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'asignada'
);

CREATE TABLE visita_medica (
    id_visita SERIAL PRIMARY KEY,
    id_cita INTEGER REFERENCES cita_medica(id_cita),
    diagnostico TEXT,
    observaciones TEXT
);

-- LABORATORIO
CREATE TABLE examen_catalogo (
    id_examen SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_base NUMERIC(10,2)
);

CREATE TABLE examen_solicitado (
    id_examen_solic SERIAL PRIMARY KEY,
    id_visita INTEGER REFERENCES visita_medica(id_visita),
    id_examen INTEGER REFERENCES examen_catalogo(id_examen),
    resultado TEXT,
    costo NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'pendiente'
);

-- FARMACIA
CREATE TABLE medicamento (
    id_medicamento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    stock INTEGER DEFAULT 0,
    precio_base NUMERIC(10,2)
);

CREATE TABLE receta_detalle (
    id_receta SERIAL PRIMARY KEY,
    id_visita INTEGER REFERENCES visita_medica(id_visita),
    id_medicamento INTEGER REFERENCES medicamento(id_medicamento),
    dosis VARCHAR(50),
    cantidad INTEGER,
    tiempo_aplicacion VARCHAR(80),
    estado_entrega VARCHAR(20) DEFAULT 'pendiente'
);

-- FINANZAS
CREATE TABLE cargo_paciente (
    id_cargo SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    tipo VARCHAR(30),
    total NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'pendiente'
);

CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    id_familiar INTEGER REFERENCES familiar(id_familiar),
    monto NUMERIC(10,2),
    fecha DATE,
    metodo VARCHAR(40),
    descripcion TEXT
);

CREATE TABLE cuota_mensual (
    id_cuota SERIAL PRIMARY KEY,
    id_paciente INTEGER REFERENCES paciente(id_paciente),
    mes VARCHAR(20),
    monto NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'pendiente'
);

CREATE TABLE donacion (
    id_donacion SERIAL PRIMARY KEY,
    tipo_donante VARCHAR(40),
    nombre_donante VARCHAR(100),
    monto NUMERIC(10,2),
    fecha DATE,
    observacion TEXT
);

CREATE TABLE gasto_operativo (
    id_gasto SERIAL PRIMARY KEY,
    tipo VARCHAR(50),
    descripcion TEXT,
    monto NUMERIC(10,2),
    fecha DATE
);

CREATE TABLE pago_fundacion (
    id_pago_fund SERIAL PRIMARY KEY,
    id_cargo INTEGER REFERENCES cargo_paciente(id_cargo),
    periodo VARCHAR(30),
    monto_pagado NUMERIC(10,2),
    total NUMERIC(10,2),
    fecha_pago DATE,
    estado VARCHAR(20) DEFAULT 'pendiente'
);

-- NOTIFICACIONES
CREATE TABLE notificacion (
    id_notif SERIAL PRIMARY KEY,
    id_solicitud INTEGER REFERENCES solicitud_medica(id_solicitud),
    id_familiar INTEGER REFERENCES familiar(id_familiar),
    estado_envio VARCHAR(20) DEFAULT 'pendiente'
);

-- Datos iniciales de roles
INSERT INTO rol (nombre) VALUES ('administrador');
INSERT INTO rol (nombre) VALUES ('medico_general');
INSERT INTO rol (nombre) VALUES ('fundacion');
INSERT INTO rol (nombre) VALUES ('medico_especialista');
INSERT INTO rol (nombre) VALUES ('laboratorio');
INSERT INTO rol (nombre) VALUES ('farmacia');