
import { Song } from '../types';

// Mock data for trending songs
export const trendingSongs: Song[] = [
  { id: '1', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', duration: '5:26', thumbnail: 'https://i.pravatar.cc/300?img=1', videoId: 'dQw4w9WgXcQ' },
  { id: '2', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', duration: '3:54', thumbnail: 'https://i.pravatar.cc/300?img=2', videoId: 'dQw4w9WgXcQ' },
  { id: '3', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', thumbnail: 'https://i.pravatar.cc/300?img=3', videoId: 'dQw4w9WgXcQ' },
  { id: '4', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', album: 'Uptown Special', duration: '4:30', thumbnail: 'https://i.pravatar.cc/300?img=4', videoId: 'dQw4w9WgXcQ' },
  { id: '5', title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?', duration: '3:14', thumbnail: 'https://i.pravatar.cc/300?img=5', videoId: 'dQw4w9WgXcQ' },
];

// Mock data for recently played songs
export const recentlyPlayed: Song[] = [
  { id: '6', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', thumbnail: 'https://i.pravatar.cc/300?img=6', videoId: 'dQw4w9WgXcQ' },
  { id: '7', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: '6:30', thumbnail: 'https://i.pravatar.cc/300?img=7', videoId: 'dQw4w9WgXcQ' },
  { id: '8', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', duration: '5:56', thumbnail: 'https://i.pravatar.cc/300?img=8', videoId: 'dQw4w9WgXcQ' },
];

// Get all songs for search functionality
export const allSongs: Song[] = [...trendingSongs, ...recentlyPlayed];
