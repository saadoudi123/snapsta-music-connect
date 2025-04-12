
import React from 'react';
import { useYouTubePlayer } from './player/hooks/useYouTubePlayer';
import { useYouTubeSearch } from './player/hooks/useYouTubeSearch';
import { useYouTubeDownload } from './player/hooks/useYouTubeDownload';
import PlayerLeft from './player/PlayerSections/PlayerLeft';
import TabsSection from './player/TabsSection';
import DownloadDialog from './player/DownloadDialog';

import { trendingSongs, recentlyPlayed, allSongs } from './player/data/mockSongs';

const YouTubePlayer: React.FC = () => {
  const player = useYouTubePlayer();
  const search = useYouTubeSearch(allSongs);
  const download = useYouTubeDownload();
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <PlayerLeft player={player} download={download} />
        
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
