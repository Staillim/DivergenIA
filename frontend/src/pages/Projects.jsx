import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiPlus, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import '../styles/projects.css'

function Projects() {
  const { user, profile } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({
    titulo: '',
    descripcion: '',
    estado: 'idea'
  })

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      let query = supabase
        .from('proyectos')
        .select('*, usuarios(nombre)')
        .order('fecha_inicio', { ascending: false })

      // Si no hay user, solo mostrar públicos
      if (!user) {
        query = query.eq('publico', true)
      }

      const { data, error } = await query
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProject(e) {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .insert({
          titulo: newProject.titulo,
          descripcion: newProject.descripcion,
          estado: newProject.estado,
          creador_id: profile.id,
          publico: false
        })
        .select()
        .single()

      if (error) throw error

      // Agregar al creador como líder del proyecto
      await supabase.from('miembros_proyecto').insert({
        proyecto_id: data.id,
        usuario_id: profile.id,
        rol_equipo: 'lider'
      })

      toast.success('¡Proyecto creado exitosamente!')
      setShowModal(false)
      setNewProject({ titulo: '', descripcion: '', estado: 'idea' })
      loadProjects()
    } catch (error) {
      toast.error('Error al crear el proyecto')
    }
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || p.estado === filterStatus
    return matchSearch && matchStatus
  })

  const getStatusBadge = (estado) => {
    const map = {
      idea: 'badge-idea',
      desarrollo: 'badge-desarrollo',
      investigacion: 'badge-investigacion',
      pruebas: 'badge-pruebas',
      finalizado: 'badge-finalizado'
    }
    return map[estado] || 'badge-idea'
  }

  const statusLabels = {
    idea: '📝 Idea',
    desarrollo: '🔨 En desarrollo',
    investigacion: '🔬 Investigación',
    pruebas: '🧪 En pruebas',
    finalizado: '✅ Finalizado'
  }

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1>📊 Proyectos</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Nuevo Proyecto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-chips">
          {['todos', 'idea', 'desarrollo', 'investigacion', 'pruebas', 'finalizado'].map(status => (
            <button
              key={status}
              className={`chip ${filterStatus === status ? 'chip-active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'todos' ? 'Todos' : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de proyectos */}
      {filtered.length > 0 ? (
        <div className="grid-3">
          {filtered.map(project => (
            <Link to={user ? `/projects/${project.id}` : '#'} key={project.id} className="project-card card">
              <div className="project-card-header">
                <span className={`badge ${getStatusBadge(project.estado)}`}>
                  {statusLabels[project.estado] || project.estado}
                </span>
              </div>
              <h3>{project.titulo}</h3>
              <p>{project.descripcion?.substring(0, 120)}{project.descripcion?.length > 120 ? '...' : ''}</p>
              <div className="project-card-footer">
                <span>👤 {project.usuarios?.nombre || 'Anónimo'}</span>
                <span>{new Date(project.fecha_inicio).toLocaleDateString('es-CO')}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>No se encontraron proyectos</p>
        </div>
      )}

      {/* Modal crear proyecto */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo Proyecto</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Título del proyecto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Sistema de recomendación con IA"
                  value={newProject.titulo}
                  onChange={e => setNewProject({ ...newProject, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-input"
                  placeholder="Describe el proyecto, objetivos y alcance..."
                  value={newProject.descripcion}
                  onChange={e => setNewProject({ ...newProject, descripcion: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado inicial</label>
                <select
                  className="form-input"
                  value={newProject.estado}
                  onChange={e => setNewProject({ ...newProject, estado: e.target.value })}
                >
                  <option value="idea">📝 Idea</option>
                  <option value="desarrollo">🔨 En desarrollo</option>
                  <option value="investigacion">🔬 Investigación</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
