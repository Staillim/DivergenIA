import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers, FiFolder, FiBookOpen, FiCpu, FiZap, FiBarChart2, FiMessageSquare, FiEye, FiActivity, FiTrendingUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { FaRobot, FaDna } from 'react-icons/fa'
import '../styles/home.css'

function Home() {
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
              <span className="stat-number">12+</span>
              <span className="stat-label">Proyectos</span>
            </div>
            <div className="stat">
              <span className="stat-number">25+</span>
              <span className="stat-label">Miembros</span>
            </div>
            <div className="stat">
              <span className="stat-number">8+</span>
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
        <div className="team-grid">
          <div className="team-member-card card">
            <div className="team-avatar-large">JD</div>
            <h3>Juan Díaz</h3>
            <span className="team-role">Coordinador del Semillero</span>
            <p className="team-bio">Ingeniero en Sistemas con maestría en IA. Lidera la dirección estratégica del semillero.</p>
            <div className="team-social">
              <a href="mailto:juan.diaz@example.com" className="team-social-link" title="Email"><FiMail /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="LinkedIn"><FiLinkedin /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="GitHub"><FiGithub /></a>
            </div>
          </div>

          <div className="team-member-card card">
            <div className="team-avatar-large">MR</div>
            <h3>María Rodríguez</h3>
            <span className="team-role">Investigadora Senior</span>
            <p className="team-bio">Especialista en Machine Learning y procesamiento de datos. Lidera proyectos de investigación.</p>
            <div className="team-social">
              <a href="mailto:maria.rodriguez@example.com" className="team-social-link" title="Email"><FiMail /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div className="team-member-card card">
            <div className="team-avatar-large">CP</div>
            <h3>Carlos Pérez</h3>
            <span className="team-role">Desarrollador Principal</span>
            <p className="team-bio">Desarrollador full-stack enfocado en aplicaciones de IA. Mantiene la infraestructura técnica.</p>
            <div className="team-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="GitHub"><FiGithub /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div className="team-member-card card">
            <div className="team-avatar-large">AS</div>
            <h3>Ana Santos</h3>
            <span className="team-role">Investigadora en NLP</span>
            <p className="team-bio">Lingüista computacional especializada en procesamiento de lenguaje natural y modelos de lenguaje.</p>
            <div className="team-social">
              <a href="mailto:ana.santos@example.com" className="team-social-link" title="Email"><FiMail /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div className="team-member-card card">
            <div className="team-avatar-large">LM</div>
            <h3>Luis Martínez</h3>
            <span className="team-role">Investigador en Computer Vision</span>
            <p className="team-bio">Especialista en visión por computadora y redes neuronales convolucionales.</p>
            <div className="team-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="GitHub"><FiGithub /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div className="team-member-card card">
            <div className="team-avatar-large">SG</div>
            <h3>Sofía Gómez</h3>
            <span className="team-role">Data Scientist</span>
            <p className="team-bio">Científica de datos enfocada en análisis predictivo y visualización de información.</p>
            <div className="team-social">
              <a href="mailto:sofia.gomez@example.com" className="team-social-link" title="Email"><FiMail /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="team-social-link" title="GitHub"><FiGithub /></a>
            </div>
          </div>
        </div>
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
