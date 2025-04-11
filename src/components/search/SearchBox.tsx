
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, User, Hash, Music, MessageSquare, Clock, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'music' | 'channel';
  title: string;
  subtitle?: string;
  image?: string;
  url?: string;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  type?: 'user' | 'post' | 'music' | 'channel';
  resultId?: string;
}

const SearchBox: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Close search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Load recent searches
  useEffect(() => {
    if (!user) return;
    
    const loadRecentSearches = async () => {
      try {
        // In a real app, this would fetch from a database
        // Mock data for now
        const mockRecent: RecentSearch[] = [
          { id: '1', query: 'John Smith', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'user', resultId: 'user-1' },
          { id: '2', query: 'Summer playlist', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'music', resultId: 'music-1' },
          { id: '3', query: 'Vacation photos', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'post', resultId: 'post-1' },
        ];
        
        setRecentSearches(mockRecent);
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };
    
    loadRecentSearches();
  }, [user]);
  
  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make API calls to search different entities
      // Mock results for now
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUsers: SearchResult[] = [
        { id: 'user-1', type: 'user', title: 'John Smith', subtitle: '@johnsmith', image: 'https://i.pravatar.cc/150?img=1', url: '/profile/johnsmith' },
        { id: 'user-2', type: 'user', title: 'Jane Doe', subtitle: '@janedoe', image: 'https://i.pravatar.cc/150?img=2', url: '/profile/janedoe' },
      ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const mockPosts: SearchResult[] = [
        { id: 'post-1', type: 'post', title: 'My summer vacation', subtitle: 'Posted by @johnsmith', image: 'https://source.unsplash.com/random/300x200?summer', url: '/post/1' },
        { id: 'post-2', type: 'post', title: 'New recipe I tried today', subtitle: 'Posted by @janedoe', image: 'https://source.unsplash.com/random/300x200?food', url: '/post/2' },
      ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const mockMusic: SearchResult[] = [
        { id: 'music-1', type: 'music', title: 'Summer Hits 2025', subtitle: 'Playlist • 24 songs', image: 'https://source.unsplash.com/random/300x300?summer', url: '/music/playlist/1' },
        { id: 'music-2', type: 'music', title: 'Chill Vibes', subtitle: 'Album • Artist Name', image: 'https://source.unsplash.com/random/300x300?chill', url: '/music/album/2' },
      ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const mockChannels: SearchResult[] = [
        { id: 'channel-1', type: 'channel', title: 'Music Lovers', subtitle: '1.2k members', image: 'https://source.unsplash.com/random/300x300?music', url: '/channel/1' },
        { id: 'channel-2', type: 'channel', title: 'Tech Talk', subtitle: '856 members', image: 'https://source.unsplash.com/random/300x300?technology', url: '/channel/2' },
      ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let filteredResults: SearchResult[] = [];
      
      if (activeTab === 'all') {
        filteredResults = [...mockUsers, ...mockPosts, ...mockMusic, ...mockChannels];
      } else if (activeTab === 'users') {
        filteredResults = mockUsers;
      } else if (activeTab === 'posts') {
        filteredResults = mockPosts;
      } else if (activeTab === 'music') {
        filteredResults = mockMusic;
      } else if (activeTab === 'channels') {
        filteredResults = mockChannels;
      }
      
      setResults(filteredResults);
      
      // Add to recent searches if we have results
      if (filteredResults.length > 0 && user) {
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          query: searchQuery,
          timestamp: new Date().toISOString(),
        };
        
        setRecentSearches(prev => {
          // Remove duplicates
          const filtered = prev.filter(item => item.query.toLowerCase() !== searchQuery.toLowerCase());
          // Add new search at the beginning
          return [newSearch, ...filtered].slice(0, 10); // Limit to 10 items
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.trim()) {
      performSearch(newQuery);
    } else {
      setResults([]);
    }
  };
  
  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };
  
  // Remove a specific recent search
  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };
  
  // Handle click on search result
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    navigate(result.url || '/');
  };
  
  // Handle click on recent search
  const handleRecentSearchClick = (search: RecentSearch) => {
    setQuery(search.query);
    performSearch(search.query);
  };
  
  return (
    <div className="relative" ref={searchBoxRef}>
      {/* Search input */}
      <div 
        className="relative"
        onClick={() => {
          setIsOpen(true);
          // Focus the input
          setTimeout(() => {
            inputRef.current?.focus();
          }, 10);
        }}
      >
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder={t('search.search')}
          className="w-full bg-muted py-2 pl-9 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-colors"
          value={query}
          onChange={handleSearchInput}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              setResults([]);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 p-4 bg-background rounded-lg border shadow-lg overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">{t('search.all')}</TabsTrigger>
              <TabsTrigger value="users" className="flex-1">{t('search.users')}</TabsTrigger>
              <TabsTrigger value="posts" className="flex-1">{t('search.posts')}</TabsTrigger>
              <TabsTrigger value="music" className="flex-1">{t('search.music')}</TabsTrigger>
              <TabsTrigger value="channels" className="flex-1">{t('search.channels')}</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              {/* Recent searches section */}
              {!query && recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">{t('search.recentSearches')}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={clearRecentSearches}
                    >
                      {t('search.clearRecent')}
                    </Button>
                  </div>
                  
                  <ScrollArea className="max-h-36">
                    {recentSearches.map(search => (
                      <div 
                        key={search.id} 
                        className="flex items-center py-2 px-3 rounded-md hover:bg-accent cursor-pointer"
                        onClick={() => handleRecentSearchClick(search)}
                      >
                        <div className="mr-3 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span className="flex-1 truncate">{search.query}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                          onClick={(e) => removeRecentSearch(search.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <Separator className="my-2" />
                </div>
              )}
              
              {/* Search results */}
              <TabsContent value="all" className="mt-0">
                <SearchResultsList 
                  results={results} 
                  query={query} 
                  isLoading={isLoading} 
                  onResultClick={handleResultClick} 
                />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <SearchResultsList 
                  results={results.filter(r => r.type === 'user')} 
                  query={query} 
                  isLoading={isLoading} 
                  onResultClick={handleResultClick} 
                />
              </TabsContent>
              
              <TabsContent value="posts" className="mt-0">
                <SearchResultsList 
                  results={results.filter(r => r.type === 'post')} 
                  query={query} 
                  isLoading={isLoading} 
                  onResultClick={handleResultClick} 
                />
              </TabsContent>
              
              <TabsContent value="music" className="mt-0">
                <SearchResultsList 
                  results={results.filter(r => r.type === 'music')} 
                  query={query} 
                  isLoading={isLoading} 
                  onResultClick={handleResultClick} 
                />
              </TabsContent>
              
              <TabsContent value="channels" className="mt-0">
                <SearchResultsList 
                  results={results.filter(r => r.type === 'channel')} 
                  query={query} 
                  isLoading={isLoading} 
                  onResultClick={handleResultClick} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

interface SearchResultsListProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ 
  results, 
  query, 
  isLoading,
  onResultClick 
}) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }
  
  if (query && results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">{t('search.noResultsFound')}</p>
        <p className="mt-2 text-sm">{t('search.tryDifferentSearch')}</p>
      </div>
    );
  }
  
  if (!query) {
    return null;
  }
  
  return (
    <ScrollArea className="max-h-[60vh]">
      <div className="space-y-1">
        {results.map(result => (
          <div 
            key={`${result.type}-${result.id}`}
            className="flex items-center py-2 px-3 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => onResultClick(result)}
          >
            {result.type === 'user' ? (
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={result.image} />
                <AvatarFallback>{result.title.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 mr-3 rounded overflow-hidden">
                <img src={result.image} alt={result.title} className="h-full w-full object-cover" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="font-medium truncate">{result.title}</p>
                <div className="ml-2 flex items-center text-xs text-muted-foreground">
                  {result.type === 'user' && <User className="h-3 w-3 mr-1" />}
                  {result.type === 'post' && <Hash className="h-3 w-3 mr-1" />}
                  {result.type === 'music' && <Music className="h-3 w-3 mr-1" />}
                  {result.type === 'channel' && <MessageSquare className="h-3 w-3 mr-1" />}
                  <span>{result.type}</span>
                </div>
              </div>
              {result.subtitle && (
                <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SearchBox;
