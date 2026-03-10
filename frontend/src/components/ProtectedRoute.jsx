import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, profile, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si hay error cargando el perfil, mostrar mensaje
  if (error && !profile) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Error al cargar perfil</h2>
          <p>{error}</p>
          <p>Por favor, intenta <a href="/login" onClick={() => window.location.href='/login'}>iniciar sesión nuevamente</a>.</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
