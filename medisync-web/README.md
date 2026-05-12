# MediSync Web 🏥

Interfaz web para el sistema de gestión de citas médicas de la **Clínica San Ángel**.
Desarrollada en React para recepcionistas, médicos, directores y pacientes.

**URL de producción:** http://medisync-web-20260501.s3-website-us-east-1.amazonaws.com

## Stack

| Paquete | Versión | Uso |
|---|---|---|
| react | 18.2.0 | UI |
| react-router-dom | 6.22.3 | Enrutamiento |
| axios | 1.6.8 | Llamadas a la API |
| react-scripts | 5.0.1 | Build (CRA) |

Estilos: CSS puro con variables CSS (sin frameworks externos).

## Instalación local

```bash
npm install
cp .env.example .env
# Editar .env:
#   REACT_APP_API_URL=http://3.219.251.228:3000/api
npm start
# Disponible en http://localhost:3000
```

## Variables de entorno

| Variable | Descripción | Valor producción |
|---|---|---|
| REACT_APP_API_URL | URL base del backend | http://3.219.251.228:3000/api |

> ⚠️ Las variables `REACT_APP_*` se incrustan en el bundle durante el build.
> Si cambia la IP del backend, eliminar `build/` y hacer nuevo build.

## Deploy a S3

```bash
# Windows PowerShell
Remove-Item -Recurse -Force build
npm run build
aws s3 sync build/ s3://medisync-web-20260501 --delete
```

## Pruebas

```bash
npm test
# 20 pruebas: validadores (10) + formateadores (10)
```

## Estructura

```
src/
├── assets/styles/      # variables.css, global.css
├── components/
│   ├── common/         # Button, Input, Card, Navbar, Sidebar
│   ├── auth/           # LoginForm, LoginPacienteForm
│   ├── appointments/   # AgendaView, CreateAppointmentForm,
│   │                   # EditAppointmentForm, CancelAppointmentModal
│   ├── patients/       # PatientList, PatientForm, PatientSearch
│   ├── doctors/        # DoctorList, DoctorCard
│   ├── users/          # UserList, UserForm
│   └── dashboard/      # Dashboard
├── pages/              # LoginPage, DashboardPage, AgendaPage,
│                       # PatientsPage, DoctorsPage, UsersPage,
│                       # MisCitasPage, NotFoundPage
├── services/           # api.js, authService, appointmentService,
│                       # patientService, doctorService
├── contexts/           # AuthContext
├── hooks/              # useAuth, useForm
└── utils/              # validators.js, formatters.js
```

## Roles y acceso

| Rol | Páginas accesibles |
|---|---|
| recepcionista | Dashboard, Agenda, Pacientes, Médicos |
| medico | Dashboard, Agenda (solo sus citas) |
| director | Dashboard, Médicos, Usuarios |
| paciente | Mis Citas |

## Páginas y rutas

| Ruta | Página | Roles |
|---|---|---|
| `/login` | LoginPage | Público |
| `/dashboard` | DashboardPage | recepcionista, medico, director |
| `/agenda` | AgendaPage | recepcionista, medico |
| `/pacientes` | PatientsPage | recepcionista |
| `/medicos` | DoctorsPage | recepcionista, director |
| `/usuarios` | UsersPage | director |
| `/mis-citas` | MisCitasPage | paciente |
