import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)
    const { data: { session } } = await supabase.auth.getSession()

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!session) {
        const redirectUrl = new URL('/auth/signin', request.url)
        redirectUrl.searchParams.set('from', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Auth routes when already logged in
    if (session && (
      request.nextUrl.pathname.startsWith('/auth/signin') ||
      request.nextUrl.pathname.startsWith('/auth/signup')
    )) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ]
}

