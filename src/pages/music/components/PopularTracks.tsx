
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import TrackItem from './TrackItem';

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

interface PopularTracksProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
}

const PopularTracks: React.FC<PopularTracksProps> = ({ tracks, onPlayTrack }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('music.popularTracks')}</CardTitle>
        <CardDescription>{t('music.popularTracksSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {tracks.map(track => (
              <TrackItem 
                key={track.id} 
                track={track} 
                onPlay={onPlayTrack} 
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PopularTracks;
