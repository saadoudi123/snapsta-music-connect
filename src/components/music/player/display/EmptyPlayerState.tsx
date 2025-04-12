
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Song } from '../types';

interface EmptyPlayerStateProps {
  playSong: (song: Song) => void;
  trendingSongs: Song[];
}

const EmptyPlayerState: React.FC<EmptyPlayerStateProps> = ({ playSong, trendingSongs }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">{t('music.selectSongToPlay')}</h2>
      <p className="text-muted-foreground mb-6">{t('music.browseAndSelect')}</p>
      <Button onClick={() => playSong(trendingSongs[0])}>
        <Play className="h-4 w-4 mr-2" />
        {t('music.playRandom')}
      </Button>
    </div>
  );
};

export default EmptyPlayerState;
