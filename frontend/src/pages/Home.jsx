import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers, FiFolder, FiBookOpen, FiCpu, FiZap, FiBarChart2, FiMessageSquare, FiEye, FiActivity, FiTrendingUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { FaRobot, FaDna } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import '../styles/home.css'

function Home() {
  const [stats, setStats] = useState({
    proyectos: 0,
    miembros: 0,
    investigaciones: 0
  })
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  async function loadHomeData() {
    try {
      // Obtener estadísticas en paralelo
      const [proyectosRes, miembrosRes, avancesRes, usuariosRes] = await Promise.all([
        supabase.from('proyectos').select('id', { count: 'exact', head: true }),
        supabase.from('usuarios').select('id', { count: 'exact', head: true }).eq('activo', true),
        supabase.from('avances').select('id', { count: 'exact', head: true }),
        supabase.from('usuarios').select('*').eq('activo', true).order('created_at', { ascending: true }).limit(6)
      ])

      setStats({
        proyectos: proyectosRes.count || 0,
        miembros: miembrosRes.count || 0,
        investigaciones: avancesRes.count || 0
      })

      setTeamMembers(usuariosRes.data || [])
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge"><FiZap /> Semillero de Investigación</div>
          <h1>
            Bienvenido a <span className="gradient-text glow-text">AthenIA</span>
          </h1>
          <p className="hero-description">
            Plataforma digital para gestión de investigación, colaboración
            y desarrollo de proyectos basados en inteligencia artificial.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Unirse al semillero <FiArrowRight />
            </Link>
            <Link to="/projects" className="btn btn-secondary btn-lg">
              Ver proyectos
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{loading ? '...' : `${stats.proyectos}+`}</span>
              <span className="stat-label">Proyectos</span>
            </div>
            <div className="stat">
              <span className="stat-number">{loading ? '...' : `${stats.miembros}+`}</span>
              <span className="stat-label">Miembros</span>
            </div>
            <div className="stat">
              <span className="stat-number">{loading ? '...' : `${stats.investigaciones}+`}</span>
              <span className="stat-label">Investigaciones</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features page">
        <h2 className="section-title">¿Qué hacemos?</h2>
        <p className="section-subtitle">
          AthenIA es un espacio donde convergen ideas, investigación e inteligencia artificial
        </p>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon"><FiFolder /></div>
            <h3>Gestión de Proyectos</h3>
            <p>Organiza y da seguimiento a tus proyectos de investigación con herramientas colaborativas.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><FiBookOpen /></div>
            <h3>Banco de Ideas</h3>
            <p>Propón nuevas ideas, vota y colabora para convertirlas en proyectos reales.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><FiUsers /></div>
            <h3>Equipos de Trabajo</h3>
            <p>Forma equipos interdisciplinarios con roles definidos para cada proyecto.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><FiCpu /></div>
            <h3>Asistente IA</h3>
            <p>Un asistente inteligente que te ayuda con sugerencias, datasets y metodologías.</p>
          </div>
        </div>
      </section>

      {/* Líneas de investigación */}
      <section className="research-lines page">
        <h2 className="section-title">Líneas de Investigación</h2>
        <div className="lines-grid">
          <div className="line-card">
            <span className="line-emoji"><FaRobot /></span>
            <h4>Machine Learning</h4>
          </div>
          <div className="line-card">
            <span className="line-emoji"><FiBarChart2 /></span>
            <h4>Ciencia de Datos</h4>
          </div>
          <div className="line-card">
            <span className="line-emoji"><FiMessageSquare /></span>
            <h4>Procesamiento de Lenguaje Natural</h4>
          </div>
          <div className="line-card">
            <span className="line-emoji"><FiEye /></span>
            <h4>Visión por Computadora</h4>
          </div>
          <div className="line-card">
            <span className="line-emoji"><FaDna /></span>
            <h4>IA en Salud</h4>
          </div>
          <div className="line-card">
            <span className="line-emoji"><FiTrendingUp /></span>
            <h4>IA en Finanzas</h4>
          </div>
        </div>
      </section>

      {/* Equipo del Semillero */}
      <section className="team-section page">
        <h2 className="section-title">Nuestro Equipo</h2>
        <p className="section-subtitle">
          Conoce a los integrantes que hacen posible DivergenIA
        </p>
        {loading ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>Cargando equipo...</p>
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member-card card">
                <div className="team-avatar-large">
                  {member.nombre?.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase() || 'U'}
                </div>
                <h3>{member.nombre || 'Miembro'}</h3>
                <span className="team-role">
                  {member.rol === 'administrador' ? 'Administrador del Semillero' : 
                   member.rol === 'miembro' ? 'Investigador' : member.rol}
                </span>
                {member.carrera && (
                  <p className="team-bio">
                    {member.carrera}{member.semestre ? ` - ${member.semestre}° Semestre` : ''}
                  </p>
                )}
                <div className="team-social">
                  {member.correo && (
                    <a href={`mailto:${member.correo}`} className="team-social-link" title="Email">
                      <FiMail />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No hay miembros registrados aún</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>¿Listo para innovar?</h2>
          <p>Únete al semillero DivergenIA y comienza a construir el futuro con inteligencia artificial.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Solicitar ingreso <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 DivergenIA - Semillero de Investigación</p>
          <p className="footer-subtitle">Construyendo el futuro con IA</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
