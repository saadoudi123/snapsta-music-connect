
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SearchResult } from './types';
import { getResultIcon } from './searchUtils';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

const SearchResultItem = ({ result, onClick }: SearchResultItemProps) => {
  return (
    <div
      className="flex items-center p-2 hover:bg-accent/50 rounded-md cursor-pointer"
      onClick={() => onClick(result)}
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
  );
};

export default SearchResultItem;
