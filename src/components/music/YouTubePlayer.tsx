
import React from 'react';
import YouTubeCore from './player/YouTubeCore';
import SearchBar from './player/SearchBar';
import PlayerDisplay from './player/PlayerDisplay';
import ActionButtons from './player/ActionButtons';
import DownloadDialog from './player/DownloadDialog';
import TabsSection from './player/TabsSection';
import { useYouTubePlayer } from './player/hooks/useYouTubePlayer';
import { useYouTubeSearch } from './player/hooks/useYouTubeSearch';
import { useYouTubeDownload } from './player/hooks/useYouTubeDownload';
import { trendingSongs, recentlyPlayed, allSongs } from './player/data/mockSongs';

const YouTubePlayer: React.FC = () => {
  // Custom hooks
  const player = useYouTubePlayer();
  const search = useYouTubeSearch(allSongs);
  const download = useYouTubeDownload();
  
  // Play next song implementation (needs access to trending songs)
  const playNextSong = () => {
    // If there are songs in the queue, the base implementation will handle it
    if (player.queue.length > 0) {
      player.playNextSong();
      return;
    }
    
    if (!player.currentSong) {
      // No current song, start playing first trending
      if (trendingSongs.length > 0) {
        player.playSong(trendingSongs[0]);
      }
      return;
    }
    
    // Find current song in trending list and play next
    const currentIndex = trendingSongs.findIndex(song => song.id === player.currentSong?.id);
    if (currentIndex !== -1 && currentIndex < trendingSongs.length - 1) {
      player.playSong(trendingSongs[currentIndex + 1]);
    } else if (player.isShuffleOn) {
      // Play random song
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      player.playSong(trendingSongs[randomIndex]);
    } else if (player.repeatMode === 1 && currentIndex === trendingSongs.length - 1) {
      // Repeat all - go back to first song
      player.playSong(trendingSongs[0]);
    }
  };
  
  // Play previous song implementation (needs access to trending songs)
  const playPreviousSong = () => {
    // If we should restart current song, the base implementation will handle it
    if (!player.currentSong || (player.playerRef.current && player.playerRef.current.getCurrentTime() > 3)) {
      player.playPreviousSong();
      return;
    }
    
    // Find current song in trending list and play previous
    const currentIndex = trendingSongs.findIndex(song => song.id === player.currentSong?.id);
    if (currentIndex > 0) {
      player.playSong(trendingSongs[currentIndex - 1]);
    } else if (player.isShuffleOn) {
      // Play random song
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      player.playSong(trendingSongs[randomIndex]);
    } else if (player.repeatMode === 1 && currentIndex === 0) {
      // Repeat all - go to last song
      player.playSong(trendingSongs[trendingSongs.length - 1]);
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left section - Player and controls */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Search bar */}
          <SearchBar
            searchQuery={search.searchQuery}
            setSearchQuery={search.setSearchQuery}
            searchResults={search.searchResults}
            handleSearch={search.handleSearch}
            playSong={player.playSong}
          />
          
          {/* Player section */}
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
          
          {/* YouTube player - hidden */}
          <YouTubeCore
            videoId={player.currentSong?.videoId || null}
            isPlaying={player.isPlaying}
            volume={player.volume}
            onReady={player.onPlayerReady}
            onStateChange={player.onPlayerStateChange}
            onError={player.onPlayerError}
            onProgressChange={player.onProgressChange}
          />
          
          {/* Action buttons */}
          {player.currentSong && (
            <ActionButtons
              currentSong={player.currentSong}
              isBackgroundPlay={player.isBackgroundPlay}
              toggleBackgroundPlay={player.toggleBackgroundPlay}
              setShowDownloadDialog={download.setShowDownloadDialog}
            />
          )}
        </div>
        
        {/* Right section - Trending, Recent, Queue */}
        <div className="lg:col-span-1 flex flex-col">
          <TabsSection
            trendingSongs={trendingSongs}
            recentlyPlayed={recentlyPlayed}
            queue={player.queue}
            currentSong={player.currentSong}
            playSong={player.playSong}
            addToQueue={player.addToQueue}
          />
        </div>
      </div>
      
      {/* Download dialog */}
      <DownloadDialog
        showDownloadDialog={download.showDownloadDialog}
        setShowDownloadDialog={download.setShowDownloadDialog}
        currentSong={player.currentSong}
        handleDownload={(format) => download.handleDownload(player.currentSong, format)}
      />
    </div>
  );
};

export default YouTubePlayer;
