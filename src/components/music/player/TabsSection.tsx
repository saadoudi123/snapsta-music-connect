
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListMusic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SongList from './SongList';
import EmptyQueueDisplay from './EmptyQueueDisplay';
import { Song } from './types';

interface TabsSectionProps {
  trendingSongs: Song[];
  recentlyPlayed: Song[];
  queue: Song[];
  currentSong: Song | null;
  playSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  trendingSongs,
  recentlyPlayed,
  queue,
  currentSong,
  playSong,
  addToQueue
}) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="trending">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="trending" className="flex-1">
          {t('music.trending')}
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex-1">
          {t('music.recentlyPlayed')}
        </TabsTrigger>
        <TabsTrigger value="queue" className="flex-1">
          <ListMusic className="h-4 w-4 mr-2" />
          {t('music.queue')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="trending" className="flex-1">
        <SongList
          songs={trendingSongs}
          currentSong={currentSong}
          playSong={playSong}
          addToQueue={addToQueue}
        />
      </TabsContent>
      
      <TabsContent value="recent" className="flex-1">
        <SongList
          songs={recentlyPlayed}
          currentSong={currentSong}
          playSong={playSong}
          addToQueue={addToQueue}
        />
      </TabsContent>
      
      <TabsContent value="queue" className="flex-1">
        {queue.length > 0 ? (
          <SongList
            songs={queue}
            currentSong={currentSong}
            playSong={playSong}
            isQueue={true}
          />
        ) : (
          <EmptyQueueDisplay />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
