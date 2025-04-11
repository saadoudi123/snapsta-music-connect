
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  playPreviousSong: () => void;
  playNextSong: () => void;
  isShuffleOn: boolean;
  toggleShuffle: () => void;
  repeatMode: number;
  toggleRepeat: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  togglePlay,
  playPreviousSong,
  playNextSong,
  isShuffleOn,
  toggleShuffle,
  repeatMode,
  toggleRepeat
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4 mb-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleShuffle}
        className={isShuffleOn ? 'text-primary' : ''}
      >
        <Shuffle className="h-5 w-5" />
      </Button>
      
      <Button variant="ghost" size="icon" onClick={playPreviousSong}>
        <SkipBack className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="default" 
        size="icon" 
        className="h-12 w-12 rounded-full"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
      
      <Button variant="ghost" size="icon" onClick={playNextSong}>
        <SkipForward className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleRepeat}
        className={repeatMode > 0 ? 'text-primary' : ''}
      >
        <Repeat className="h-5 w-5" />
        {repeatMode === 2 && <span className="absolute text-xs">1</span>}
      </Button>
    </div>
  );
};

export default PlayerControls;
