
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../types';
import { toast } from '@/hooks/use-toast';
import { trendingSongs } from '../data/mockSongs';

export function usePlayerControls() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: repeat all, 2: repeat one
  const playerRef = useRef<YT.Player | null>(null);
  
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
  
  // Play song
  const playSong = (song: Song) => {
    if (!playerRef.current || !song.videoId) return;
    
    setCurrentSong(song);
    playerRef.current.loadVideoById(song.videoId);
    playerRef.current.playVideo();
    setIsPlaying(true);
  };
  
  // Play next song - Refactored to avoid code duplication between hooks
  const playNextSong = () => {
    if (!currentSong) return;
    
    const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex !== -1 && currentIndex < trendingSongs.length - 1) {
      playSong(trendingSongs[currentIndex + 1]);
    } else if (isShuffleOn) {
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      playSong(trendingSongs[randomIndex]);
    } else if (repeatMode === 1 && currentIndex === trendingSongs.length - 1) {
      // Repeat all - go back to first song
      playSong(trendingSongs[0]);
    }
  };

  // Play previous song - Refactored to avoid code duplication between hooks
  const playPreviousSong = () => {
    if (!currentSong) return;
    
    const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      playSong(trendingSongs[currentIndex - 1]);
    } else if (isShuffleOn) {
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      playSong(trendingSongs[randomIndex]);
    } else if (repeatMode === 1 && currentIndex === 0) {
      // Repeat all - go to last song
      playSong(trendingSongs[trendingSongs.length - 1]);
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
  
  return {
    isPlaying,
    setIsPlaying,
    currentSong,
    setCurrentSong,
    isShuffleOn,
    repeatMode,
    playerRef,
    togglePlay,
    playSong,
    playNextSong,
    playPreviousSong,
    toggleShuffle,
    toggleRepeat
  };
}
