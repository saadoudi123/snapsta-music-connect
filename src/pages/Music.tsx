
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusicData } from './music/hooks/useMusicData';
import MusicSearch from './music/components/MusicSearch';
import PopularTracks from './music/components/PopularTracks';
import RecentlyPlayed from './music/components/RecentlyPlayed';
import PlaylistGrid from './music/components/PlaylistGrid';
import FavoritesEmpty from './music/components/FavoritesEmpty';
import YouTubePlayerSection from './music/components/YouTubePlayerSection';

const Music: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    popularTracks, 
    recentlyPlayed, 
    playlists, 
    handlePlayTrack 
  } = useMusicData();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('music.title')}</h1>
        <p className="text-muted-foreground">{t('music.subtitle')}</p>
      </div>
      
      <div className="mb-6">
        <MusicSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <Tabs defaultValue="discover">
          <TabsList className="mb-4">
            <TabsTrigger value="discover">{t('music.discover')}</TabsTrigger>
            <TabsTrigger value="playlists">{t('music.playlists')}</TabsTrigger>
            <TabsTrigger value="recent">{t('music.recentlyPlayed')}</TabsTrigger>
            <TabsTrigger value="favorites">{t('music.favorites')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            <PopularTracks 
              tracks={popularTracks} 
              onPlayTrack={handlePlayTrack} 
            />
          </TabsContent>
          
          <TabsContent value="playlists">
            <PlaylistGrid playlists={playlists} />
          </TabsContent>
          
          <TabsContent value="recent">
            <RecentlyPlayed 
              tracks={recentlyPlayed} 
              onPlayTrack={handlePlayTrack} 
            />
          </TabsContent>
          
          <TabsContent value="favorites">
            <FavoritesEmpty />
          </TabsContent>
        </Tabs>
      </div>
      
      <YouTubePlayerSection />
    </div>
  );
};

export default Music;
