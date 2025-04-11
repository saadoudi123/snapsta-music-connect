
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  videoId?: string;
}

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Song[];
  handleSearch: (query: string) => void;
  playSong: (song: Song) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  handleSearch,
  playSong
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={t('music.search')}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-2 border rounded-md shadow-sm bg-background z-10 absolute w-[calc(100%-2rem)]">
          <ScrollArea className="max-h-64">
            {searchResults.map((result) => (
              <div 
                key={result.id} 
                className="flex items-center p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  playSong(result);
                  setSearchQuery('');
                }}
              >
                <img src={result.thumbnail} alt={result.title} className="w-10 h-10 rounded mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-sm text-muted-foreground">{result.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground ml-2">{result.duration}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
