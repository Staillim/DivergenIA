import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiPlus, FiThumbsUp, FiThumbsDown, FiMessageCircle } from 'react-icons/fi'
import { FaLightbulb } from 'react-icons/fa'
import toast from 'react-hot-toast'
import '../styles/ideas.css'

function Ideas() {
  const { profile } = useAuth()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newIdea, setNewIdea] = useState({ titulo: '', descripcion: '' })
  const [filter, setFilter] = useState('todas')

  useEffect(() => {
    loadIdeas()
  }, [])

  async function loadIdeas() {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*, usuarios(nombre)')
        .order('fecha_publicacion', { ascending: false })

      if (error) throw error
      setIdeas(data || [])
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitIdea(e) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('ideas').insert({
        titulo: newIdea.titulo,
        descripcion: newIdea.descripcion,
        autor_id: profile.id,
        estado: 'votacion'
      })
      if (error) throw error
      toast.success('¡Idea publicada!')
      setShowModal(false)
      setNewIdea({ titulo: '', descripcion: '' })
      loadIdeas()
    } catch (error) {
      toast.error('Error al publicar idea')
    }
  }

  async function handleVote(ideaId, type) {
    try {
      const field = type === 'up' ? 'votos_favor' : 'votos_contra'
      const idea = ideas.find(i => i.id === ideaId)
      const newCount = (idea[field] || 0) + 1

      const { error } = await supabase
        .from('ideas')
        .update({ [field]: newCount })
        .eq('id', ideaId)

      if (error) throw error
      loadIdeas()
    } catch (error) {
      toast.error('Error al votar')
    }
  }

  const filtered = ideas.filter(idea => {
    if (filter === 'todas') return true
    return idea.estado === filter
  })

  const statusColors = {
    votacion: 'badge-votacion',
    aprobada: 'badge-aprobada',
    rechazada: 'badge-rechazada'
  }

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1><FaLightbulb className="page-icon" /> Banco de Ideas</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Nueva Idea
        </button>
      </div>

      {/* Filtros */}
      <div className="filter-chips" style={{ marginBottom: '24px' }}>
        {['todas', 'votacion', 'aprobada', 'rechazada'].map(f => (
          <button
            key={f}
            className={`chip ${filter === f ? 'chip-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'todas' ? 'Todas' :
             f === 'votacion' ? 'En votación' :
             f === 'aprobada' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>

      {/* Ideas */}
      {filtered.length > 0 ? (
        <div className="ideas-grid">
          {filtered.map(idea => (
            <div key={idea.id} className="idea-card card">
              <div className="idea-card-header">
                <span className={`badge ${statusColors[idea.estado] || 'badge-votacion'}`}>
                  {idea.estado}
                </span>
              </div>
              <h3>{idea.titulo}</h3>
              <p>{idea.descripcion}</p>
              <div className="idea-card-author">
                <span><FaLightbulb /> {idea.usuarios?.nombre}</span>
                <span>{new Date(idea.fecha_publicacion).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="idea-votes">
                <button className="vote-btn vote-up" onClick={() => handleVote(idea.id, 'up')}>
                  <FiThumbsUp /> {idea.votos_favor || 0}
                </button>
                <button className="vote-btn vote-down" onClick={() => handleVote(idea.id, 'down')}>
                  <FiThumbsDown /> {idea.votos_contra || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaLightbulb size={48} className="empty-icon" />
          <p>No hay ideas publicadas con este filtro</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Proponer una Idea</h2>
            <form onSubmit={handleSubmitIdea}>
              <div className="form-group">
                <label>Título de la idea</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: IA para detectar plagio en trabajos académicos"
                  value={newIdea.titulo}
                  onChange={e => setNewIdea({ ...newIdea, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-input"
                  placeholder="Describe tu idea en detalle: problema, solución propuesta, tecnologías..."
                  value={newIdea.descripcion}
                  onChange={e => setNewIdea({ ...newIdea, descripcion: e.target.value })}
                  required
                  rows={5}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Publicar Idea</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ideas
