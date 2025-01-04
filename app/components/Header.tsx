'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
  const { user, isLoading } = useAuth()

  const { user, isLoading } = useAuth()
              </Link>
            )
          )}
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
      </div>
    </header>
  )
        
        <nav>
          {!isLoading && (
            user ? (
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )