
import React from 'react';
import { User, Music, Hash, Newspaper, Search } from 'lucide-react';
import { SearchResultType } from './types';

export const getResultIcon = (type: SearchResultType) => {
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
