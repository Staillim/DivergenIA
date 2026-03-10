import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiCpu } from 'react-icons/fi'
import toast from 'react-hot-toast'
import '../styles/auth.css'

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    carrera: '',
    semestre: ''
  })
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, {
        nombre: formData.nombre,
        carrera: formData.carrera,
        semestre: parseInt(formData.semestre) || null
      })
      toast.success('¡Registro exitoso! Revisa tu correo para confirmar.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon"><FiCpu size={48} /></span>
          <h1>Registrarse</h1>
          <p>Únete al semillero DivergenIA</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="form-input"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carrera">Carrera</label>
              <input
                id="carrera"
                name="carrera"
                type="text"
                className="form-input"
                placeholder="Ej: Ingeniería de Sistemas"
                value={formData.carrera}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="semestre">Semestre</label>
              <select
                id="semestre"
                name="semestre"
                className="form-input"
                value={formData.semestre}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}° Semestre</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register
