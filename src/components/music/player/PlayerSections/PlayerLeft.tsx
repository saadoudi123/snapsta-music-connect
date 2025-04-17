
import React from 'react';
import SearchSection from '../sections/SearchSection';
import PlayerSection from '../sections/PlayerSection';
import { Song } from '../types';

interface PlayerLeftProps {
  player: {
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
  };
  download: {
    showDownloadDialog: boolean;
    setShowDownloadDialog: (show: boolean) => void;
    handleDownload: (song: Song | null, format: 'mp3' | 'mp4') => void;
  };
}

const PlayerLeft: React.FC<PlayerLeftProps> = ({ player, download }) => {
  return (
    <div className="lg:col-span-2 flex flex-col">
      <SearchSection
        searchQuery={''}
        setSearchQuery={() => {}}
        searchResults={[]}
        handleSearch={() => {}}
        playSong={player.playSong}
      />
      
      <PlayerSection
        player={{
          ...player,
          showDownloadDialog: download.setShowDownloadDialog
        }}
        trendingSongs={[]}
      />
    </div>
  );
};

export default PlayerLeft;
