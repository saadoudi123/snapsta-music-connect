
import { useState, useEffect } from 'react';
import { Track, Playlist } from '../types';

export const useMusicData = () => {
  const [popularTracks, setPopularTracks] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
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
  
  return {
    popularTracks,
    recentlyPlayed,
    playlists,
    currentTrack,
    isPlaying,
    handlePlayTrack
  };
};
