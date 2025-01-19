const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

type EnvVar = (typeof requiredEnvVars)[number]

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<EnvVar, string> {}
  }
}

export function validateEnv() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  // Validate URL format
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  } catch (error) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format')
  }

  // Validate Anon Key format
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ')) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format')
  }

  // Validate Service Role Key format
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ')) {
    throw new Error('Invalid SUPABASE_SERVICE_ROLE_KEY format')
  }
}

export function getEnvVar(key: EnvVar): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
} 