-- ============================================================
-- MEDISYNC - DATOS DE PRUEBA (SEED)
-- Clínica San Ángel
-- Fecha: Mayo 2026
-- ============================================================
-- Ejecutar DESPUÉS de schema.sql
-- Comando:
--   PGPASSWORD='MediSync2026!' psql \
--     -h medisync-db.ccmbha3tv2ap.us-east-1.rds.amazonaws.com \
--     -U medisync_admin -d medisync_db -f src/config/seed.sql
--
-- Password de todos los usuarios de prueba: MediSync2026
-- Password de todos los pacientes de prueba: MediSync2026
-- (hash bcrypt generado con 10 salt rounds)
-- ============================================================

-- ─────────────────────────────────────────
-- MÉDICOS ADICIONALES (3 especialidades)
-- ─────────────────────────────────────────
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol, activo) VALUES
  ('Roberto',  'Mendoza', 'r.mendoza@clinicasanangel.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa', 'medico', TRUE),
  ('Patricia', 'Herrera', 'p.herrera@clinicasanangel.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa', 'medico', TRUE),
  ('Miguel',   'Torres',  'm.torres@clinicasanangel.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa', 'medico', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO medicos (usuario_id, especialidad, cedula_profesional)
SELECT id, 'Pediatría',     '3456789' FROM usuarios WHERE email = 'r.mendoza@clinicasanangel.com'
ON CONFLICT DO NOTHING;

INSERT INTO medicos (usuario_id, especialidad, cedula_profesional)
SELECT id, 'Ginecología',   '4567890' FROM usuarios WHERE email = 'p.herrera@clinicasanangel.com'
ON CONFLICT DO NOTHING;

INSERT INTO medicos (usuario_id, especialidad, cedula_profesional)
SELECT id, 'Traumatología', '5678901' FROM usuarios WHERE email = 'm.torres@clinicasanangel.com'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- PACIENTES DE PRUEBA (6 pacientes)
-- ─────────────────────────────────────────
INSERT INTO pacientes (nombre, apellido, email, password_hash, telefono, fecha_nacimiento, curp, direccion, activo) VALUES
  ('Ana',    'Martínez', 'ana.martinez@gmail.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa',
   '8112001001', '1985-03-22', 'MARA850322MNLRNN08', 'Calle Roble 45, Col. Del Valle, Monterrey', TRUE),
  ('Carlos', 'Pérez',    'carlos.perez@gmail.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa',
   '8112002002', '1990-07-15', 'PECC900715HNLRRL05', 'Av. Constitución 200, Monterrey', TRUE),
  ('Sofía',  'Ramírez',  'sofia.ramirez@gmail.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa',
   '8112003003', '2000-11-30', 'RASF001130MNLMMF09', 'Blvd. Díaz Ordaz 890, San Pedro', TRUE),
  ('Jorge',  'López',    'jorge.lopez@gmail.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa',
   '8112004004', '1978-01-08', 'LOJJ780108HNLPRR02', 'Calle Cedro 12, Col. Obrera, Monterrey', TRUE),
  ('María',  'González', 'maria.gonzalez@gmail.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa',
   '8112005005', '1995-06-20', 'GOMM950620MNLNNR07', 'Av. Garza Sada 1500, Monterrey', TRUE),
  ('Diego',  'Flores',   'diego.flores@gmail.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNAcoRHa',
   '8112006006', '2003-09-14', 'FLDG030914HNLLRG01', 'Calle Pino 78, Col. Cumbres, Monterrey', TRUE)
ON CONFLICT (email) DO NOTHING;

-- ─────────────────────────────────────────
-- CITAS DE PRUEBA
-- Fechas: 8, 9, 10, 12 de Mayo 2026
-- Estados: programada, completada, cancelada
-- ─────────────────────────────────────────
-- NOTA: Ajustar paciente_id y medico_id según los IDs reales en tu BD.
-- Los IDs aquí asumen inserción limpia sobre schema.sql base.

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-08', '09:00', 'Consulta general - revisión anual', 'completada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'ana.martinez@gmail.com' AND u.email = 'henrique.alvarado@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-08', '10:00', 'Control de diabetes tipo 2', 'completada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'carlos.perez@gmail.com' AND u.email = 'esmeralda180706@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-08', '11:00', 'Revisión pediátrica - vacunas', 'completada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'sofia.ramirez@gmail.com' AND u.email = 'r.mendoza@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-08', '12:00', 'Consulta ginecológica de rutina', 'cancelada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'jorge.lopez@gmail.com' AND u.email = 'p.herrera@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-08', '13:00', 'Dolor en rodilla derecha', 'completada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'maria.gonzalez@gmail.com' AND u.email = 'm.torres@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-09', '09:30', 'Fiebre y dolor de garganta', 'completada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'diego.flores@gmail.com' AND u.email = 'henrique.alvarado@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-09', '10:30', 'Seguimiento crecimiento infantil', 'cancelada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'ana.martinez@gmail.com' AND u.email = 'r.mendoza@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-09', '11:30', 'Fractura de muñeca - seguimiento', 'completada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'carlos.perez@gmail.com' AND u.email = 'm.torres@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-10', '09:00', 'Dolor de cabeza recurrente', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'sofia.ramirez@gmail.com' AND u.email = 'henrique.alvarado@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-10', '10:00', 'Revisión de glucosa en ayunas', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'jorge.lopez@gmail.com' AND u.email = 'esmeralda180706@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-10', '11:00', 'Consulta pediátrica - tos persistente', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'maria.gonzalez@gmail.com' AND u.email = 'r.mendoza@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-10', '12:00', 'Ultrasonido obstétrico', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'diego.flores@gmail.com' AND u.email = 'p.herrera@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-10', '13:00', 'Esguince de tobillo', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'ana.martinez@gmail.com' AND u.email = 'm.torres@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-12', '09:00', 'Presión arterial elevada - seguimiento', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'carlos.perez@gmail.com' AND u.email = 'henrique.alvarado@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-12', '10:00', 'Ajuste de medicamento para diabetes', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'sofia.ramirez@gmail.com' AND u.email = 'esmeralda180706@gmail.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-12', '11:00', 'Resultado de estudios ginecológicos', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'jorge.lopez@gmail.com' AND u.email = 'p.herrera@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-12', '12:00', 'Rehabilitación post-operatoria rodilla', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'maria.gonzalez@gmail.com' AND u.email = 'm.torres@clinicasanangel.com';

INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, estado, created_by)
SELECT p.id, m.id, '2026-05-12', '13:00', 'Vacuna influenza pediátrica', 'programada', 1
FROM pacientes p, medicos m
JOIN usuarios u ON m.usuario_id = u.id
WHERE p.email = 'diego.flores@gmail.com' AND u.email = 'r.mendoza@clinicasanangel.com';
