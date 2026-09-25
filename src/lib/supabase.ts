import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

/**
 * Wraps a mutation function with a proactive session refresh check.
 * This prevents 401 errors when submitting scores after a long checkpoint.
 */
export async function withSessionRefresh<T>(mutationFn: () => Promise<T>): Promise<T | null> {
  try {
    // Proactively refresh/get session before executing the mutation
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('[Supabase Auth] Session fetch error before mutation:', sessionError.message);
    }
    
    if (!session) {
      console.warn('[Supabase Auth] No active session before mutation. The request might fail if RLS requires auth.');
    }

    return await mutationFn();
  } catch (err: any) {
    console.error('[Supabase Mutation] Network or Authorization Error:', err.message || err);
    return null; // Fail gracefully without crashing the app
  }
}
