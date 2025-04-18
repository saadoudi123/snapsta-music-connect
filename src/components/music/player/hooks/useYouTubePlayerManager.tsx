
import { useState } from 'react';
import { useYouTubePlayer } from './useYouTubePlayer';
import { useYouTubeSearch } from './useYouTubeSearch';
import { useYouTubeDownload } from './useYouTubeDownload';
import { usePlayerQueue } from './usePlayerQueue';
import { trendingSongs, recentlyPlayed, allSongs } from '../data/mockSongs';

export function useYouTubePlayerManager() {
  // Initialize all hooks
  const player = useYouTubePlayer();
  const search = useYouTubeSearch(allSongs);
  const download = useYouTubeDownload();
  
  // Create queue manager with trending and recently played songs
  const queue = {
    ...usePlayerQueue(),
    trendingSongs,
    recentlyPlayed,
  };
  
  // Connect download dialog to the download hook
  const handleShowDownloadDialog = (show: boolean) => {
    download.setShowDownloadDialog(show);
  };
  
  // Add the download handler to the player object
  const playerWithDownload = {
    ...player,
    showDownloadDialog: handleShowDownloadDialog
  };
  
  return {
    player: playerWithDownload,
    search,
    download,
    queue
  };
}
