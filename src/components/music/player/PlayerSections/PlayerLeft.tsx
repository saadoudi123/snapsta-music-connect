
import React from 'react';
import SearchBar from '../SearchBar';
import PlayerDisplay from '../PlayerDisplay';
import YouTubeCore from '../YouTubeCore';
import ActionButtons from '../ActionButtons';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { usePlayerNavigation } from '../hooks/usePlayerNavigation';
import { allSongs, trendingSongs } from '../data/mockSongs';
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
  };
  download: {
    showDownloadDialog: boolean;
    setShowDownloadDialog: (show: boolean) => void;
    handleDownload: (song: Song | null, format: 'mp3' | 'mp4') => void;
  };
}

const PlayerLeft: React.FC<PlayerLeftProps> = ({ player, download }) => {
  const search = useYouTubeSearch(allSongs);
  const { playNextSong, playPreviousSong } = usePlayerNavigation(
    player.currentSong, 
    player.playSong, 
    player.isShuffleOn, 
    player.repeatMode
  );

  return (
    <div className="lg:col-span-2 flex flex-col">
      <SearchBar
        searchQuery={search.searchQuery}
        setSearchQuery={search.setSearchQuery}
        searchResults={search.searchResults}
        handleSearch={search.handleSearch}
        playSong={player.playSong}
      />
      
      <PlayerDisplay
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        togglePlay={player.togglePlay}
        playPreviousSong={playPreviousSong}
        playNextSong={playNextSong}
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
          setShowDownloadDialog={download.setShowDownloadDialog}
        />
      )}
    </div>
  );
};

export default PlayerLeft;
