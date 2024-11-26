'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

interface VideoJSPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onReady?: (player: Player) => void;
}

export function VideoJSPlayer({ src, poster, autoPlay = false, onReady }: VideoJSPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  const getSourceType = (url: string) => {
    console.log("getSourceType: "+url);
    if (!url || typeof url !== 'string') return 'video/mp4';
    return url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4';
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = document.createElement('video-js');
    videoElement.classList.add('vjs-big-play-centered');
    videoRef.current.appendChild(videoElement);

    const player = playerRef.current = videojs(videoElement, {
      controls: true,
      fluid: true,
      sources: [{
        src: src,
        type: getSourceType(src)
      }],
      poster: poster,
      autoplay: autoPlay,
      playbackRates: [0.5, 1, 1.5, 2],
      responsive: true,
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
        }
      }
    });

    // Pass the player to the onReady prop if provided
    if (onReady) {
      onReady(player);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoPlay, onReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.src({
        src: src,
        type: getSourceType(src)
      });
    }
  }, [src]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
