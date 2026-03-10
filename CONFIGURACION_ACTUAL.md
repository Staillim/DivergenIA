# ✅ Configuración de Supabase - Estado Actual

## 🔗 Información de Conexión Configurada

### Proyecto Supabase
- **Project ID**: `ajtvxekosfigkhmlmyqd`
- **Project URL**: `https://ajtvxekosfigkhmlmyqd.supabase.co`
- **Región**: AWS US-East-1

### Transaction Pooler (PostgreSQL Directo)
- **Host**: `aws-1-us-east-1.pooler.supabase.com`
- **Puerto**: `6543`
- **Database**: `postgres`
- **Usuario**: `postgres.ajtvxekosfigkhmlmyqd`
- **Contraseña**: `DivergenIA1122` ✅

### Archivos de Configuración Creados
- ✅ `frontend/.env` - Configuración del cliente React
- ✅ `backend/.env` - Configuración del servidor Node.js
- ✅ `frontend/.env.example` - Template actualizado
- ✅ `backend/.env.example` - Template actualizado

## ⏳ Pendiente: Completar API Keys

Para que la aplicación funcione, necesitas agregar las API keys de Supabase:

### 🔑 Paso 1: Obtener API Keys

**Abre este enlace en tu navegador:**
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/settings/api
```

Verás dos secciones importantes:

#### Project API Keys
1. **anon public** (Project API key)
   - Esta es segura para usar en el navegador
   - Cópiala completa (empieza con `eyJhbGci...`)
   
2. **service_role** (Secret API key)
   - Esta es secreta, solo para el servidor
   - Cópiala completa (empieza con `eyJhbGci...`)

### 📝 Paso 2: Pegar en los Archivos .env

#### Frontend (`frontend/.env`)
Abre el archivo y reemplaza:
```env
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Por:
```env
VITE_SUPABASE_ANON_KEY=eyJhbGci... (pega aquí el anon public key)
```

#### Backend (`backend/.env`)
Abre el archivo y reemplaza:
```env
SUPABASE_SERVICE_KEY=tu-service-role-key-aqui
```

Por:
```env
SUPABASE_SERVICE_KEY=eyJhbGci... (pega aquí el service_role key)
```

### 🗄️ Paso 3: Ejecutar el Schema SQL

**Abre el SQL Editor:**
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/editor
```

1. Click en **New query**
2. Abre el archivo `database/schema.sql` de este proyecto
3. Copia TODO su contenido
4. Pégalo en el editor de Supabase
5. Click en **RUN** o presiona `Ctrl + Enter`

Esto creará:
- ✅ 9 tablas (usuarios, proyectos, ideas, etc.)
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Políticas de acceso basadas en roles
- ✅ Triggers para timestamps automáticos
- ✅ Índices para optimización

### 📦 Paso 4: Crear Bucket de Storage

**Abre Storage:**
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/storage/buckets
```

1. Click en **New bucket**
2. Nombre: `library`
3. Marca la casilla **Public bucket**
4. Click en **Create bucket**

Este bucket almacenará archivos de la biblioteca (PDFs, documentos, código, etc.)

## 🚀 Paso 5: Iniciar la Aplicación

Una vez completados los pasos anteriores:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Abre: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
API en: http://localhost:4000

**Verificar conexión (opcional):**
```bash
cd backend
node verify-connection.js
```

## 📚 Recursos Adicionales

- [Documentación completa de setup](SETUP_SUPABASE.md)
- [README del proyecto](README.md)
- [Propuesta completa de AthenIA](docs/Propuesta-Plataforma-DivergenIA.md)

## ❓ Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste las keys completas (son largas, ~200+ caracteres)
- Asegúrate de NO tener espacios al inicio o final
- Verifica que el anon key esté en frontend y el service_role en backend

### Error: "relation usuarios does not exist"
- Esto significa que no ejecutaste el schema SQL
- Ve al paso 3 y ejecútalo en el SQL Editor de Supabase

### Error: "Storage bucket not found"
- Crea el bucket "library" en Storage (Paso 4)
- Asegúrate de que sea público

### Frontend no carga
- Verifica que el servidor de Vite esté corriendo en el puerto 3000
- Revisa la consola del navegador para errores
- Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en frontend/.env

---

💡 **Tip**: Después de editar archivos .env, reinicia los servidores (ctrl+C y volver a ejecutar npm run dev)
