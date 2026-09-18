import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://zfkfoubsixeudricmafo.supabase.co'
export const supabasePublishableKey = 'sb_publishable_-l7mYTpyf5OHsyDEv1y9rQ_fbJ-Ff2K'

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
