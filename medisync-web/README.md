# MediSync Web 🏥

Interfaz web para la Clínica San Ángel. Desarrollada en React para recepcionistas, médicos y el director.

## Stack

- React 18 (JavaScript)
- React Router v6
- Axios
- CSS Modules / CSS Variables
- Desplegado en S3 Static Website Hosting

## Instalación local

```bash
npm install
cp .env.example .env
# Editar .env con la IP del backend EC2
npm start
```

## Despliegue a S3

```bash
npm run build
aws s3 sync build/ s3://medisync-web-20260501 --delete
```

URL del sitio: http://medisync-web-20260501.s3-website-us-east-1.amazonaws.com

## Estructura

```
src/
├── components/     # Componentes reutilizables
│   ├── common/     # Button, Input, Card, Navbar, Sidebar
│   ├── auth/       # LoginForm
│   ├── appointments/ # Agenda, formularios de citas
│   ├── patients/   # Lista y formulario de pacientes
│   ├── doctors/    # Lista y tarjeta de médicos
│   └── dashboard/  # Dashboard con estadísticas
├── pages/          # Páginas principales
├── services/       # Llamadas a la API REST
├── hooks/          # useAuth, useForm
├── contexts/       # AuthContext
└── utils/          # Validadores y formateadores
```

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| recepcionista | Dashboard, Agenda, Pacientes, Médicos |
| medico | Dashboard, Agenda (sus citas) |
| director | Dashboard, Médicos |

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| REACT_APP_API_URL | URL base del backend (EC2) |
