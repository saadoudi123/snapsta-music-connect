
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  thumbnail: string;
  createdBy: string;
}

interface PlaylistGridProps {
  playlists: Playlist[];
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map(playlist => (
        <Card key={playlist.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img 
              src={playlist.thumbnail} 
              alt={playlist.title} 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <div>
                <h3 className="text-white font-bold text-xl">{playlist.title}</h3>
                <p className="text-white/80 text-sm">
                  By @{playlist.createdBy} • {playlist.tracks.length} tracks
                </p>
              </div>
            </div>
            <Button 
              className="absolute bottom-4 right-4 rounded-full"
              size="icon"
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PlaylistGrid;
