
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../types';
import { toast } from '@/hooks/use-toast';

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
    toggleShuffle,
    toggleRepeat
  };
}
