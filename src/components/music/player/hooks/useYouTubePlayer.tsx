
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Song, YouTubePlayerState } from '../types';
import { toast } from '@/hooks/use-toast';

export function useYouTubePlayer() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: repeat all, 2: repeat one
  const [isBackgroundPlay, setIsBackgroundPlay] = useState(false);
  
  const playerRef = useRef<YT.Player | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Progress timer
  const startProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    
    progressTimerRef.current = window.setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setCurrentTime(currentTime);
        setDuration(duration);
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
  };
  
  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };
  
  // Player event handlers
  const onPlayerReady = () => {
    console.log('Player ready');
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  };
  
  const onPlayerStateChange = (state: YouTubePlayerState) => {
    if (state === YouTubePlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTimer();
    } else if (state === YouTubePlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTimer();
    } else if (state === YouTubePlayerState.ENDED) {
      handleSongEnd();
    }
  };
  
  const onPlayerError = (errorCode: number) => {
    console.error('Player error:', errorCode);
    toast({
      title: t('errors.mediaPlaybackError'),
      description: t('errors.tryAgain'),
      variant: 'destructive'
    });
  };
  
  const onProgressChange = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / duration) * 100);
  };
  
  // Play song
  const playSong = (song: Song) => {
    if (!playerRef.current || !song.videoId) return;
    
    setCurrentSong(song);
    playerRef.current.loadVideoById(song.videoId);
    playerRef.current.playVideo();
    setIsPlaying(true);
    
    // Update document title and show notification if background play is enabled
    if (isBackgroundPlay) {
      document.title = `${song.title} - ${song.artist}`;
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(t('music.nowPlaying'), {
          body: `${song.title} - ${song.artist}`,
          icon: song.thumbnail
        });
      }
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      if (currentSong) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };
  
  // Handle song end
  const handleSongEnd = () => {
    if (repeatMode === 2) {
      // Repeat current song
      if (playerRef.current && currentSong) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else if (queue.length > 0) {
      // Play next song
      playNextSong();
    } else if (repeatMode === 1) {
      // Repeat all functionality handled in playNextSong
      playNextSong();
    } else {
      // Stop playing
      setIsPlaying(false);
    }
  };
  
  // Play next song
  const playNextSong = () => {
    if (queue.length > 0) {
      // Play from queue
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      playSong(nextSong);
      return;
    }
    
    // No songs in queue, use trending songs
    if (!currentSong) return;
    
    // This function will be implemented in the component where trending songs are available
  };
  
  // Play previous song
  const playPreviousSong = () => {
    if (!currentSong) return;
    
    // If current time > 3 seconds, restart song
    if (playerRef.current && playerRef.current.getCurrentTime() > 3) {
      playerRef.current.seekTo(0);
      return;
    }
    
    // This function will be implemented in the component where trending songs are available
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };
  
  // Handle progress change (seek)
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    if (playerRef.current && duration) {
      const seekTime = (newProgress / 100) * duration;
      playerRef.current.seekTo(seekTime, true);
      setProgress(newProgress);
      setCurrentTime(seekTime);
    }
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };
  
  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };
  
  // Add to queue
  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
    
    toast({
      title: t('music.addedToQueue'),
      description: `${song.title} - ${song.artist}`,
    });
  };
  
  // Toggle background play
  const toggleBackgroundPlay = () => {
    setIsBackgroundPlay(!isBackgroundPlay);
    
    if (!isBackgroundPlay) {
      // Request notification permission for background play alerts
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
      
      toast({
        title: t('music.backgroundPlayEnabled'),
        description: t('music.playingInBackground'),
      });
    } else {
      document.title = 'Snapsta'; // Reset title
      
      toast({
        title: t('music.backgroundPlayDisabled'),
      });
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);
  
  return {
    isPlaying,
    currentSong,
    queue,
    volume,
    progress,
    duration,
    currentTime,
    isShuffleOn,
    repeatMode,
    isBackgroundPlay,
    playerRef,
    formatTime,
    onPlayerReady,
    onPlayerStateChange,
    onPlayerError,
    onProgressChange,
    playSong,
    togglePlay,
    playNextSong,
    playPreviousSong,
    handleVolumeChange,
    handleProgressChange,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    toggleBackgroundPlay,
    setQueue
  };
}
