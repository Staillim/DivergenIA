# ⚡ AthenIA - Plataforma del Semillero de Investigación en IA

Plataforma web avanzada para gestión de proyectos, ideas, avances y recursos del semillero de investigación AthenIA. Combina la sabiduría de Atenea con inteligencia artificial moderna.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express |
| **Base de datos** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth |
| **Storage** | Supabase Storage |

## 📁 Estructura del Proyecto

```
DivergenIA/
├── frontend/          # React App (Vite)
│   ├── src/
│   │   ├── components/   # Componentes reutilizables (Navbar, RoleBadge, ProtectedRoute)
│   │   ├── pages/        # Páginas de la app (9 vistas + gestión de usuarios)
│   │   ├── context/      # Auth Context con roles
│   │   ├── lib/          # Configuración Supabase
│   │   └── styles/       # CSS modular con efectos avanzados
│   ├── public/           # Logo AthenIA SVG
│   ├── index.html
│   └── vite.config.js
├── backend/           # API Node.js/Express
│   ├── server.js
│   └── .env.example
├── database/          # SQL migrations
│   └── schema.sql
└── docs/              # Documentación (Propuesta completa)
```

## 🌟 Funcionalidades Destacadas

### Gestión de Proyectos
- **Dashboard Personalizado** — Resumen de actividades, proyectos y estadísticas
- **CRUD de Proyectos** — Crear, editar y gestionar proyectos con estados (idea, desarrollo, investigación, pruebas, finalizado)
- **Equipos Dinámicos** — Asignar roles específicos por proyecto (líder, investigador, desarrollador, diseñador)
- **Sistema de Avances** — Publicar actualizaciones con métricas de progreso
- **Archivos Adjuntos** — Repositorio de recursos por proyecto

### Innovación Colaborativa
- **Banco de Ideas** — Proponer nuevas iniciativas
- **Sistema de Votación** — Votar a favor o en contra de ideas
- **Aprobación Admin** — Flujo de revisión para pasar de votación a aprobada
- **Comentarios** — Feedback en tiempo real en ideas y avances

### Biblioteca de Recursos
- **Storage Supabase** — Subida y descarga de archivos
- **Categorización** — Por tipo (documento, código, presentación, dataset)
- **Control de Privacidad** — Archivos públicos o privados por proyecto
- **Métricas de Descargas** — Contador de popularidad de recursos

### Sistema de Roles Avanzado
- **👁️ Visitante** — Puede ver proyectos públicos
- **⭐ Miembro** — Acceso completo a proyectos, ideas, biblioteca
- **🏆 Administrador** — Gestión de usuarios, aprobación de ideas, cambio de estados

