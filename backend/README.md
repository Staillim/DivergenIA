# AthenIA Backend

## Despliegue en Render

Este servicio debe desplegarse en Render.com como Web Service.

### Configuración:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Variables de Entorno Requeridas:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` (service_role key, no anon key)
- `FRONTEND_URL` (URL de tu frontend en Netlify)
- `PORT` (4000 o el que asigne Render)
