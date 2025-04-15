
import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchBox from '@/components/search/SearchBox';  // Changed from { SearchBox } to default import

const Search: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('pages.search.title')}</h1>
        <p className="text-muted-foreground">{t('pages.search.description')}</p>
      </div>
      
      <div className="mt-6">
        <SearchBox className="w-full md:max-w-2xl" />
      </div>
      
      <div className="mt-8">
        <p className="text-muted-foreground text-center">{t('pages.search.noResults')}</p>
      </div>
    </div>
  );
};

export default Search;
