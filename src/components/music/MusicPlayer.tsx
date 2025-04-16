import React, { useState } from 'react';
import MinimizedPlayer from './player/MinimizedPlayer';
import CompactPlayer from './player/CompactPlayer';
import FullscreenPlayer from './player/FullscreenPlayer';
import DownloadDialog from './player/DownloadDialog';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);

  const currentSong = {
    title: "Lose Yourself",
    artist: "Eminem",
    album: "8 Mile Soundtrack",
    coverUrl: "https://i.pravatar.cc/300?img=5",
    duration: "4:28",
    currentTime: "1:20",
    videoId: "dQw4w9WgXcQ"
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };

  const playNextSong = () => {
    console.log('Play next song');
  };

  const playPreviousSong = () => {
    console.log('Play previous song');
  };

  const handleDownload = (format: 'mp3' | 'mp4') => {
    console.log(`Download ${format}`);
    setShowDownloadDialog(false);
  };

  if (isMinimized) {
    return (
      <MinimizedPlayer
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        toggleMinimize={toggleMinimize}
        progress={progress}
        currentSong={currentSong}
        playNextSong={playNextSong}
      />
    );
  }

  return (
    <div className={`fixed ${isFullscreen ? 'inset-0 z-50' : 'bottom-16 md:bottom-0 left-0 right-0 z-30'} bg-background border-t px-4 py-3`}>
      <div className={`container mx-auto ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        {isFullscreen ? (
          <FullscreenPlayer
            toggleFullscreen={toggleFullscreen}
            currentSong={currentSong}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            progress={progress}
            handleProgressChange={handleProgressChange}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            toggleShuffle={toggleShuffle}
            toggleRepeat={toggleRepeat}
            isShuffleOn={isShuffleOn}
            repeatMode={repeatMode}
            playPreviousSong={playPreviousSong}
            playNextSong={playNextSong}
          />
        ) : (
          <CompactPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            playPreviousSong={playPreviousSong}
            playNextSong={playNextSong}
            progress={progress}
            handleProgressChange={handleProgressChange}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            toggleMinimize={toggleMinimize}
            toggleFullscreen={toggleFullscreen}
            setShowDownloadDialog={setShowDownloadDialog}
          />
        )}
      </div>

      <DownloadDialog 
        showDownloadDialog={showDownloadDialog}
        setShowDownloadDialog={setShowDownloadDialog}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default MusicPlayer;
