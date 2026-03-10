import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('tu-proyecto') || supabaseAnonKey.includes('tu-anon')) {
  console.error('ERROR: Variables de entorno de Supabase no configuradas')
  console.error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Netlify')
  console.error('Site settings → Environment variables')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
