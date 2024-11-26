import Link from 'next/link';
import { Button } from './ui/button';
import { Tv, Film, Video } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            IPTV Player
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
          </div>
        </div>
      </div>
    </nav>
  );
}