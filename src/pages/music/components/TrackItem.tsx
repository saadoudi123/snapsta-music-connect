
import React from 'react';
import { Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  viewCount?: string;
  likes?: string;
}

interface TrackItemProps {
  track: Track;
  onPlay: (track: Track) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onPlay }) => {
  return (
    <div 
      key={track.id}
      className="flex items-center p-2 hover:bg-accent/50 rounded-md cursor-pointer"
      onClick={() => onPlay(track)}
    >
      <div className="relative h-12 w-12 mr-3 rounded overflow-hidden">
        <img 
          src={track.thumbnail} 
          alt={track.title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <Play className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{track.title}</p>
        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">{track.duration}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TrackItem;
