import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFolder, FiZap, FiBookOpen, FiUsers, FiGrid, FiShield } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import RoleBadge from './RoleBadge'
import '../styles/navbar.css'

function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  const handleLogout = async () => {
    await signOut()
    setSidebarOpen(false)
    navigate('/')
  }

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close sidebar on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest('.menu-toggle')) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left: Hamburger + Logo */}
          <div className="navbar-left">
            {user && (
              <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menú">
                {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            )}
            <Link to={user ? '/dashboard' : '/'} className="navbar-logo">
              <img src="/athenia-logo.svg" alt="AthenIA" className="logo-svg" />
              <span className="logo-text">AthenIA</span>
            </Link>
          </div>

          {/* Right: Profile + Logout (logged in) or Auth buttons (logged out) */}
          <div className="navbar-right">
            {user ? (
              <>
                <Link to="/profile" className="navbar-profile-btn" title="Mi Perfil">
                  <div className="navbar-avatar">
                    {profile?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="navbar-profile-name">{profile?.nombre?.split(' ')[0] || 'Perfil'}</span>
                </Link>
                <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                <Link to="/register" className="btn-register">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      {user && (
        <>
          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} />
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
            <div className="sidebar-header">
              <div className="sidebar-user">
                <div className="sidebar-avatar">
                  {profile?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-name">{profile?.nombre || 'Miembro'}</span>
                  <span className="sidebar-user-detail">{profile?.carrera || ''}</span>
                </div>
              </div>
              {profile?.rol && <RoleBadge role={profile.rol} size="sm" />}
            </div>

            <nav className="sidebar-nav">
              <div className="sidebar-section-label">Principal</div>
              <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <FiGrid size={18} /> <span>Dashboard</span>
              </Link>
              <Link to="/projects" className={`sidebar-link ${isActive('/projects') ? 'active' : ''}`}>
                <FiFolder size={18} /> <span>Proyectos</span>
              </Link>
              <Link to="/ideas" className={`sidebar-link ${isActive('/ideas') ? 'active' : ''}`}>
                <FiZap size={18} /> <span>Ideas</span>
              </Link>

              <div className="sidebar-section-label">Recursos</div>
              <Link to="/library" className={`sidebar-link ${isActive('/library') ? 'active' : ''}`}>
                <FiBookOpen size={18} /> <span>Biblioteca</span>
              </Link>
              <Link to="/members" className={`sidebar-link ${isActive('/members') ? 'active' : ''}`}>
                <FiUsers size={18} /> <span>Miembros</span>
              </Link>

              {isAdmin && (
                <>
                  <div className="sidebar-section-label">Administración</div>
                  <Link to="/admin/users" className={`sidebar-link sidebar-admin ${isActive('/admin/users') ? 'active' : ''}`}>
                    <FiShield size={18} /> <span>Gestión Usuarios</span>
                  </Link>
                </>
              )}
            </nav>

            <div className="sidebar-footer">
              <Link to="/profile" className="sidebar-link">
                <FiUser size={18} /> <span>Mi Perfil</span>
              </Link>
              <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
                <FiLogOut size={18} /> <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

export default Navbar
