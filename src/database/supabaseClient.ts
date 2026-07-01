import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Safely initialize client to prevent fatal crashes if env variables are missing in production hosting (e.g. Vercel)
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithOtp: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase credentials are not configured on Vercel yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project environment settings.' } 
        }),
        verifyOtp: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase credentials are not configured on Vercel yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project environment settings.' } 
        }),
        signInWithPassword: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase credentials are not configured on Vercel yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project environment settings.' } 
        }),
      }
    } as any;
