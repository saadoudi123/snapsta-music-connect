
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Music, Hash, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Define the allowed types
type SearchResultType = "user" | "music" | "post" | "channel";

// Define the interface for search results
interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}

// Define the props interface
interface SearchBoxProps {
  className?: string;
}

const SearchBox = ({ className }: SearchBoxProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      setIsLoading(true);
      fetchSearchResults(debouncedQuery);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);
  
  // Mock function to fetch search results
  const fetchSearchResults = async (searchQuery: string) => {
    // In a real app, this would be an API call
    // For demo, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock results based on the search query
    const mockResults: SearchResult[] = [];
    
    // Users
    if (searchQuery.length > 0) {
      mockResults.push(
        ...[{
          id: 'user1',
          type: 'user' as SearchResultType,
          title: 'John Doe',
          subtitle: '@johndoe',
          image: 'https://i.pravatar.cc/150?u=1',
          url: '/profile/johndoe'
        },
        {
          id: 'user2',
          type: 'user' as SearchResultType,
          title: 'Jane Smith',
          subtitle: '@janesmith',
          image: 'https://i.pravatar.cc/150?u=2',
          url: '/profile/janesmith'
        }]
      );
      
      // Music
      mockResults.push(
        ...[{
          id: 'music1',
          type: 'music' as SearchResultType,
          title: 'Shape of You',
          subtitle: 'Ed Sheeran',
          image: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
          url: '/music/shape-of-you'
        },
        {
          id: 'music2',
          type: 'music' as SearchResultType,
          title: 'Blinding Lights',
          subtitle: 'The Weeknd',
          image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
          url: '/music/blinding-lights'
        }]
      );
      
      // Channels
      mockResults.push(
        ...[{
          id: 'channel1',
          type: 'channel' as SearchResultType,
          title: '#music_lovers',
          subtitle: '3.2k members',
          image: '',
          url: '/channels/music_lovers'
        },
        {
          id: 'channel2',
          type: 'channel' as SearchResultType,
          title: '#travel_adventures',
          subtitle: '1.5k members',
          image: '',
          url: '/channels/travel_adventures'
        }]
      );
      
      // Posts
      mockResults.push(
        ...[{
          id: 'post1',
          type: 'post' as SearchResultType,
          title: 'My Summer Holiday Photos',
          subtitle: 'Posted by @johndoe • 2 days ago',
          image: 'https://source.unsplash.com/random/300x200?summer',
          url: '/posts/summer-holiday'
        },
        {
          id: 'post2',
          type: 'post' as SearchResultType,
          title: 'New Music Release Party',
          subtitle: 'Posted by @musiclover • 5 hours ago',
          image: 'https://source.unsplash.com/random/300x200?concert',
          url: '/posts/music-release'
        }]
      );
    }
    
    setResults(mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    setIsLoading(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  
  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setResults([]);
    inputRef.current?.focus();
  };
  
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };
  
  const getResultIcon = (type: SearchResultType) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-muted-foreground" />;
      case 'music':
        return <Music className="h-4 w-4 text-muted-foreground" />;
      case 'channel':
        return <Hash className="h-4 w-4 text-muted-foreground" />;
      case 'post':
        return <Newspaper className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t('search.placeholder')}
          className="pl-9 pr-9"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.length > 0) setIsOpen(true);
          }}
        />
        {query.length > 0 && (
          <button 
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-accent"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute w-full mt-2 bg-background border rounded-md shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('search.loading')}</p>
            </div>
          ) : results.length > 0 ? (
            <ScrollArea className="max-h-[70vh] p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  {result.type === 'user' ? (
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={result.image} />
                      <AvatarFallback>
                        {result.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : result.type === 'music' || result.type === 'post' ? (
                    <div className="h-8 w-8 mr-3 rounded overflow-hidden">
                      <img 
                        src={result.image} 
                        alt={result.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 mr-3 flex items-center justify-center bg-accent rounded-full">
                      {getResultIcon(result.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  
                  <div className="ml-2">
                    {getResultIcon(result.type)}
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : query.length > 1 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('search.noResults')}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
