# 🔑 Completar Configuración de Supabase

La conexión a Supabase está **parcialmente configurada**. Para completarla, necesitas las API keys.

## 📋 Pasos para Obtener las API Keys:

### 1. Accede al Panel de API de tu Proyecto
Abre esta URL en tu navegador:
```
https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/settings/api
```

### 2. Copia las Keys

Verás dos keys importantes:

#### Para el Frontend (`frontend/.env`):
- Busca **"anon public"** o **"anon key"**
- Copia el valor completo (empieza con `eyJhbGci...`)
- Reemplaza `tu-anon-key-aqui` en `frontend/.env` con este valor

#### Para el Backend (`backend/.env`):
- Busca **"service_role"** o **"service_role key"** (marcada como SECRET)
- Copia el valor completo (empieza con `eyJhbGci...`)
- Reemplaza `tu-service-role-key-aqui` en `backend/.env` con este valor

### 3. Guarda los Archivos

Después de pegar las keys, guarda ambos archivos `.env`.

### 4. Reinicia los Servidores

```bash
# En una terminal (Frontend)
cd frontend
npm run dev

# En otra terminal (Backend)
cd backend
npm run dev
```

## ✅ Archivos Ya Configurados:

- ✅ **URL del proyecto**: `https://ajtvxekosfigkhmlmyqd.supabase.co`
- ✅ **Contraseña de PostgreSQL**: `DivergenIA1122`
- ✅ **Transaction Pooler**: Configurado en `backend/.env`
- ⏳ **Anon Key**: Pendiente - necesitas copiarla
- ⏳ **Service Role Key**: Pendiente - necesitas copiarla

## 🔒 Seguridad

- ⚠️ **NUNCA** compartas el `service_role key` públicamente
- ⚠️ **NUNCA** subas archivos `.env` a Git
- ✅ Los archivos `.env` ya están en `.gitignore` automáticamente

## 🗄️ Ejecutar el Schema SQL

Antes de probar la app, ejecuta el schema de la base de datos:

1. Ve a https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/editor
2. Abre el **SQL Editor**
3. Copia todo el contenido del archivo `database/schema.sql`
4. Pégalo en el editor y haz click en **RUN**

Esto creará todas las tablas, políticas RLS, triggers e índices necesarios.

## 📦 Crear el Bucket de Storage

Para que funcione la biblioteca de archivos:

1. Ve a https://app.supabase.com/project/ajtvxekosfigkhmlmyqd/storage/buckets
2. Click en **New bucket**
3. Nombre: `library`
4. Marca como **Public bucket**
5. Click en **Create bucket**

---

Una vez completados estos pasos, la plataforma AthenIA estará lista para usar.
