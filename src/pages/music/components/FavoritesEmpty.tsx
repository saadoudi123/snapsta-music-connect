
import React from 'react';
import { useTranslation } from 'react-i18next';

const FavoritesEmpty: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
      <p className="text-muted-foreground">{t('music.noFavoritesYet')}</p>
    </div>
  );
};

export default FavoritesEmpty;
