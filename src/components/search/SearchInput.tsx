
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const SearchInput = ({ query, onQueryChange, onClear }: SearchInputProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={t('search.placeholder')}
        className="pl-9 pr-9 bg-background border-muted focus:border-primary transition-colors duration-200 rounded-full"
        value={query}
        onChange={onQueryChange}
      />
      {query.length > 0 && (
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

export default SearchInput;
