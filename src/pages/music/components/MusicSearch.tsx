
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MusicSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MusicSearch: React.FC<MusicSearchProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full max-w-md mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t('music.searchPlaceholder')}
        className="pl-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default MusicSearch;
