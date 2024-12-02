'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Tv, Film, Video, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './logo';
import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/client-auth';

export function Navigation() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearSession();
    router.push('/login');
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <div className="flex space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <Tv className="w-4 h-4" />
                  <span>Live TV</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/movies" className="flex items-center space-x-2">
                  <Film className="w-4 h-4" />
                  <span>Movies</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/series" className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Series</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/profiles" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profiles</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}