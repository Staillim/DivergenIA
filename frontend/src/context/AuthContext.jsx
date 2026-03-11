import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isSigningUp = useRef(false)
  const fetchingProfile = useRef(false)

  const fetchProfile = useCallback(async (userId) => {
    // Evitar llamadas simultáneas
    if (fetchingProfile.current) return
    fetchingProfile.current = true

    try {
      setError(null)

      const { data, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (queryError) {
        console.warn('fetchProfile error:', queryError.code, queryError.message)

        if (queryError.code === 'PGRST116') {
          // Perfil no encontrado - reintentar una vez (race condition con signUp)
          await new Promise(resolve => setTimeout(resolve, 2000))
          const { data: retryData, error: retryError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single()

          if (!retryError && retryData) {
            setProfile(retryData)
            return
          }
          setProfile(null)
          setError('No se encontró tu perfil de usuario.')
        } else {
          // Cualquier otro error (401, 403, red, etc.) - NO cerrar sesión
          setProfile(null)
          setError('Error al cargar el perfil: ' + queryError.message)
        }
      } else if (data) {
        setProfile(data)
        setError(null)
      }
    } catch (err) {
      console.error('fetchProfile exception:', err)
      setProfile(null)
      setError('Error inesperado al cargar el perfil.')
    } finally {
      fetchingProfile.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // Safety timeout: nunca quedarse en loading más de 8 segundos
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false)
      }
    }, 8000)

    // Usar SOLO onAuthStateChange - más confiable que getSession + listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        console.log('Auth event:', event, session?.user?.id ? 'user:' + session.user.id : 'no-user')

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (!currentUser) {
          // Sin usuario: limpiar todo
          setProfile(null)
          setError(null)
          setLoading(false)
          return
        }

        // Tenemos usuario - decidir si cargar perfil
        if (isSigningUp.current) {
          // Durante signup no cargar perfil (se establece directamente)
          return
        }

        // Para INITIAL_SESSION, SIGNED_IN, y TOKEN_REFRESHED: cargar perfil
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchProfile(currentUser.id)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  async function signUp(email, password, userData) {
    isSigningUp.current = true

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const profileData = {
          id: data.user.id,
          nombre: userData.nombre,
          correo: email,
          carrera: userData.carrera,
          semestre: userData.semestre,
          rol: 'miembro'
        }

        const { error: profileError } = await supabase
          .from('usuarios')
          .insert(profileData)

        if (profileError) throw profileError

        // Establecer perfil directamente
        setUser(data.user)
        setProfile(profileData)
        setError(null)
        setLoading(false)
      }

      return data
    } finally {
      // Esperar un momento antes de liberar el flag
      // para que onAuthStateChange no intente cargar perfil prematuramente
      setTimeout(() => { isSigningUp.current = false }, 2000)
    }
  }

  async function signIn(email, password) {
    setLoading(true)
    setError(null)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError
      // fetchProfile será llamado por onAuthStateChange(SIGNED_IN)
      return data
    } catch (err) {
      setLoading(false)
      throw err
    }
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
