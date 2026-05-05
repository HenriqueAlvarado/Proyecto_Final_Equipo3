-- Schema MediSync - Clínica San Ángel
-- Ejecutar en medisync_db

-- Tabla de usuarios (recepcionistas, médicos, director)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('recepcionista', 'medico', 'director')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de médicos (extiende usuarios con datos clínicos)
CREATE TABLE IF NOT EXISTS medicos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad VARCHAR(100) NOT NULL,
  cedula_profesional VARCHAR(50),
  foto_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  password_hash VARCHAR(255),
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  curp VARCHAR(18) UNIQUE,
  direccion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id SERIAL PRIMARY KEY,
  paciente_id INTEGER REFERENCES pacientes(id) ON DELETE RESTRICT,
  medico_id INTEGER REFERENCES medicos(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(500) NOT NULL,
  estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'completada', 'cancelada')),
  notas TEXT,
  created_by INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_medico ON citas(medico_id);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_email ON pacientes(email);
CREATE INDEX IF NOT EXISTS idx_pacientes_curp ON pacientes(curp);

-- Usuario director inicial (password: Admin2026!)
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol)
VALUES (
  'Admin', 'Sistema',
  'admin@clinicasanangel.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
  'director'
) ON CONFLICT (email) DO NOTHING;
