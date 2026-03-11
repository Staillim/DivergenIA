import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isSigningUp = useRef(false)

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

        if (error.code === 'PGRST116') {
          // Perfil no encontrado - puede ser race condition con signUp, reintentar
          await new Promise(resolve => setTimeout(resolve, 1500))
          const { data: retryData, error: retryError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single()

          if (!retryError && retryData) {
            setProfile(retryData)
            setError(null)
            return
          }
          setProfile(null)
          setError('No se encontró tu perfil. Intenta cerrar sesión y volver a ingresar.')
        } else {
          setProfile(null)
          setError('Error al cargar el perfil.')
        }
      } else if (data) {
        setProfile(data)
        setError(null)
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setProfile(null)
      setError('Error inesperado al cargar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    let initialDone = false

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted || initialDone) return
      initialDone = true

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser && !isSigningUp.current) {
        fetchProfile(currentUser.id)
      } else if (!currentUser) {
        setLoading(false)
      }
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (event === 'INITIAL_SESSION') {
          if (initialDone) return
          initialDone = true
          if (currentUser && !isSigningUp.current) {
            fetchProfile(currentUser.id)
          } else if (!currentUser) {
            setLoading(false)
          }
        } else if (event === 'SIGNED_IN') {
          if (!isSigningUp.current) {
            setLoading(true)
            await fetchProfile(currentUser.id)
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
          setError(null)
          setLoading(false)
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signUp(email, password, userData) {
    isSigningUp.current = true

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

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

        // Establecer perfil directamente para evitar race condition
        setProfile(profileData)
        setError(null)
        setLoading(false)
      }

      return data
    } finally {
      isSigningUp.current = false
    }
  }

  async function signIn(email, password) {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
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
