
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
      <div className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{t('music.title')}</h1>
        <p className="text-muted-foreground">{t('music.subtitle')}</p>
      </div>
      
      <div className="mb-6">
        <MusicSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <Tabs defaultValue="discover" className="mt-6">
          <TabsList className="mb-4 bg-muted/50 p-1 rounded-full w-full sm:w-auto flex justify-between sm:justify-start">
            <TabsTrigger value="discover" className="rounded-full data-[state=active]:bg-background">{t('music.discover')}</TabsTrigger>
            <TabsTrigger value="playlists" className="rounded-full data-[state=active]:bg-background">{t('music.playlists')}</TabsTrigger>
            <TabsTrigger value="recent" className="rounded-full data-[state=active]:bg-background">{t('music.recentlyPlayed')}</TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full data-[state=active]:bg-background">{t('music.favorites')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="animate-fade-in">
            <PopularTracks 
              tracks={popularTracks} 
              onPlayTrack={handlePlayTrack} 
            />
          </TabsContent>
          
          <TabsContent value="playlists" className="animate-fade-in">
            <PlaylistGrid playlists={playlists} />
          </TabsContent>
          
          <TabsContent value="recent" className="animate-fade-in">
            <RecentlyPlayed 
              tracks={recentlyPlayed} 
              onPlayTrack={handlePlayTrack} 
            />
          </TabsContent>
          
          <TabsContent value="favorites" className="animate-fade-in">
            <FavoritesEmpty />
          </TabsContent>
        </Tabs>
      </div>
      
      <YouTubePlayerSection />
    </div>
  );
};

export default Music;
