import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = async () => {
  const cookieStore = await cookies()

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          const cookie = cookieStore.get(key)
          return cookie?.value ?? null
        },
        setItem: (key, value) => {
          cookieStore.set(key, value, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          })
        },
        removeItem: (key) => {
          cookieStore.delete(key)
        }
      }
    }
  })
}
