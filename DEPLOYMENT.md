# Guía de Despliegue AthenIA

## Arquitectura de Despliegue

- **Frontend**: Netlify (estático)
- **Backend**: Render.com (Node.js gratuito)
- **Base de Datos**: Supabase (ya configurado)

---

## 1. Desplegar Backend en Render

### Paso 1: Crear cuenta en Render
1. Ve a [render.com](https://render.com) y regístrate con GitHub
2. Da autorización a Render para acceder a tu repositorio

### Paso 2: Crear Web Service
1. Click en **"New +"** → **"Web Service"**
2. Conecta el repositorio `Staillim/DivergenIA`
3. Configuración:
   - **Name**: `athenia-backend` (o el que prefieras)
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Paso 3: Variables de Entorno
En la sección **Environment**, agrega:

```
SUPABASE_URL=https://ajtvxekosfigkhmlmyqd.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key-aquí
PORT=4000
```

⚠️ **Importante**: Necesitas el **service_role key** de Supabase (no el anon key). Lo obtienes en:
- Supabase Dashboard → Project Settings → API → `service_role` key (secret)

### Paso 4: Deploy
- Click **"Create Web Service"**
- Espera 3-5 minutos a que termine el build
- Copia la URL que te da Render (ejemplo: `https://athenia-backend.onrender.com`)

---

## 2. Desplegar Frontend en Netlify

### Paso 1: Configurar variables de entorno del Frontend
El frontend necesita saber dónde está el backend. Crea/actualiza `frontend/.env`:

```
VITE_SUPABASE_URL=https://ajtvxekosfigkhmlmyqd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdHZ4ZWtvc2ZpZ2tobWxteXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzUwMDksImV4cCI6MjA4ODc1MTAwOX0.o9xDXmEYe2r_dAzKpE9E4KbUUaXJ_OydwV17OFxJYGY
VITE_BACKEND_URL=https://tu-backend-render.onrender.com
```

### Paso 2: Actualizar código del frontend
Si el frontend hace llamadas al backend (actualmente no las usa directamente, pero por si acaso), usa `VITE_BACKEND_URL`.

### Paso 3: Desplegar en Netlify
1. Ve a [netlify.com](https://netlify.com) y regístrate
2. Click **"Add new site"** → **"Import an existing project"**
3. Selecciona GitHub → repositorio `DivergenIA`
4. Configuración automática (detecta `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

### Paso 4: Variables de Entorno en Netlify
En **Site Settings → Environment Variables**, agrega:

```
VITE_SUPABASE_URL = https://ajtvxekosfigkhmlmyqd.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdHZ4ZWtvc2ZpZ2tobWxteXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzUwMDksImV4cCI6MjA4ODc1MTAwOX0.o9xDXmEYe2r_dAzKpE9E4KbUUaXJ_OydwV17OFxJYGY
```

### Paso 5: Deploy
- Click **"Deploy site"**
- Espera 2-3 minutos
- Obtendrás una URL tipo `https://random-name.netlify.app`
- Puedes cambiar el nombre en **Site Settings → Domain Management**

---

## 3. Configurar CORS en el Backend

Si el frontend hace llamadas al backend, actualiza `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://tu-sitio.netlify.app'  // ← Agregar tu URL de Netlify
  ],
  credentials: true
}
app.use(cors(corsOptions))
```

Luego push a GitHub y Render se redesplegará automáticamente.

---

## 4. Verificación

1. **Backend**: Visita `https://tu-backend.onrender.com/` → debe decir "AthenIA API"
2. **Frontend**: Visita `https://tu-sitio.netlify.app` → debe cargar la app
3. **Auth**: Prueba registrarte/iniciar sesión

---

## Troubleshooting

### "Failed to load resource" o CORS error
- Verifica que el backend esté corriendo
- Confirma las URLs en las variables de entorno
- Revisa la configuración de CORS en `server.js`

### Backend en Render responde lento
- El plan gratuito "duerme" después de 15 min de inactividad
- Primera petición tarda ~30 segundos en "despertar"
- Considera upgrade a plan pagado ($7/mes) para mantenerlo activo

### Build falla en Netlify
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de build en Netlify Dashboard

---

## Alternativas

### Opción 2: Todo en Vercel
Vercel soporta frontend + backend con Vercel Functions:
- Desplegar todo el proyecto en Vercel
- Automaticamente detecta la estructura
- Más fácil pero menos control

### Opción 3: Todo en Render
- Desplegar frontend como "Static Site" en Render
- Desplegar backend como "Web Service"
- Todo en un solo lugar

### Opción 4: Railway
Similar a Render, con plan gratuito generoso:
- railway.app tiene mejor rendimiento que Render free tier
- Soporta monorepos fácilmente
