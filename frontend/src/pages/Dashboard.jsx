import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiFolder, FiZap, FiFile, FiUsers, FiTrendingUp, FiMessageCircle, FiThumbsUp, FiThumbsDown, FiUpload, FiCheckCircle, FiClock, FiChevronRight } from 'react-icons/fi'
import '../styles/dashboard.css'

function Dashboard() {
  const { profile, loading: authLoading, error: authError } = useAuth()
  const [stats, setStats] = useState({ projects: 0, ideas: 0, members: 0 })
  const [myProjects, setMyProjects] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered - profile:', !!profile, 'authLoading:', authLoading, 'authError:', authError)
    
    if (profile) {
      console.log('[Dashboard] Profile exists, loading dashboard...')
      setLoading(true)
      loadDashboard()
    } else if (!authLoading) {
      console.log('[Dashboard] No profile and auth finished, stopping loading')
      setLoading(false)
    } else {
      console.log('[Dashboard] Waiting for auth... authLoading:', authLoading)
    }
  }, [profile, authLoading, authError])

  async function loadDashboard() {
    try {
      // My projects
      const { data: memberOf } = await supabase
        .from('miembros_proyecto')
        .select('proyecto_id, rol_equipo, proyectos(id, titulo, estado, descripcion, updated_at)')
        .eq('usuario_id', profile.id)
        .eq('activo', true)

      const projects = memberOf?.map(m => ({ ...m.proyectos, rol: m.rol_equipo })) || []
      setMyProjects(projects)
      const myProjectIds = projects.map(p => p.id)

      // Build activity feed from multiple sources in parallel
      const feedItems = []

      const [avancesRes, ideasRes, comentariosRes, membersRes, statsRes] = await Promise.all([
        // Recent avances from my projects
        myProjectIds.length > 0
          ? supabase
              .from('avances')
              .select('id, titulo, descripcion, fecha, proyecto_id, proyectos(titulo), autor_id, usuarios:autor_id(nombre)')
              .in('proyecto_id', myProjectIds)
              .order('fecha', { ascending: false })
              .limit(10)
          : Promise.resolve({ data: [] }),

        // Recent ideas from everyone
        supabase
          .from('ideas')
          .select('id, titulo, descripcion, estado, votos_favor, votos_contra, fecha_publicacion, autor_id, usuarios:autor_id(nombre)')
          .order('fecha_publicacion', { ascending: false })
          .limit(10),

        // Recent comments on my projects
        myProjectIds.length > 0
          ? supabase
              .from('comentarios')
              .select('id, contenido, fecha, proyecto_id, proyectos(titulo), idea_id, autor_id, usuarios:autor_id(nombre)')
              .in('proyecto_id', myProjectIds)
              .order('fecha', { ascending: false })
              .limit(10)
          : Promise.resolve({ data: [] }),

        // New members in my projects
        myProjectIds.length > 0
          ? supabase
              .from('miembros_proyecto')
              .select('id, proyecto_id, proyectos(titulo), usuario_id, usuarios(nombre), rol_equipo, fecha_union')
              .in('proyecto_id', myProjectIds)
              .neq('usuario_id', profile.id)
              .order('fecha_union', { ascending: false })
              .limit(8)
          : Promise.resolve({ data: [] }),

        // Stats
        Promise.all([
          supabase.from('miembros_proyecto').select('*', { count: 'exact', head: true }).eq('usuario_id', profile.id),
          supabase.from('ideas').select('*', { count: 'exact', head: true }),
          supabase.from('usuarios').select('*', { count: 'exact', head: true }),
        ])
      ])

      // Process avances
      ;(avancesRes.data || []).forEach(a => {
        feedItems.push({
          type: 'avance',
          id: 'av-' + a.id,
          date: a.fecha,
          author: a.usuarios?.nombre || 'Alguien',
          authorInitial: (a.usuarios?.nombre || 'A').charAt(0).toUpperCase(),
          project: a.proyectos?.titulo,
          projectId: a.proyecto_id,
          title: a.titulo,
          body: a.descripcion,
        })
      })

      // Process ideas
      ;(ideasRes.data || []).forEach(i => {
        feedItems.push({
          type: 'idea',
          id: 'id-' + i.id,
          ideaId: i.id,
          date: i.fecha_publicacion,
          author: i.usuarios?.nombre || 'Alguien',
          authorInitial: (i.usuarios?.nombre || 'A').charAt(0).toUpperCase(),
          title: i.titulo,
          body: i.descripcion,
          estado: i.estado,
          votos_favor: i.votos_favor,
          votos_contra: i.votos_contra,
        })
      })

      // Process comments
      ;(comentariosRes.data || []).forEach(c => {
        feedItems.push({
          type: 'comment',
          id: 'cm-' + c.id,
          date: c.fecha,
          author: c.usuarios?.nombre || 'Alguien',
          authorInitial: (c.usuarios?.nombre || 'A').charAt(0).toUpperCase(),
          project: c.proyectos?.titulo,
          projectId: c.proyecto_id,
          body: c.contenido,
        })
      })

      // Process new members
      ;(membersRes.data || []).forEach(m => {
        feedItems.push({
          type: 'member',
          id: 'mb-' + m.id,
          date: m.fecha_union,
          author: m.usuarios?.nombre || 'Alguien',
          authorInitial: (m.usuarios?.nombre || 'A').charAt(0).toUpperCase(),
          project: m.proyectos?.titulo,
          projectId: m.proyecto_id,
          role: m.rol_equipo,
        })
      })

      // Sort by date desc
      feedItems.sort((a, b) => new Date(b.date) - new Date(a.date))
      setFeed(feedItems.slice(0, 20))

      const [projStat, ideasStat, membersStat] = statsRes
      setStats({
        projects: projStat.count || 0,
        ideas: ideasStat.count || 0,
        members: membersStat.count || 0,
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  function timeAgo(dateStr) {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Ahora'
    if (mins < 60) return `hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `hace ${days}d`
    return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
  }

  const feedIcon = {
    avance: <FiTrendingUp />,
    idea: <FiZap />,
    comment: <FiMessageCircle />,
    member: <FiUsers />,
  }

  const feedLabel = {
    avance: 'publicó un avance',
    idea: 'propuso una idea',
    comment: 'comentó en',
    member: 'se unió a',
  }

  const feedColor = {
    avance: 'feed-avance',
    idea: 'feed-idea',
    comment: 'feed-comment',
    member: 'feed-member',
  }

  const statusBadge = (estado) => {
    const map = { idea: 'badge-idea', desarrollo: 'badge-desarrollo', investigacion: 'badge-investigacion', pruebas: 'badge-pruebas', finalizado: 'badge-finalizado', votacion: 'badge-votacion', aprobada: 'badge-aprobada', rechazada: 'badge-rechazada' }
    return map[estado] || 'badge-idea'
  }

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Cargando...</p></div>
  }

  return (
    <div className="page dashboard">
      {/* Compact header */}
      <div className="dash-greeting">
        <h1>Hola, {profile?.nombre?.split(' ')[0] || 'Miembro'}</h1>
        <p>Así va el semillero hoy</p>
      </div>

      {/* Stats bar */}
      <div className="dash-stats">
        <div className="dash-stat">
          <FiFolder />
          <span className="dash-stat-num">{stats.projects}</span>
          <span className="dash-stat-label">Proyectos</span>
        </div>
        <div className="dash-stat">
          <FiZap />
          <span className="dash-stat-num">{stats.ideas}</span>
          <span className="dash-stat-label">Ideas</span>
        </div>
        <div className="dash-stat">
          <FiUsers />
          <span className="dash-stat-num">{stats.members}</span>
          <span className="dash-stat-label">Miembros</span>
        </div>
        <div className="dash-stat">
          <FiCheckCircle />
          <span className="dash-stat-num">{myProjects.filter(p => p.estado === 'desarrollo').length}</span>
          <span className="dash-stat-label">Activos</span>
        </div>
      </div>

      <div className="dash-layout">
        {/* Main feed */}
        <div className="dash-feed">
          <h2 className="dash-section-title">Actividad reciente</h2>

          {feed.length > 0 ? (
            <div className="feed-list">
              {feed.map(item => (
                <div key={item.id} className={`feed-card ${feedColor[item.type]}`}>
                  <div className="feed-card-left">
                    <div className={`feed-avatar ${feedColor[item.type]}`}>
                      {item.authorInitial}
                    </div>
                    <div className="feed-line" />
                  </div>
                  <div className="feed-card-body">
                    <div className="feed-card-header">
                      <span className="feed-author">{item.author}</span>
                      <span className="feed-action">{feedLabel[item.type]}</span>
                      {item.project && (
                        <Link to={`/projects/${item.projectId}`} className="feed-project-link">{item.project}</Link>
                      )}
                      <span className="feed-time"><FiClock size={12} /> {timeAgo(item.date)}</span>
                    </div>

                    {/* Avance */}
                    {item.type === 'avance' && (
                      <div className="feed-content feed-avance-content">
                        <strong>{item.title}</strong>
                        {item.body && <p>{item.body.substring(0, 200)}{item.body.length > 200 ? '...' : ''}</p>}
                      </div>
                    )}

                    {/* Idea */}
                    {item.type === 'idea' && (
                      <div className="feed-content feed-idea-content">
                        <strong>{item.title}</strong>
                        {item.body && <p>{item.body.substring(0, 180)}{item.body.length > 180 ? '...' : ''}</p>}
                        <div className="feed-idea-footer">
                          <span className={`badge ${statusBadge(item.estado)}`}>{item.estado}</span>
                          <span className="feed-votes">
                            <FiThumbsUp size={13} /> {item.votos_favor}
                            <FiThumbsDown size={13} /> {item.votos_contra}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Comment */}
                    {item.type === 'comment' && (
                      <div className="feed-content feed-comment-content">
                        <p>"{item.body?.substring(0, 200)}{item.body?.length > 200 ? '...' : ''}"</p>
                      </div>
                    )}

                    {/* New member */}
                    {item.type === 'member' && (
                      <div className="feed-content feed-member-content">
                        <p>Se unió como <strong>{item.role || 'miembro'}</strong></p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="feed-empty">
              <FiMessageCircle size={40} />
              <p>No hay actividad reciente.</p>
              <span>Crea un proyecto o publica una idea para empezar.</span>
            </div>
          )}
        </div>

        {/* Sidebar: My projects */}
        <aside className="dash-sidebar">
          <div className="dash-sidebar-section">
            <div className="dash-sidebar-head">
              <h3>Mis Proyectos</h3>
              <Link to="/projects">Ver todos <FiChevronRight size={14} /></Link>
            </div>
            {myProjects.length > 0 ? (
              <div className="dash-project-list">
                {myProjects.map(p => (
                  <Link to={`/projects/${p.id}`} key={p.id} className="dash-project-card">
                    <div className="dash-project-info">
                      <span className="dash-project-name">{p.titulo}</span>
                      <span className="dash-project-role">{p.rol || 'Miembro'}</span>
                    </div>
                    <span className={`badge badge-sm ${statusBadge(p.estado)}`}>{p.estado}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dash-sidebar-empty">
                <p>Aún no participas en proyectos</p>
                <Link to="/projects" className="btn btn-sm btn-primary">Explorar</Link>
              </div>
            )}
          </div>

          <div className="dash-sidebar-section">
            <div className="dash-sidebar-head">
              <h3>Acceso rápido</h3>
            </div>
            <div className="dash-quick-links">
              <Link to="/ideas" className="dash-quick-link"><FiZap /> Nueva idea</Link>
              <Link to="/library" className="dash-quick-link"><FiFile /> Biblioteca</Link>
              <Link to="/members" className="dash-quick-link"><FiUsers /> Miembros</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
