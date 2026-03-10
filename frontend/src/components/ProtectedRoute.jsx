import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  // Si no hay usuario después de cargar, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
