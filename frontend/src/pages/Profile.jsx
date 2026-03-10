import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiBook, FiHash, FiSave, FiEdit2 } from 'react-icons/fi'
import RoleBadge from '../components/RoleBadge'
import '../styles/profile.css'

function Profile() {
  const { profile, user, loading: authLoading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nombre: profile?.nombre || '',
    carrera: profile?.carrera || '',
    semestre: profile?.semestre || ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nombre: form.nombre,
          carrera: form.carrera,
          semestre: parseInt(form.semestre)
        })
        .eq('id', profile.id)

      if (error) throw error
      toast.success('Perfil actualizado correctamente')
      setEditing(false)
      // Reload to refresh profile
      window.location.reload()
    } catch (error) {
      toast.error('Error al actualizar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Si está cargando, mostrar spinner
  if (authLoading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Cargando perfil...</p></div>
  }

  // Si terminó de cargar pero no hay perfil, mostrar error
  if (!profile) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>No se pudo cargar el perfil. Por favor, intenta iniciar sesión nuevamente.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profile.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-header-info">
            <h1>{profile.nombre}</h1>
            <p className="profile-email">{profile.correo}</p>
            <RoleBadge role={profile.rol} size="md" />
          </div>
          {!editing && (
            <button className="btn btn-secondary btn-sm profile-edit-btn" onClick={() => setEditing(true)}>
              <FiEdit2 /> Editar
            </button>
          )}
        </div>

        {/* Info / Edit Form */}
        {editing ? (
          <form onSubmit={handleSave} className="profile-form">
            <div className="profile-card">
              <h2>Editar información</h2>
              <div className="form-group">
                <label htmlFor="nombre"><FiUser size={14} /> Nombre completo</label>
                <input id="nombre" name="nombre" className="form-input" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="profile-form-row">
                <div className="form-group">
                  <label htmlFor="carrera"><FiBook size={14} /> Carrera</label>
                  <input id="carrera" name="carrera" className="form-input" value={form.carrera} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="semestre"><FiHash size={14} /> Semestre</label>
                  <input id="semestre" name="semestre" type="number" min="1" max="12" className="form-input" value={form.semestre} onChange={handleChange} required />
                </div>
              </div>
              <div className="profile-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FiSave /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-card">
              <h2>Información personal</h2>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <FiUser className="profile-info-icon" />
                  <div>
                    <span className="profile-info-label">Nombre</span>
                    <span className="profile-info-value">{profile.nombre}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <FiMail className="profile-info-icon" />
                  <div>
                    <span className="profile-info-label">Correo</span>
                    <span className="profile-info-value">{profile.correo}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <FiBook className="profile-info-icon" />
                  <div>
                    <span className="profile-info-label">Carrera</span>
                    <span className="profile-info-value">{profile.carrera || 'No especificada'}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <FiHash className="profile-info-icon" />
                  <div>
                    <span className="profile-info-label">Semestre</span>
                    <span className="profile-info-value">{profile.semestre ? `${profile.semestre}°` : 'No especificado'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h2>Cuenta</h2>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <FiMail className="profile-info-icon" />
                  <div>
                    <span className="profile-info-label">Email de acceso</span>
                    <span className="profile-info-value">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
