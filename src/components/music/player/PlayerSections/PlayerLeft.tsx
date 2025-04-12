
import React from 'react';
import SearchBar from '../SearchBar';
import PlayerDisplay from '../PlayerDisplay';
import YouTubeCore from '../YouTubeCore';
import ActionButtons from '../ActionButtons';

import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { usePlayerNavigation } from '../hooks/usePlayerNavigation';
import { allSongs } from '../data/mockSongs';

interface PlayerLeftProps {
  player: ReturnType<typeof useYouTubePlayer>;
  download: ReturnType<typeof useYouTubeDownload>;
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
        onPlayerReady={player.onPlayerReady}
        onPlayerStateChange={player.onPlayerStateChange}
        onPlayerError={player.onPlayerError}
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
