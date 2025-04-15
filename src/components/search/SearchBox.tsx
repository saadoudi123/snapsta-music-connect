
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { cn } from '@/lib/utils';
import { SearchBoxProps, SearchResult } from './types';
import SearchResults from './SearchResults';
import SearchInput from './SearchInput';
import { fetchSearchResults } from './searchService';

const SearchBox = ({ className }: SearchBoxProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      setIsLoading(true);
      fetchSearchResults(debouncedQuery)
        .then(data => {
          setResults(data);
          setIsLoading(false);
        });
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);
  
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
  };
  
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };
  
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <SearchInput 
        query={query}
        onQueryChange={handleInputChange}
        onClear={handleClear}
      />
      
      {isOpen && (
        <div className="absolute w-full mt-2 bg-background border rounded-md shadow-lg z-50">
          <SearchResults 
            isLoading={isLoading}
            results={results}
            query={query}
            onResultClick={handleResultClick}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
