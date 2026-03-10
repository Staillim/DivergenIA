import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setError(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        
        // Si el error es que no se encontró el usuario (404)
        if (error.code === 'PGRST116') {
          setError('No se encontró tu perfil en la base de datos.')
          setProfile(null)
          // NO cerrar sesión, dejar que el usuario vea el error
        } else {
          // Otros errores sí cierran sesión
          console.error('Critical error, logging out:', error)
          await supabase.auth.signOut()
          setUser(null)
          setProfile(null)
          setError('Error al cargar el perfil. Por favor, inicia sesión nuevamente.')
        }
      } else if (data) {
        setProfile(data)
      } else {
        console.error('No profile data returned')
        setProfile(null)
        setError('No se pudo obtener tu información de perfil.')
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      setProfile(null)
      setError('Error inesperado al cargar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          id: data.user.id,
          nombre: userData.nombre,
          correo: email,
          carrera: userData.carrera,
          semestre: userData.semestre,
          rol: 'miembro'
        })

      if (profileError) throw profileError
    }

    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
    setError(null)
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAdmin: profile?.rol === 'administrador',
    isMember: profile?.rol === 'miembro' || profile?.rol === 'administrador'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
