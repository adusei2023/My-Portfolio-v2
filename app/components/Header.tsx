'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth'; // Ensure `useAuth` is properly imported

const Header = () => {
  const { user, isLoading } = useAuth();

  return (
    <header>
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <nav>
          {!isLoading && (
            user ? (
              <p>Welcome, {user.name}</p> // Replace with appropriate user display logic
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
};

export default Header;
            )
