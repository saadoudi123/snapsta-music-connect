
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

interface RecentlyPlayedProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ tracks, onPlayTrack }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('music.recentlyPlayed')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tracks.map(track => (
            <TrackItem 
              key={track.id} 
              track={track} 
              onPlay={onPlayTrack} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyPlayed;
