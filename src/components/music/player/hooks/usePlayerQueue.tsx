
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../types';
import { toast } from '@/hooks/use-toast';

export function usePlayerQueue() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<Song[]>([]);
  
  // Add to queue
  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
    
    toast({
      title: t('music.addedToQueue'),
      description: `${song.title} - ${song.artist}`,
    });
  };
  
  // Remove first song from queue and return it
  const dequeueNextSong = (): Song | undefined => {
    if (queue.length === 0) return undefined;
    
    const nextSong = queue[0];
    setQueue(queue.slice(1));
    return nextSong;
  };
  
  return {
    queue,
    setQueue,
    addToQueue,
    dequeueNextSong
  };
}
