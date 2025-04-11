
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Search, Play, Pause, Volume2, Heart, MoreHorizontal } from 'lucide-react';
import YouTubePlayer from '../components/music/YouTubePlayer';

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

interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  thumbnail: string;
  createdBy: string;
}

const Music: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [popularTracks, setPopularTracks] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  
  // Fetch mock data for playlists and tracks
  useEffect(() => {
    // Mock data for popular tracks
    const mockPopularTracks: Track[] = [
      {
        id: 'track1',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
        duration: '3:54',
        videoId: 'JGwWNGJdvx8',
        viewCount: '5.2B',
        likes: '30M'
      },
      {
        id: 'track2',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
        duration: '4:22',
        videoId: '4NRXx6U8ABQ',
        viewCount: '2.7B',
        likes: '22M'
      },
      {
        id: 'track3',
        title: 'Dance Monkey',
        artist: 'Tones and I',
        thumbnail: 'https://i.ytimg.com/vi/q0hyYWKXF0Q/hqdefault.jpg',
        duration: '3:57',
        videoId: 'q0hyYWKXF0Q',
        viewCount: '2.1B',
        likes: '17M'
      },
      {
        id: 'track4',
        title: 'Levitating',
        artist: 'Dua Lipa',
        thumbnail: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg',
        duration: '3:23',
        videoId: 'TUVcZfQe-Kw',
        viewCount: '1.8B',
        likes: '15M'
      },
      {
        id: 'track5',
        title: 'Watermelon Sugar',
        artist: 'Harry Styles',
        thumbnail: 'https://i.ytimg.com/vi/E07s5ZYygMg/hqdefault.jpg',
        duration: '2:54',
        videoId: 'E07s5ZYygMg',
        viewCount: '1.6B',
        likes: '12M'
      }
    ];
    
    setPopularTracks(mockPopularTracks);
    
    // Mock recently played data
    setRecentlyPlayed([
      mockPopularTracks[2],
      mockPopularTracks[0],
      mockPopularTracks[4]
    ]);
    
    // Mock playlists
    setPlaylists([
      {
        id: 'playlist1',
        title: 'Summer Vibes',
        tracks: [mockPopularTracks[0], mockPopularTracks[4], mockPopularTracks[2]],
        thumbnail: 'https://source.unsplash.com/random/300x300?summer',
        createdBy: 'johnsmith'
      },
      {
        id: 'playlist2',
        title: 'Workout Mix',
        tracks: [mockPopularTracks[1], mockPopularTracks[3], mockPopularTracks[0]],
        thumbnail: 'https://source.unsplash.com/random/300x300?workout',
        createdBy: 'fitnessfreak'
      },
      {
        id: 'playlist3',
        title: 'Chill Vibes',
        tracks: [mockPopularTracks[4], mockPopularTracks[2], mockPopularTracks[1]],
        thumbnail: 'https://source.unsplash.com/random/300x300?chill',
        createdBy: 'musiclover'
      }
    ]);
  }, []);
  
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('music.title')}</h1>
        <p className="text-muted-foreground">{t('music.subtitle')}</p>
      </div>
      
      <div className="mb-6">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('music.searchPlaceholder')}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="discover">
          <TabsList className="mb-4">
            <TabsTrigger value="discover">{t('music.discover')}</TabsTrigger>
            <TabsTrigger value="playlists">{t('music.playlists')}</TabsTrigger>
            <TabsTrigger value="recent">{t('music.recentlyPlayed')}</TabsTrigger>
            <TabsTrigger value="favorites">{t('music.favorites')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            <Card>
              <CardHeader>
                <CardTitle>{t('music.popularTracks')}</CardTitle>
                <CardDescription>{t('music.popularTracksSubtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {popularTracks.map(track => (
                      <div 
                        key={track.id}
                        className="flex items-center p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                        onClick={() => handlePlayTrack(track)}
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
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="playlists">
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
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>{t('music.recentlyPlayed')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentlyPlayed.map(track => (
                    <div 
                      key={track.id}
                      className="flex items-center p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                      onClick={() => handlePlayTrack(track)}
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
                      
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">{track.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
              <p className="text-muted-foreground">{t('music.noFavoritesYet')}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Separator className="my-6" />
      
      <div className="bg-background p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">{t('music.youtubePlayer')}</h2>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <YouTubePlayer />
        </div>
        <p className="text-muted-foreground text-sm">
          {t('music.youtubePlayerDescription')}
        </p>
      </div>
    </div>
  );
};

export default Music;
