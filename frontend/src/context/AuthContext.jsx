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
  const hasFetchedInitialProfile = useRef(false)

  async function fetchProfile(userId) {
    console.log('[AuthContext] fetchProfile: starting for userId:', userId)

    try {
      setError(null)

      const { data, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (queryError) {
        console.warn('[AuthContext] fetchProfile error:', queryError.code, queryError.message)

        if (queryError.code === 'PGRST116') {
          // Perfil no encontrado - puede ser usuario nuevo, esperar y reintentar
          console.log('[AuthContext] Profile not found (PGRST116), retrying in 1s...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const { data: retryData, error: retryError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single()

          if (!retryError && retryData) {
            console.log('[AuthContext] ✓ Profile found on retry:', retryData.nombre)
            setProfile(retryData)
            setError(null)
            setLoading(false)
            return
          }
          console.warn('[AuthContext] ✗ Profile not found after retry')
          setProfile(null)
          setError('No se encontró tu perfil de usuario.')
        } else {
          console.error('[AuthContext] Critical error loading profile:', queryError)
          setProfile(null)
          setError('Error al cargar el perfil: ' + queryError.message)
        }
      } else if (data) {
        console.log('[AuthContext] ✓ Profile loaded successfully:', data.nombre)
        setProfile(data)
        setError(null)
      } else {
        console.warn('[AuthContext] ✗ No data and no error from query')
        setProfile(null)
      }
    } catch (err) {
      console.error('[AuthContext] fetchProfile exception:', err)
      setProfile(null)
      setError('Error inesperado al cargar el perfil.')
    } finally {
      setLoading(false)
      console.log('[AuthContext] fetchProfile: complete, loading=false')
    }
  }

  useEffect(() => {
    console.log('[AuthContext] ========== AuthProvider MOUNTING ==========')
    let isMounted = true
    
    // Safety timeout: nunca quedarse en loading más de 10 segundos
    const safetyTimer = setTimeout(() => {
      if (isMounted && loading) {
        console.error('[AuthContext] ⚠️ SAFETY TIMEOUT (10s) - forcing loading=false')
        setLoading(false)
      }
    }, 10000)

    // Listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        console.log('[AuthContext] ========================================')
        console.log('[AuthContext] Auth Event:', event)
        console.log('[AuthContext] Session:', session?.user?.id ? 'EXISTS (' + session.user.id + ')' : 'NULL')
        console.log('[AuthContext] isSigningUp:', isSigningUp.current)
        console.log('[AuthContext] ========================================')

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (!currentUser) {
          // Sin usuario: limpiar todo
          console.log('[AuthContext] → No user, clearing all state')
          setProfile(null)
          setError(null)
          setLoading(false)
          hasFetchedInitialProfile.current = false
          return
        }

        // Tenemos usuario
        console.log('[AuthContext] → User detected')

        // Durante signup, el perfil se establece manualmente
        if (isSigningUp.current) {
          console.log('[AuthContext] → isSigningUp=true, skipping fetchProfile')
          setLoading(false)
          return
        }

        // Para INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED: cargar perfil
        const shouldFetchProfile = 
          event === 'INITIAL_SESSION' || 
          event === 'SIGNED_IN' || 
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        
        if (shouldFetchProfile) {
          console.log('[AuthContext] → Event requires profile fetch')
          hasFetchedInitialProfile.current = true
          await fetchProfile(currentUser.id)
        } else {
          console.log('[AuthContext] → Event does not require profile fetch, setting loading=false')
          setLoading(false)
        }
      }
    )

    return () => {
      console.log('[AuthContext] ========== AuthProvider UNMOUNTING ==========')
      isMounted = false
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, []) // Sin dependencias para evitar recrear el listener

  // Recovery: si hay user pero no profile después de 2 segundos
  useEffect(() => {
    if (!user || profile || loading || isSigningUp.current) return

    const recoveryTimer = setTimeout(() => {
      if (user && !profile && !loading && !isSigningUp.current) {
        console.warn('[AuthContext] 🔄 RECOVERY: user exists but no profile after 2s, fetching...')
        fetchProfile(user.id)
      }
    }, 2000)

    return () => clearTimeout(recoveryTimer)
  }, [user, profile, loading])

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
