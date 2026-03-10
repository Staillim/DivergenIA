import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FiSearch } from 'react-icons/fi'
import '../styles/members.css'

function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .in('rol', ['miembro', 'administrador'])
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = members.filter(m =>
    m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    m.carrera?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1>👥 Miembros del Semillero</h1>
      </div>

      <div className="search-box" style={{ marginBottom: '24px' }}>
        <FiSearch />
        <input
          type="text"
          placeholder="Buscar por nombre o carrera..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
        />
      </div>

      <p className="members-count">{filtered.length} miembros activos</p>

      {filtered.length > 0 ? (
        <div className="members-grid">
          {filtered.map(member => (
            <div key={member.id} className="member-card card">
              <div className="member-avatar">
                {member.nombre?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <h3>{member.nombre}</h3>
              <span className="member-role">
                {member.rol === 'administrador' ? '👑 Administrador' : '👤 Miembro'}
              </span>
              <div className="member-details">
                {member.carrera && <span>🎓 {member.carrera}</span>}
                {member.semestre && <span>📅 {member.semestre}° Semestre</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No se encontraron miembros</p>
        </div>
      )}
    </div>
  )
}

export default Members
