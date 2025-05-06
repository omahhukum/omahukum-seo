import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? 'present' : 'missing'
  });
}

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'omah-hukum-auth',
    storage: isBrowser
      ? {
          getItem: (key) => {
            try {
              return localStorage.getItem(key);
            } catch (error) {
              console.error('Error getting item from localStorage:', error);
              return null;
            }
          },
          setItem: (key, value) => {
            try {
              localStorage.setItem(key, value);
            } catch (error) {
              console.error('Error setting item in localStorage:', error);
            }
          },
          removeItem: (key) => {
            try {
              localStorage.removeItem(key);
            } catch (error) {
              console.error('Error removing item from localStorage:', error);
            }
          }
        }
      : undefined
  }
});
