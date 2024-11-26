'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface VlcPlayerProps {
  src: string;
  type: 'live' | 'movie' | 'series';
  poster?: string;
}

export function VlcPlayer({ src, type, poster }: VlcPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayInVlc = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // VLC protocol needs to be properly formatted for direct playback
      // Format: vlc://[full URL]
      const vlcUrl = `vlc://${encodeURIComponent(src)}`;
      
      console.log('Original URL:', src);
      console.log('VLC URL:', vlcUrl);
      
      window.location.href = vlcUrl;
      
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setError('Failed to open VLC player');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      {poster && (
        <img
          src={poster}
          alt="Video thumbnail"
          className="w-full h-full object-contain"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
        <Button
          onClick={handlePlayInVlc}
          disabled={isLoading}
          className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Opening VLC...
            </>
          ) : (
            'Play in VLC'
          )}
        </Button>
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
