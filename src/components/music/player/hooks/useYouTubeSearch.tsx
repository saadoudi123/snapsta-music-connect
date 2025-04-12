
import { useState } from 'react';
import { Song } from '../types';

export function useYouTubeSearch(allSongs: Song[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  
  // Handle search
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Filter songs based on search query
    const results = allSongs
      .filter(song => 
        song.title.toLowerCase().includes(q.toLowerCase()) ||
        song.artist.toLowerCase().includes(q.toLowerCase())
      )
      .slice(0, 5);
    
    setSearchResults(results);
  };
  
  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSearch
  };
}
