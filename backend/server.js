import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Supabase Admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DivergenIA API', timestamp: new Date().toISOString() })
})

// ============================================
// PROYECTOS
// ============================================

// Obtener stats del semillero (público)
app.get('/api/stats', async (req, res) => {
  try {
    const { count: projectsCount } = await supabase
      .from('proyectos')
      .select('*', { count: 'exact', head: true })

    const { count: membersCount } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .in('rol', ['miembro', 'administrador'])
      .eq('activo', true)

    const { count: ideasCount } = await supabase
      .from('ideas')
      .select('*', { count: 'exact', head: true })

    res.json({
      projects: projectsCount || 0,
      members: membersCount || 0,
      ideas: ideasCount || 0
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
})

// Cambiar estado de un proyecto (solo admin)
app.patch('/api/projects/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    // Verificar token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (profile?.rol !== 'administrador') {
      return res.status(403).json({ error: 'Solo administradores pueden cambiar el estado' })
    }

    const validStates = ['idea', 'desarrollo', 'investigacion', 'pruebas', 'finalizado', 'cancelado', 'pausa']
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const { data, error } = await supabase
      .from('proyectos')
      .update({ estado })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' })
  }
})

// Aprobar una idea (solo admin)
app.patch('/api/ideas/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const { data: profile } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (profile?.rol !== 'administrador') {
      return res.status(403).json({ error: 'Solo administradores' })
    }

    const validStates = ['votacion', 'aprobada', 'rechazada', 'modificacion']
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const { data, error } = await supabase
      .from('ideas')
      .update({ estado })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar idea' })
  }
})

// Agregar miembro a un proyecto
app.post('/api/projects/:id/members', async (req, res) => {
  try {
    const { id } = req.params
    const { usuario_id, rol_equipo } = req.body
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const { data, error } = await supabase
      .from('miembros_proyecto')
      .insert({
        proyecto_id: id,
        usuario_id,
        rol_equipo: rol_equipo || 'miembro'
      })
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar miembro' })
  }
})

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
  🧠 DivergenIA API Server
  ========================
  Puerto: ${PORT}
  URL:    http://localhost:${PORT}
  Health: http://localhost:${PORT}/api/health
  `)
})
