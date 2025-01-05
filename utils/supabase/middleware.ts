import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export const createClient = (request: NextRequest) => {
  const res = NextResponse.next()
  
  const supabase = createMiddlewareClient(
    { req: request, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  )

  return { supabase, response: res }
} 