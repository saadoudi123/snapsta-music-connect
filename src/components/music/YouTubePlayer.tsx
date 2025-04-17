
import React from 'react';
import SearchSection from './player/sections/SearchSection';
import PlayerSection from './player/sections/PlayerSection';
import TabsSection from './player/TabsSection';
import DownloadDialog from './player/DownloadDialog';
import { useYouTubePlayerManager } from './player/hooks/useYouTubePlayerManager';

const YouTubePlayer: React.FC = () => {
  const { player, search, download, queue } = useYouTubePlayerManager();
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 flex flex-col">
          <SearchSection 
            searchQuery={search.searchQuery}
            setSearchQuery={search.setSearchQuery}
            searchResults={search.searchResults}
            handleSearch={search.handleSearch}
            playSong={player.playSong}
          />
          
          <PlayerSection 
            player={player}
            trendingSongs={queue.trendingSongs}
          />
        </div>
        
        <div className="lg:col-span-1 flex flex-col">
          <TabsSection
            trendingSongs={queue.trendingSongs}
            recentlyPlayed={queue.recentlyPlayed}
            queue={queue.queue}
            currentSong={player.currentSong}
            playSong={player.playSong}
            addToQueue={queue.addToQueue}
          />
        </div>
      </div>
      
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