### UI/UX Moderna
- **Tema AthenIA** — Paleta de azules (#003DA5, #0099FF, #00BFFF)
- **Efectos Avanzados**:
  - ✨ Shimmer en cards (gradiente animado en hover)
  - 🔮 Orbs flotantes (pseudo-elemento ::after animado)
  - 🎯 Partículas animadas en hover
  - 🌈 Gradientes únicos por tipo de tarjeta
  - 🎭 Transformaciones 3D en hover
  - 💫 Sombras dinámicas multicapa
- **Logo Animado** — SVG con gradientes que rota al hacer hover
- **Badges de Rol** — Visualización clara de permisos con iconos
- **Responsive Design** — Optimizado para móvil y desktop

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Proyecto Supabase ID: `ajtvxekosfigkhmlmyqd`

### 📦 Setup Completo (5 minutos)

#### 1. Obtener API Keys de Supabase

Abre este enlace para acceder directamente a las API keys de tu proyecto:
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/settings/api
```

Copia dos valores:
- **anon public** (para el frontend)
- **service_role** (para el backend)

#### 2. Configurar Variables de Entorno

**Frontend**:
```bash
cd frontend
cp .env.example .env
# Edita .env y pega el "anon public key" en VITE_SUPABASE_ANON_KEY
```

**Backend**:
```bash
cd backend
cp .env.example .env
# Edita .env y pega el "service_role key" en SUPABASE_SERVICE_KEY
```

#### 3. Ejecutar Schema SQL

Abre el SQL Editor:
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/editor
```

1. Copia todo el contenido de `database/schema.sql`
2. Pégalo en el editor
3. Click en **RUN**

Esto creará 9 tablas con Row Level Security, triggers e índices.

#### 4. Crear Bucket de Storage

Abre Storage:
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/storage/buckets
```

1. Click en **New bucket**
2. Nombre: `library`
3. Marca **Public bucket**
4. Click **Create**

#### 5. Instalar Dependencias e Iniciar

**Frontend** (Terminal 1):
```bash
cd frontend
npm install
npm run dev
```
🌐 Accede a: http://localhost:3000

**Backend** (Terminal 2):
```bash
cd backend
npm install
npm run dev
```
🔌 API en: http://localhost:4000

#### 6. Verificar Conexión (Opcional)

```bash
cd backend
node verify-connection.js
```

### 🔗 Enlaces Rápidos de Configuración

| Recurso | URL |
|---------|-----|
| **API Keys** | https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/settings/api |
| **SQL Editor** | https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/editor |
| **Storage** | https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/storage/buckets |
| **Auth Settings** | https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/auth/users |
| **Database** | https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/database/tables |

> 📖 Para instrucciones detalladas, consulta [SETUP_SUPABASE.md](SETUP_SUPABASE.md)

## 📋 Funcionalidades Completas

### Autenticación y Usuarios
- Registro con nombre, carrera y semestre
- Login con email/contraseña
- Gestión de perfil (foto, bio, habilidades, GitHub, LinkedIn)
- Sistema de roles (visitante, miembro, administrador)
- Panel de administración de usuarios (solo admins)
- Activar/desactivar usuarios
- Cambio de roles en tiempo real

### Proyectos
- Crear proyectos con título, descripción, repositorio e imagen
- Estados: idea, desarrollo, investigación, pruebas, finalizado, cancelado, pausa
- Equipos con roles personalizados por proyecto
- Avances con métricas JSON (progreso, horas, etc.)
- Control de visibilidad (públicos o privados)
- Filtros por estado y búsqueda

### Ideas
- Proponer ideas con título y descripción
- Sistema de votación (favor/contra)
- Estados: votación, aprobada, rechazada, modificación
- Aprobación/rechazo por administradores
- Contador de votos en tiempo real

### Biblioteca
- Subir archivos con categorización
- Asociar archivos a proyectos o avances
- Control de privacidad
- Contador de descargas
- Búsqueda y filtrado

### Dashboard
- Estadísticas personales (proyectos, ideas, archivos)
- Resumen de proyectos activos
- Ideas recientes
- Actividad del semillero

### Miembros
- Directorio de todos los usuarios
- Perfiles con habilidades, carrera y enlaces
- Filtro por rol y búsqueda
- Vista de proyectos por miembro

## 👥 Roles de Usuario

| Rol | Acceso |
|-----|--------|
| Visitante | Ver página pública, proyectos públicos |
| Miembro | Crear proyectos, ideas, subir archivos |
| Administrador | Aprobar miembros, gestionar todo |

## 🌐 Despliegue en Producción

La aplicación está lista para desplegarse en servicios gratuitos:

- **Frontend**: Netlify (archivo `netlify.toml` incluido)
- **Backend**: Render.com o Railway
- **Base de datos**: Supabase (ya configurado)

📖 **Guía completa de despliegue**: Ver [DEPLOYMENT.md](DEPLOYMENT.md)

### Resumen Rápido

1. **Backend en Render**:
   - Conecta el repo en render.com
   - Root directory: `backend`
   - Agrega variables de entorno (SUPABASE_URL, SUPABASE_SERVICE_KEY, FRONTEND_URL)

2. **Frontend en Netlify**:
   - Conecta el repo en netlify.com
   - Detecta automáticamente la configuración
   - Agrega variables de entorno (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

3. **Actualiza CORS**: Agrega la URL de Netlify en `backend/.env` → `FRONTEND_URL`

## 📄 Licencia

Proyecto interno del Semillero DivergenIA © 2026
