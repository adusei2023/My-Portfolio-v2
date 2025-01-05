export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  // Validate Supabase URL format
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!)
    if (!url.hostname.includes('supabase.co')) {
      throw new Error('Invalid Supabase URL domain')
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${error.message}`)
    }
    throw error
  }

  // Validate Anon Key format
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ')) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format')
  }
} 