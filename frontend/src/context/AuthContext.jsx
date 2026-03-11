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
  const isFetchingProfile = useRef(false) // Protección contra llamadas concurrentes

  async function fetchProfile(userId) {
    // Evitar llamadas concurrentes
    if (isFetchingProfile.current) {
      console.log('[AuthContext] fetchProfile: already in progress, skipping...')
      return
    }

    isFetchingProfile.current = true
    console.log('[AuthContext] fetchProfile: starting for userId:', userId)

    try {
      setError(null)

      // Diagnóstico: verificar qué usuario está autenticado en Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('[AuthContext] → Current auth.uid:', sessionData?.session?.user?.id)
      console.log('[AuthContext] → Requested userId:', userId)
      console.log('[AuthContext] → Match:', sessionData?.session?.user?.id === userId)

      console.log('[AuthContext] → Querying Supabase usuarios table...')
      
      // Crear un timeout de 3 segundos para la query
      const queryPromise = supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('[AuthContext] → Query created, starting race with timeout...')

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 3s')), 3000)
      )

      const result = await Promise.race([queryPromise, timeoutPromise])
        .catch(err => {
          console.error('[AuthContext] → Query FAILED or TIMED OUT:', err.message)
          return { data: null, error: err }
        })
      
      console.log('[AuthContext] → Race completed, result:', result)
      const { data, error: queryError } = result

      console.log('[AuthContext] → Query completed. data:', !!data, 'error:', queryError?.code || queryError?.message || 'none')

      if (queryError) {
        console.warn('[AuthContext] fetchProfile error:', queryError.code, queryError.message)

        if (queryError.code === 'PGRST116') {
          // Perfil no encontrado - puede ser usuario nuevo, esperar y reintentar
          console.log('[AuthContext] Profile not found (PGRST116), retrying in 1s...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          console.log('[AuthContext] → Retry: Querying Supabase usuarios table...')
          const { data: retryData, error: retryError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single()

          console.log('[AuthContext] → Retry completed. data:', !!retryData, 'error:', retryError?.code || 'none')

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
          setError('Error al cargar el perfil: ' + (queryError.message || 'Error desconocido'))
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
      isFetchingProfile.current = false // Liberar el lock
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
