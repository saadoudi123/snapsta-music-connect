
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchResultItem from './SearchResultItem';
import { SearchResult } from './types';

interface SearchResultsProps {
  isLoading: boolean;
  results: SearchResult[];
  query: string;
  onResultClick: (result: SearchResult) => void;
}

const SearchResults = ({ isLoading, results, query, onResultClick }: SearchResultsProps) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">{t('search.loading')}</p>
      </div>
    );
  }
  
  if (results.length > 0) {
    return (
      <ScrollArea className="max-h-[70vh] p-2">
        {results.map((result) => (
          <SearchResultItem 
            key={result.id} 
            result={result} 
            onClick={onResultClick} 
          />
        ))}
      </ScrollArea>
    );
  }
  
  if (query.length > 1) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">{t('search.noResults')}</p>
      </div>
    );
  }
  
  return null;
};

export default SearchResults;
