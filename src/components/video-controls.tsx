import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Button } from './ui/button';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  qualities?: { height: number; url: string }[];
  currentQuality?: number;
  isFullscreen: boolean;
  isBuffering: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onQualityChange?: (index: number) => void;
  onToggleFullscreen: () => void;
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  qualities,
  currentQuality,
  isFullscreen,
  isBuffering,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onQualityChange,
  onToggleFullscreen,
}: VideoControlsProps) {
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Progress bar */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
            >
              {volume === 0 ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {qualities && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setShowQualityMenu(!showQualityMenu)}
              >
                <Settings className="h-6 w-6" />
              </Button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px]">
                  {qualities.map((quality, index) => (
                    <button
                      key={quality.height}
                      onClick={() => {
                        onQualityChange?.(index);
                        setShowQualityMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm rounded hover:bg-white/20 ${
                        currentQuality === index ? 'text-blue-400' : 'text-white'
                      }`}
                    >
                      {quality.height}p
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onQualityChange?.(-1);
                      setShowQualityMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded hover:bg-white/20 ${
                      currentQuality === -1 ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    Auto
                  </button>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}