'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <header className="border-b">
      <nav className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Portfolio
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/about"
            className={pathname === '/about' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
          >
            About
          </Link>
          <Link 
            href="/#projects"
            className={pathname === '/#projects' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
          >
            Projects
          </Link>
          <Link 
            href="/contact"
            className={pathname === '/contact' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
          >
            Contact
          </Link>
          {session ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
} 