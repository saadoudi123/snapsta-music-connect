
import { useEffect } from 'react';
import { Song } from '../types';
import { usePlayerControls } from './usePlayerControls';
import { usePlayerQueue } from './usePlayerQueue';
import { usePlayerProgress } from './usePlayerProgress';
import { useBackgroundPlay } from './useBackgroundPlay';
import { usePlayerEvents } from './usePlayerEvents';

export function useYouTubePlayer() {
  // Combine all the hooks
  const controls = usePlayerControls();
  const queueManager = usePlayerQueue();
  const progress = usePlayerProgress();
  const backgroundPlay = useBackgroundPlay();
  
  // Handle song end based on repeat mode and queue
  const handleSongEnd = () => {
    if (controls.repeatMode === 2) {
      // Repeat current song
      if (controls.playerRef.current && controls.currentSong) {
        controls.playerRef.current.seekTo(0);
        controls.playerRef.current.playVideo();
      }
    } else if (queueManager.queue.length > 0) {
      // Play next song from queue
      const nextSong = queueManager.dequeueNextSong();
      if (nextSong) {
        controls.playSong(nextSong);
      }
    } else if (controls.repeatMode === 1) {
      // Repeat all functionality is handled in playNextSong
      controls.playNextSong();
    } else {
      // Stop playing
      controls.setIsPlaying(false);
    }
  };
  
  // Set up player events hook with the necessary callbacks
  const events = usePlayerEvents({
    setIsPlaying: controls.setIsPlaying,
    startProgressTimer: progress.startProgressTimer,
    stopProgressTimer: progress.stopProgressTimer,
    handleSongEnd
  });
  
  // Overridden playSong function to incorporate background play
  const playSong = (song: Song) => {
    controls.playSong(song);
    backgroundPlay.updateBackgroundInfo(song);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      progress.stopProgressTimer();
    };
  }, [progress]);
  
  return {
    // Player state
    isPlaying: controls.isPlaying,
    currentSong: controls.currentSong,
    queue: queueManager.queue,
    volume: progress.volume,
    progress: progress.progress,
    duration: progress.duration,
    currentTime: progress.currentTime,
    isShuffleOn: controls.isShuffleOn,
    repeatMode: controls.repeatMode,
    isBackgroundPlay: backgroundPlay.isBackgroundPlay,
    playerRef: controls.playerRef,
    
    // Methods
    formatTime: progress.formatTime,
    togglePlay: controls.togglePlay,
    playSong,
    playNextSong: controls.playNextSong,
    playPreviousSong: controls.playPreviousSong,
    handleVolumeChange: (value: number[]) => progress.handleVolumeChange(value, controls.playerRef.current),
    handleProgressChange: (value: number[]) => progress.handleProgressChange(value, controls.playerRef.current),
    toggleShuffle: controls.toggleShuffle,
    toggleRepeat: controls.toggleRepeat,
    addToQueue: queueManager.addToQueue,
    toggleBackgroundPlay: backgroundPlay.toggleBackgroundPlay,
    setQueue: queueManager.setQueue,
    
    // Player event handlers
    onPlayerReady: () => events.onPlayerReady(controls.playerRef.current!, progress.volume),
    onPlayerStateChange: (state: any) => events.onPlayerStateChange(state, controls.playerRef.current!),
    onPlayerError: events.onPlayerError,
    onProgressChange: (currentTime: number, duration: number) => progress.updateProgress(currentTime, duration)
  };
}
