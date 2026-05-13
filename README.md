# MediSync — Sistema de Gestión de Citas Médicas 🏥

Sistema web para la gestión de citas médicas de la **Clínica San Ángel**.
Permite a recepcionistas agendar citas, a médicos consultar su agenda y a pacientes ver sus citas desde cualquier dispositivo.

**Equipo 3 — Diseño y Arquitectura de Software | Universidad Tecmilenio | Mayo 2026**

---

## 🌐 URLs del sistema

| Recurso | URL |
|---|---|
| Aplicación web | http://medisync-web-20260501.s3-website-us-east-1.amazonaws.com |
| API Backend | http://3.219.251.228:3000/api |
| Documentación API (Swagger) | http://medisync-web-20260501.s3-website-us-east-1.amazonaws.com/api-docs.html |
| Health check | http://3.219.251.228:3000/health |
| Jira | https://valdezpintocesareduardo.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog |

---

## 👥 Credenciales de prueba

### Personal clínico (tab "Personal clínico")

| Rol | Email | Password |
|---|---|---|
| Director | admin@clinicasanangel.com | password |
| Médico | henrique.alvarado@gmail.com | password |
| Recepcionista | cesar.valdéz@gmail.com | password |

### Pacientes (tab "Soy paciente")

| Nombre | Email | Password |
|---|---|---|
| Ana Martínez | ana.martinez@gmail.com | MediSync2026 |
| Carlos Pérez | carlos.perez@gmail.com | MediSync2026 |
| Sofía Ramírez | sofia.ramirez@gmail.com | MediSync2026 |
| Jorge López | jorge.lopez@gmail.com | MediSync2026 |
| María González | maria.gonzalez@gmail.com | MediSync2026 |
| Diego Flores | diego.flores@gmail.com | MediSync2026 |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   AWS us-east-1                      │
│                                                      │
│  ┌──────────────┐      ┌──────────────────────────┐ │
│  │   S3 Bucket  │      │       EC2 t2.micro        │ │
│  │  (Frontend)  │─────▶│   Node.js + PM2           │ │
│  │  React SPA   │ API  │   Puerto 3000             │ │
│  └──────────────┘      └────────────┬─────────────┘ │
│                                     │ PostgreSQL     │
│                              ┌──────▼──────────────┐ │
│                              │   RDS PostgreSQL 15  │ │
│                              │   db.t3.micro        │ │
│                              └─────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

| Componente | Tecnología | Recurso AWS |
|---|---|---|
| Frontend | React 18, React Router v6, Axios | S3 Static Website |
| Backend | Node.js 18, Express 4, JWT, bcrypt | EC2 t2.micro + Elastic IP |
| Base de datos | PostgreSQL 15 | RDS db.t3.micro |
| Email | SendGrid API (100 correos/día gratis) | — |
| Fotos médicos | S3 | S3 Bucket |

---

## 📁 Estructura del repositorio

```
Proyecto_Final_Equipo3/
├── medisync-web/           # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas (rutas)
│   │   ├── services/       # Llamadas a la API
│   │   ├── contexts/       # AuthContext
│   │   ├── hooks/          # useAuth, useForm
│   │   └── utils/          # Validadores, formateadores
│   ├── .env.example
│   └── package.json
├── medisync-backend/       # Backend Node.js
│   ├── src/
│   │   ├── routes/         # Endpoints Express
│   │   ├── middleware/     # Auth JWT
│   │   ├── services/       # Email SendGrid
│   │   └── config/         # BD, schema.sql, seed.sql
│   ├── openapi.yaml        # Especificación OpenAPI 3.0
│   ├── .env.example
│   └── package.json
└── documentacion/          # Documentación del proyecto
    ├── PARTE1_MVP.txt
    ├── PARTE2_ENTREGA_FINAL.txt
    ├── GUIA_COMPONENTES_WEB_FORMAL.txt
    └── PRUEBAS_AUTOMATIZADAS.txt
```

---

## 🚀 Instalación y ejecución local

### Requisitos previos
- Node.js 18+
- npm
- Acceso a la BD RDS (o PostgreSQL local)

### Frontend

```bash
cd medisync-web
npm install
cp .env.example .env
# Editar .env: REACT_APP_API_URL=http://3.219.251.228:3000/api
npm start
# Disponible en http://localhost:3000
```

