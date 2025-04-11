
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListMusic } from 'lucide-react';

const EmptyQueueDisplay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="h-96 flex flex-col items-center justify-center text-center p-4">
      <ListMusic className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{t('music.queueEmpty')}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t('music.addSongsToQueue')}
      </p>
    </div>
  );
};

export default EmptyQueueDisplay;
