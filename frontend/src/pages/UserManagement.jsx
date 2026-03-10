import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import RoleBadge from '../components/RoleBadge'
import { FiSearch, FiEdit2, FiCheck, FiX, FiUserPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import '../styles/user-management.css'

function UserManagement() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)
  const [editingRole, setEditingRole] = useState('')

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('fecha_registro', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ rol: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => u.id === userId ? { ...u, rol: newRole } : u))
      setEditingUserId(null)
      toast.success('Rol actualizado exitosamente')
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Error al actualizar rol')
    }
  }

  async function toggleUserStatus(userId, currentStatus) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ activo: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => u.id === userId ? { ...u, activo: !currentStatus } : u))
      toast.success(currentStatus ? 'Usuario desactivado' : 'Usuario activado')
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Error al cambiar estado')
    }
  }

  const filteredUsers = users.filter(user =>
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.carrera?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: users.length,
    administradores: users.filter(u => u.rol === 'administrador').length,
    miembros: users.filter(u => u.rol === 'miembro').length,
    visitantes: users.filter(u => u.rol === 'visitante').length,
    activos: users.filter(u => u.activo).length
  }

  if (!isAdmin) {
    return (
      <div className="page">
        <div className="card">
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="user-management page">
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="page-subtitle">Administra roles y permisos de los miembros</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card gradient-card-1">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Usuarios</span>
        </div>
        <div className="stat-card gradient-card-2">
          <span className="stat-value">{stats.administradores}</span>
          <span className="stat-label">Administradores</span>
        </div>
        <div className="stat-card gradient-card-3">
          <span className="stat-value">{stats.miembros}</span>
          <span className="stat-label">Miembros</span>
        </div>
        <div className="stat-card gradient-card-1">
          <span className="stat-value">{stats.visitantes}</span>
          <span className="stat-label">Visitantes</span>
        </div>
        <div className="stat-card gradient-card-2">
          <span className="stat-value">{stats.activos}</span>
          <span className="stat-label">Activos</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Buscar por nombre, correo o carrera..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Carrera</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={!user.activo ? 'inactive-user' : ''}>
                  <td>
                    <div className="user-cell">
                      {user.foto_url ? (
                        <img src={user.foto_url} alt={user.nombre} className="user-avatar" />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {user.nombre?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{user.nombre}</span>
                    </div>
                  </td>
                  <td>{user.correo}</td>
                  <td>{user.carrera || '-'}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <div className="role-edit">
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                          className="role-select"
                        >
                          <option value="visitante">Visitante</option>
                          <option value="miembro">Miembro</option>
                          <option value="administrador">Administrador</option>
                        </select>
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleRoleChange(user.id, editingRole)}
                          title="Guardar"
                        >
                          <FiCheck />
                        </button>
                        <button
                          className="btn-icon btn-error"
                          onClick={() => setEditingUserId(null)}
                          title="Cancelar"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div className="role-display">
                        <RoleBadge role={user.rol} size="sm" />
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(user.fecha_registro).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-primary"
                        onClick={() => {
                          setEditingUserId(user.id)
                          setEditingRole(user.rol)
                        }}
                        title="Editar rol"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={`btn-icon ${user.activo ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => toggleUserStatus(user.id, user.activo)}
                        title={user.activo ? 'Desactivar' : 'Activar'}
                      >
                        {user.activo ? <FiX /> : <FiCheck />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
