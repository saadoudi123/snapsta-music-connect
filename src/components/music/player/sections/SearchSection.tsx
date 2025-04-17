
import React from 'react';
import SearchBar from '../SearchBar';
import { Song } from '../types';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Song[];
  handleSearch: (query: string) => void;
  playSong: (song: Song) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  handleSearch,
  playSong
}) => {
  return (
    <SearchBar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchResults={searchResults}
      handleSearch={handleSearch}
      playSong={playSong}
    />
  );
};

export default SearchSection;
