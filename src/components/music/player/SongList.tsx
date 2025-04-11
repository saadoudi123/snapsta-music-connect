
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  videoId?: string;
}

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  playSong: (song: Song) => void;
  addToQueue?: (song: Song) => void;
  isQueue?: boolean;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  currentSong,
  playSong,
  addToQueue,
  isQueue = false
}) => {
  const { t } = useTranslation();

  return (
    <ScrollArea className="h-96">
      <div className="space-y-1">
        {songs.map((song, index) => (
          <div 
            key={isQueue ? `queue-${song.id}-${index}` : song.id}
            className={`flex items-center p-2 rounded ${isQueue ? '' : 'hover:bg-accent cursor-pointer'} ${currentSong?.id === song.id ? 'bg-accent' : ''}`}
            onClick={isQueue ? undefined : () => playSong(song)}
          >
            {isQueue && (
              <div className="w-6 flex justify-center mr-2">
                <span className="text-sm text-muted-foreground">{index + 1}</span>
              </div>
            )}
            <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded mr-3" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{song.title}</p>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">{song.duration}</span>
              {!isQueue && addToQueue && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(song);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SongList;
