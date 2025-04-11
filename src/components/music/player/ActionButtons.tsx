
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Download, Share, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  videoId?: string;
}

interface ActionButtonsProps {
  currentSong: Song;
  isBackgroundPlay: boolean;
  toggleBackgroundPlay: () => void;
  setShowDownloadDialog: (show: boolean) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentSong,
  isBackgroundPlay,
  toggleBackgroundPlay,
  setShowDownloadDialog
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex justify-between">
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Heart className="h-4 w-4 mr-2" />
          {t('music.favorite')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowDownloadDialog(true)}>
          <Download className="h-4 w-4 mr-2" />
          {t('music.download')}
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant={isBackgroundPlay ? "default" : "outline"} 
          size="sm"
          onClick={toggleBackgroundPlay}
        >
          {isBackgroundPlay ? t('music.backgroundOn') : t('music.backgroundOff')}
        </Button>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          {t('music.share')}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a 
            href={`https://www.youtube.com/watch?v=${currentSong.videoId}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t('music.viewOnYouTube')}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
