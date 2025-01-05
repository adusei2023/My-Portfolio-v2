export const siteConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

if (!siteConfig.supabaseUrl || !siteConfig.supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
} 