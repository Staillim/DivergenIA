## 🚨 Error: "Failed to fetch" al iniciar sesión

### Causa
Las variables de entorno de Supabase **NO están configuradas en Netlify**.

### Solución (3 pasos)

#### 1. Ir a Environment Variables en Netlify
En tu sitio de Netlify:
- Click en **Site configuration** (en el menú izquierdo)
- Click en **Environment variables**
- Click en **Add a variable**

#### 2. Agregar las 2 variables

**Primera variable:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://ajtvxekosfigkhmlmyqd.supabase.co`
- Click **Create variable**

**Segunda variable:**
- Key: `VITE_SUPABASE_ANON_KEY`  
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdHZ4ZWtvc2ZpZ2tobWxteXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzUwMDksImV4cCI6MjA4ODc1MTAwOX0.o9xDXmEYe2r_dAzKpE9E4KbUUaXJ_OydwV17OFxJYGY`
- Click **Create variable**

#### 3. Re-desplegar el sitio
- Ve a **Deploys** (en el menú superior)
- Click en **Trigger deploy** → **Clear cache and deploy site**
- Espera 2-3 minutos

### Verificar que funcionó
Después del nuevo deploy:
1. Abre la consola del navegador (F12)
2. NO deberías ver el error "Variables de entorno de Supabase no configuradas"
3. Ya podrás iniciar sesión

---

**Nota**: Las variables de entorno se inyectan en **tiempo de compilación**. Por eso necesitas hacer un nuevo deploy después de agregarlas.
