import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiPlus, FiUsers, FiFile, FiCalendar, FiArrowLeft, FiTrendingUp, FiFolder } from 'react-icons/fi'
import toast from 'react-hot-toast'
import '../styles/project-detail.css'

function ProjectDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [advances, setAdvances] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('avances')
  const [showAdvanceModal, setShowAdvanceModal] = useState(false)
  const [newAdvance, setNewAdvance] = useState({ titulo: '', descripcion: '' })

  useEffect(() => {
    loadProject()
  }, [id])

  async function loadProject() {
    try {
      // Proyecto
      const { data: proj } = await supabase
        .from('proyectos')
        .select('*, usuarios(nombre)')
        .eq('id', id)
        .single()
      setProject(proj)

      // Miembros
      const { data: memb } = await supabase
        .from('miembros_proyecto')
        .select('*, usuarios(nombre, carrera, semestre)')
        .eq('proyecto_id', id)
        .eq('activo', true)
      setMembers(memb || [])

      // Avances
      const { data: advs } = await supabase
        .from('avances')
        .select('*, usuarios(nombre)')
        .eq('proyecto_id', id)
        .order('fecha', { ascending: false })
      setAdvances(advs || [])

      // Archivos
      const { data: fls } = await supabase
        .from('archivos')
        .select('*, usuarios(nombre)')
        .eq('proyecto_id', id)
        .order('fecha_subida', { ascending: false })
      setFiles(fls || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddAdvance(e) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('avances').insert({
        proyecto_id: id,
        titulo: newAdvance.titulo,
        descripcion: newAdvance.descripcion,
        autor_id: profile.id
      })
      if (error) throw error
      toast.success('Avance registrado')
      setShowAdvanceModal(false)
      setNewAdvance({ titulo: '', descripcion: '' })
      loadProject()
    } catch (error) {
      toast.error('Error al registrar avance')
    }
  }

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

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  if (!project) {
    return <div className="page"><div className="empty-state"><p>Proyecto no encontrado</p></div></div>
  }

  const isMember = members.some(m => m.usuario_id === profile?.id)

  return (
    <div className="page project-detail">
      <Link to="/projects" className="back-link"><FiArrowLeft /> Volver a proyectos</Link>

      {/* Header */}
      <div className="project-detail-header">
        <div>
          <h1>{project.titulo}</h1>
          <div className="project-meta">
            <span className={`badge ${getStatusBadge(project.estado)}`}>{project.estado}</span>
            <span><FiCalendar /> {new Date(project.fecha_inicio).toLocaleDateString('es-CO')}</span>
            <span><FiUsers /> {members.length} miembros</span>
            <span><FiFile /> {files.length} archivos</span>
          </div>
        </div>
      </div>

      <p className="project-description">{project.descripcion}</p>

      {/* Tabs */}
      <div className="tabs">
        {['avances', 'equipo', 'archivos'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'avances' && <><FiTrendingUp /> Avances</>}
            {tab === 'equipo' && <><FiUsers /> Equipo</>}
            {tab === 'archivos' && <><FiFolder /> Archivos</>}
          </button>
        ))}
      </div>

      {/* Tab: Avances */}
      {activeTab === 'avances' && (
        <div className="tab-content">
          {isMember && (
            <button className="btn btn-primary" onClick={() => setShowAdvanceModal(true)} style={{ marginBottom: '20px' }}>
              <FiPlus /> Registrar Avance
            </button>
          )}
          {advances.length > 0 ? (
            <div className="timeline">
              {advances.map(advance => (
                <div key={advance.id} className="timeline-item card">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>{advance.titulo}</h3>
                      <span className="timeline-date">
                        {new Date(advance.fecha).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <p>{advance.descripcion}</p>
                    <span className="timeline-author">Por: {advance.usuarios?.nombre}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>No hay avances registrados</p></div>
          )}
        </div>
      )}

      {/* Tab: Equipo */}
      {activeTab === 'equipo' && (
        <div className="tab-content">
          <div className="team-grid">
            {members.map(member => (
              <div key={member.id} className="team-card card">
                <div className="team-avatar">
                  {member.usuarios?.nombre?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <h4>{member.usuarios?.nombre}</h4>
                <span className="team-role">{member.rol_equipo || 'Miembro'}</span>
                <span className="team-info">{member.usuarios?.carrera}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Archivos */}
      {activeTab === 'archivos' && (
        <div className="tab-content">
          {files.length > 0 ? (
            <div className="files-list">
              {files.map(file => (
                <div key={file.id} className="file-item card">
                  <div className="file-icon"><FiFile /></div>
                  <div className="file-info">
                    <h4>{file.nombre}</h4>
                    <span>Subido por: {file.usuarios?.nombre} • {new Date(file.fecha_subida).toLocaleDateString('es-CO')}</span>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                    Descargar
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>No hay archivos subidos</p></div>
          )}
        </div>
      )}

      {/* Modal Avance */}
      {showAdvanceModal && (
        <div className="modal-overlay" onClick={() => setShowAdvanceModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Registrar Avance</h2>
            <form onSubmit={handleAddAdvance}>
              <div className="form-group">
                <label>Título del avance</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Se entrenó el modelo con nuevo dataset"
                  value={newAdvance.titulo}
                  onChange={e => setNewAdvance({ ...newAdvance, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-input"
                  placeholder="Describe lo que se hizo, resultados, métricas..."
                  value={newAdvance.descripcion}
                  onChange={e => setNewAdvance({ ...newAdvance, descripcion: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdvanceModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Avance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
