
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MusicSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MusicSearch: React.FC<MusicSearchProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t('music.searchPlaceholder')}
        className="pl-9 pr-9 bg-background border-muted focus:border-primary transition-colors duration-200 rounded-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery.length > 0 && (
        <button 
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-accent transition-colors duration-200"
          aria-label={t('common.clear')}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

export default MusicSearch;
