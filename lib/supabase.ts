import { createClient } from '@supabase/supabase-js'
import { validateEnv } from './env'
import type { Database } from '@/types/supabase'

// Validate environment variables
validateEnv()

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    }
  }
) 