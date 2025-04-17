
import React from 'react';
import PlayerDisplay from '../PlayerDisplay';
import YouTubeCore from '../YouTubeCore';
import ActionButtons from '../ActionButtons';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: () => void;
  playSong: (song: Song) => void;
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
  isBackgroundPlay: boolean;
  toggleBackgroundPlay: () => void;
  onPlayerReady: () => void;
  onPlayerStateChange: (state: any) => void;
  onPlayerError: (error: number) => void;
  onProgressChange: (currentTime: number, duration: number) => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  showDownloadDialog: (show: boolean) => void;
}

interface PlayerSectionProps {
  player: PlayerProps;
  trendingSongs: Song[];
}

const PlayerSection: React.FC<PlayerSectionProps> = ({ player, trendingSongs }) => {
  return (
    <>
      <PlayerDisplay
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        togglePlay={player.togglePlay}
        playPreviousSong={player.playPreviousSong}
        playNextSong={player.playNextSong}
        isShuffleOn={player.isShuffleOn}
        toggleShuffle={player.toggleShuffle}
        repeatMode={player.repeatMode}
        toggleRepeat={player.toggleRepeat}
        volume={player.volume}
        handleVolumeChange={player.handleVolumeChange}
        progress={player.progress}
        duration={player.duration}
        currentTime={player.currentTime}
        handleProgressChange={player.handleProgressChange}
        formatTime={player.formatTime}
        trendingSongs={trendingSongs}
        playSong={player.playSong}
      />
      
      <YouTubeCore
        videoId={player.currentSong?.videoId || null}
        isPlaying={player.isPlaying}
        volume={player.volume}
        onReady={player.onPlayerReady}
        onStateChange={player.onPlayerStateChange}
        onError={player.onPlayerError}
        onProgressChange={player.onProgressChange}
      />
      
      {player.currentSong && (
        <ActionButtons
          currentSong={player.currentSong}
          isBackgroundPlay={player.isBackgroundPlay}
          toggleBackgroundPlay={player.toggleBackgroundPlay}
          setShowDownloadDialog={player.showDownloadDialog}
        />
      )}
    </>
  );
};

export default PlayerSection;
