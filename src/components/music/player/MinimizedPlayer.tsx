
import React from 'react';
import { Maximize2, Pause, Play, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MinimizedPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
  toggleMinimize: () => void;
  progress: number;
  currentSong: {
    title: string;
    artist: string;
  };
  playNextSong: () => void;
}

const MinimizedPlayer: React.FC<MinimizedPlayerProps> = ({
  isPlaying,
  togglePlay,
  toggleMinimize,
  progress,
  currentSong,
  playNextSong
}) => {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-background border-t py-2 px-4 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={toggleMinimize}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="truncate max-w-[150px]">
            <p className="text-sm font-medium">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={togglePlay}>
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={playNextSong}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-1 mt-1" />
    </div>
  );
};

export default MinimizedPlayer;
