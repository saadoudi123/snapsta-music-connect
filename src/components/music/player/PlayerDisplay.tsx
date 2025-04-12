
import React from 'react';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import NowPlayingInfo from './display/NowPlayingInfo';
import EmptyPlayerState from './display/EmptyPlayerState';
import { Song } from './types';

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
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 border rounded-lg bg-accent/10">
      {currentSong ? (
        <>
          <NowPlayingInfo currentSong={currentSong} />
          
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
        <EmptyPlayerState 
          playSong={playSong} 
          trendingSongs={trendingSongs} 
        />
      )}
    </div>
  );
};

export default PlayerDisplay;
