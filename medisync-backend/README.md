# MediSync Backend API 🏥

API REST para MediSync - Clínica San Ángel. Node.js + Express + PostgreSQL (RDS).

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Login (retorna JWT) |
| POST | /api/auth/logout | Logout |
| GET | /api/citas?fecha= | Citas por fecha |
| POST | /api/citas | Crear cita |
| PUT | /api/citas/:id | Modificar cita |
| PATCH | /api/citas/:id/cancelar | Cancelar cita |
| GET | /api/pacientes | Listar pacientes |
| GET | /api/pacientes/buscar?q= | Buscar pacientes |
| POST | /api/pacientes | Registrar paciente |
| GET | /api/medicos | Listar médicos |

## Despliegue en EC2

```bash
# Clonar repo
git clone https://github.com/HenriqueAlvarado/Proyecto_Final_Equipo3.git
cd Proyecto_Final_Equipo3/medisync-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores reales

# Crear tablas en RDS
psql -h medisync-db.ccmbha3tv2ap.us-east-1.rds.amazonaws.com -U medisync_admin -d medisync_db -f src/config/schema.sql

# Iniciar con PM2
npm run pm2
pm2 save
pm2 startup
```

## Variables de entorno requeridas

Ver `.env.example`

## Infraestructura AWS

- EC2: `54.196.144.76` (t2.micro, Amazon Linux 2023)
- RDS: `medisync-db.ccmbha3tv2ap.us-east-1.rds.amazonaws.com` (PostgreSQL 15)
- S3 Web: `medisync-web-20260501`
- S3 Fotos: `medisync-fotos-20260501`
