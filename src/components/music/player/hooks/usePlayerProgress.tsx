
import { useState, useRef, useCallback } from 'react';

export function usePlayerProgress() {
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[], player?: YT.Player | null) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };
  
  // Handle progress change (seek)
  const handleProgressChange = (value: number[], player?: YT.Player | null) => {
    const newProgress = value[0];
    if (player && duration) {
      const seekTime = (newProgress / 100) * duration;
      player.seekTo(seekTime, true);
      setProgress(newProgress);
      setCurrentTime(seekTime);
    }
  };
  
  // Progress timer
  const startProgressTimer = useCallback((player: YT.Player) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    
    progressTimerRef.current = window.setInterval(() => {
      if (player) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        setCurrentTime(currentTime);
        setDuration(duration);
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
  }, []);
  
  const stopProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);
  
  // Update progress
  const updateProgress = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / duration) * 100);
  };
  
  return {
    volume,
    progress,
    duration,
    currentTime,
    formatTime,
    handleVolumeChange,
    handleProgressChange,
    startProgressTimer,
    stopProgressTimer,
    updateProgress,
    progressTimerRef
  };
}
