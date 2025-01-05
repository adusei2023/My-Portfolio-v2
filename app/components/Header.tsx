'use client';

import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="border-b">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Portfolio
        </Link>
        
        <nav>
          {!isLoading && (
            user ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
