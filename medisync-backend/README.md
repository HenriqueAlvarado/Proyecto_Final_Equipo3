# MediSync Backend API 🏥

API REST para MediSync - Clínica San Ángel.
**Node.js 18 + Express 4 + PostgreSQL 15 (AWS RDS)**

## URLs

- **Producción:** `http://3.219.251.228:3000/api`
- **Health check:** `http://3.219.251.228:3000/health`
- **Documentación Swagger:** http://medisync-web-20260501.s3-website-us-east-1.amazonaws.com/api-docs.html
- **OpenAPI spec:** [openapi.yaml](./openapi.yaml)

## Stack

| Paquete | Versión | Uso |
|---|---|---|
| express | 4.18.2 | Framework HTTP |
| jsonwebtoken | 9.0.2 | Autenticación JWT |
| bcryptjs | 2.4.3 | Hash de passwords |
| pg | 8.11.3 | Cliente PostgreSQL |
| axios | 1.6.8 | Llamadas a SendGrid |
| dotenv | 16.4.5 | Variables de entorno |
| cors | 2.8.5 | CORS |
| jest | 29.7.0 | Pruebas unitarias |

## Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| POST | `/auth/login` | Login personal clínico | Público |
| POST | `/auth/login-paciente` | Login paciente | Público |
| POST | `/auth/logout` | Cerrar sesión | Público |
| POST | `/auth/register` | Crear usuario | director |
| GET | `/auth/usuarios` | Listar usuarios | director |
| PATCH | `/auth/usuarios/:id/toggle` | Activar/desactivar usuario | director |
| GET | `/auth/mis-citas` | Citas del paciente autenticado | paciente |

### Citas (`/api/citas`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/citas?fecha=YYYY-MM-DD` | Citas por fecha | Todos |
| POST | `/citas` | Crear cita + enviar correo | recepcionista |
| PUT | `/citas/:id` | Modificar cita | recepcionista |
| PATCH | `/citas/:id/cancelar` | Cancelar cita | recepcionista |
| GET | `/citas/mis-citas` | Citas del médico autenticado | medico |

### Pacientes (`/api/pacientes`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/pacientes` | Listar pacientes activos | Todos |
| POST | `/pacientes` | Registrar paciente | recepcionista |
| GET | `/pacientes/buscar?q=` | Buscar por nombre/email/CURP | Todos |
| GET | `/pacientes/:id` | Detalle de paciente | Todos |
| DELETE | `/pacientes/:id` | Borrado lógico | recepcionista, director |
| GET | `/pacientes/:id/citas` | Historial de citas | Todos |

### Médicos (`/api/medicos`)

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/medicos` | Listar médicos activos | Todos |
| GET | `/medicos/:id` | Detalle de médico | Todos |

## Instalación local

```bash
npm install
cp .env.example .env
# Editar .env con los valores reales
npm start
```

## Variables de entorno

Ver `.env.example`. Variables requeridas:

```env
PORT=3000
DB_HOST=...
DB_PORT=5432
DB_NAME=medisync_db
DB_USER=medisync_admin
DB_PASSWORD=...
JWT_SECRET=...
JWT_EXPIRES_IN=8h
SENDGRID_API_KEY=...
SENDGRID_FROM=...
```

## Base de datos

```bash
# Crear tablas
psql -h <host> -U medisync_admin -d medisync_db -f src/config/schema.sql

# Insertar datos de prueba
psql -h <host> -U medisync_admin -d medisync_db -f src/config/seed.sql
```

## Pruebas

```bash
npm test
# 10 pruebas: middleware de auth (6) + servicio de email (4)
```

## Deploy en EC2

```bash
ssh -i "labsuser.pem" ec2-user@3.219.251.228
cd /home/ec2-user/repo
git fetch origin && git reset --hard origin/main
cd medisync-backend
pm2 start src/index.js --name medisync-api
pm2 save
```

## Infraestructura AWS

| Recurso | ID / Valor |
|---|---|
| EC2 | i-0c00ea2f3163f4b5a (t2.micro) |
| Elastic IP | 3.219.251.228 |
| RDS | medisync-db.ccmbha3tv2ap.us-east-1.rds.amazonaws.com |
| S3 Web | medisync-web-20260501 |
| S3 Fotos | medisync-fotos-20260501 |
| Región | us-east-1 |