### Backend

```bash
cd medisync-backend
npm install
cp .env.example .env
# Editar .env con las variables reales (ver .env.example)
npm start
# API disponible en http://localhost:3000
```

### Base de datos (primera vez)

```bash
# Crear tablas
PGPASSWORD='<password>' psql -h <host> -U medisync_admin -d medisync_db \
  -f medisync-backend/src/config/schema.sql

# Insertar datos de prueba
PGPASSWORD='<password>' psql -h <host> -U medisync_admin -d medisync_db \
  -f medisync-backend/src/config/seed.sql
```

---

## ☁️ Deploy en AWS

### Frontend → S3

```bash
cd medisync-web
# Asegurarse que .env tiene la IP correcta del backend
Remove-Item -Recurse -Force build   # Windows PowerShell
npm run build
aws s3 sync build/ s3://medisync-web-20260501 --delete
```

### Backend → EC2

```bash
# Conectarse al EC2
ssh -i "labsuser.pem" ec2-user@3.219.251.228

# Actualizar código
cd /home/ec2-user/repo
git fetch origin && git reset --hard origin/main

# Levantar con PM2
cd medisync-backend
pm2 start src/index.js --name medisync-api
pm2 save
```

### Reinicio del laboratorio AWS Academy

Cada vez que el lab se pausa y reinicia:

```bash
# 1. Actualizar credenciales AWS (Canvas > AWS Details > Show)
aws configure set aws_access_key_id <nuevo>
aws configure set aws_secret_access_key <nuevo>
aws configure set aws_session_token <nuevo>

# 2. Conectarse al EC2 (la Elastic IP 3.219.251.228 es fija)
ssh -i "labsuser.pem" ec2-user@3.219.251.228

# 3. Levantar el backend
cd /home/ec2-user/repo/medisync-backend
pm2 start src/index.js --name medisync-api
```

---

## 🧪 Pruebas

```bash
# Backend (Jest)
cd medisync-backend
npm test

# Frontend (React Testing Library)
cd medisync-web
npm test
```

**30 pruebas automatizadas — 30 pasando.**
Ver `documentacion/PRUEBAS_AUTOMATIZADAS.txt` para el detalle completo.

---

## 📋 Historias de usuario implementadas

| HU | Descripción | Estado |
|---|---|---|
| HU-01 | Login recepcionista (web) | ✅ |
| HU-04 | Crear cita (web) | ✅ |
| HU-05 | Ver agenda del día (web) | ✅ |
| HU-06 | Cancelar cita (web) | ✅ |
| HU-07 | Modificar cita (web) | ✅ |
| HU-10 | Ver lista de médicos (web) | ✅ |
| HU-13 | Notificación por correo al agendar | ✅ |
| HU-15 | Registrar nuevo paciente (web) | ✅ |
| HU-18 | Cerrar sesión (web) | ✅ |
| HU-21 | Ver agenda como médico (web) | ✅ |
| HU-AD1 | Login de paciente (web) | ✅ |
| HU-AD2 | Ver mis citas (paciente) | ✅ |
| HU-AD3 | Gestión de usuarios (director) | ✅ |

---

## 📚 Documentación adicional

| Documento | Descripción |
|---|---|
| [openapi.yaml](medisync-backend/openapi.yaml) | Especificación completa de la API (OpenAPI 3.0) |
| [Swagger UI](http://medisync-web-20260501.s3-website-us-east-1.amazonaws.com/api-docs.html) | Documentación interactiva de la API |
| [GUIA_COMPONENTES_WEB_FORMAL.txt](documentacion/GUIA_COMPONENTES_WEB_FORMAL.txt) | Guía de componentes React |
| [PRUEBAS_AUTOMATIZADAS.txt](documentacion/PRUEBAS_AUTOMATIZADAS.txt) | Resultados de pruebas |
| [PARTE1_MVP.txt](documentacion/PARTE1_MVP.txt) | Documentación técnica del MVP |
| [PARTE2_ENTREGA_FINAL.txt](documentacion/PARTE2_ENTREGA_FINAL.txt) | Documentación entrega final |

---

## 👨‍💻 Equipo

| Rol | Nombre |
|---|---|
| Product Owner / Dev Web | Henrique |
| Scrum Master | César |
| Arquitecto / Dev | Luis Alfonso |
