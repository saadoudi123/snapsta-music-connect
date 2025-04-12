
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../types';
import { toast } from '@/hooks/use-toast';

export function useBackgroundPlay() {
  const { t } = useTranslation();
  const [isBackgroundPlay, setIsBackgroundPlay] = useState(false);
  
  // Toggle background play
  const toggleBackgroundPlay = () => {
    const newValue = !isBackgroundPlay;
    setIsBackgroundPlay(newValue);
    
    if (newValue) {
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
  
  // Update document title and show notification
  const updateBackgroundInfo = (song: Song | null) => {
    if (!isBackgroundPlay || !song) return;
    
    document.title = `${song.title} - ${song.artist}`;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(t('music.nowPlaying'), {
        body: `${song.title} - ${song.artist}`,
        icon: song.thumbnail
      });
    }
  };
  
  return {
    isBackgroundPlay,
    toggleBackgroundPlay,
    updateBackgroundInfo
  };
}
