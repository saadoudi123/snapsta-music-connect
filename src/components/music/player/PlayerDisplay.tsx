
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  videoId?: string;
}

interface PlayerDisplayProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: () => void;
  playPreviousSong: () => void;
  playNextSong: () => void;
  isShuffleOn: boolean;
  toggleShuffle: () => void;
  repeatMode: number;
  toggleRepeat: () => void;
  volume: number;
  handleVolumeChange: (value: number[]) => void;
  progress: number;
  duration: number;
  currentTime: number;
  handleProgressChange: (value: number[]) => void;
  formatTime: (seconds: number) => string;
  trendingSongs: Song[];
  playSong: (song: Song) => void;
}

const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  currentSong,
  isPlaying,
  togglePlay,
  playPreviousSong,
  playNextSong,
  isShuffleOn,
  toggleShuffle,
  repeatMode,
  toggleRepeat,
  volume,
  handleVolumeChange,
  progress,
  duration,
  currentTime,
  handleProgressChange,
  formatTime,
  trendingSongs,
  playSong
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 border rounded-lg bg-accent/10">
      {currentSong ? (
        <>
          <img 
            src={currentSong.thumbnail} 
            alt={currentSong.title} 
            className="w-48 h-48 rounded-lg shadow-lg mb-6 object-cover"
          />
          
          <h2 className="text-xl font-bold mb-1">{currentSong.title}</h2>
          <p className="text-muted-foreground mb-6">{currentSong.artist}</p>
          
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            formatTime={formatTime}
            handleProgressChange={handleProgressChange}
          />
          
          <PlayerControls
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            playPreviousSong={playPreviousSong}
            playNextSong={playNextSong}
            isShuffleOn={isShuffleOn}
            toggleShuffle={toggleShuffle}
            repeatMode={repeatMode}
            toggleRepeat={toggleRepeat}
          />
          
          <VolumeControl
            volume={volume}
            handleVolumeChange={handleVolumeChange}
          />
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">{t('music.selectSongToPlay')}</h2>
          <p className="text-muted-foreground mb-6">{t('music.browseAndSelect')}</p>
          <Button onClick={() => playSong(trendingSongs[0])}>
            <Play className="h-4 w-4 mr-2" />
            {t('music.playRandom')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayerDisplay;
