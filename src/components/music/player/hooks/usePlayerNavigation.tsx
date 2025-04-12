
import { useState } from 'react';
import { Song } from '../types';
import { trendingSongs } from '../data/mockSongs';

export function usePlayerNavigation(
  currentSong: Song | null, 
  playSong: (song: Song) => void,
  isShuffleOn: boolean,
  repeatMode: number
) {
  const playNextSong = () => {
    if (!currentSong) return;
    
    const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex !== -1 && currentIndex < trendingSongs.length - 1) {
      playSong(trendingSongs[currentIndex + 1]);
    } else if (isShuffleOn) {
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      playSong(trendingSongs[randomIndex]);
    } else if (repeatMode === 1 && currentIndex === trendingSongs.length - 1) {
      playSong(trendingSongs[0]);
    }
  };

  const playPreviousSong = () => {
    if (!currentSong) return;
    
    const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      playSong(trendingSongs[currentIndex - 1]);
    } else if (isShuffleOn) {
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      playSong(trendingSongs[randomIndex]);
    } else if (repeatMode === 1 && currentIndex === 0) {
      playSong(trendingSongs[trendingSongs.length - 1]);
    }
  };

  return {
    playNextSong,
    playPreviousSong
  };
}
