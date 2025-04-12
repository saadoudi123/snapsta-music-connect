
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import YouTubePlayer from '@/components/music/YouTubePlayer';

const YouTubePlayerSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Separator className="my-6" />
      
      <div className="bg-background p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">{t('music.youtubePlayer')}</h2>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <YouTubePlayer />
        </div>
        <p className="text-muted-foreground text-sm">
          {t('music.youtubePlayerDescription')}
        </p>
      </div>
    </>
  );
};

export default YouTubePlayerSection;
