
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  videoId?: string;
}

interface DownloadDialogProps {
  showDownloadDialog: boolean;
  setShowDownloadDialog: (show: boolean) => void;
  currentSong: Song | null;
  handleDownload: (format: 'mp3' | 'mp4') => void;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({
  showDownloadDialog,
  setShowDownloadDialog,
  currentSong,
  handleDownload
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('music.download')}</DialogTitle>
          <DialogDescription>
            {currentSong && `${currentSong.title} - ${currentSong.artist}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <Button className="w-full" onClick={() => handleDownload('mp3')}>
            <Download className="h-4 w-4 mr-2" />
            {t('music.downloadMP3')}
          </Button>
          
          <Button className="w-full" variant="outline" onClick={() => handleDownload('mp4')}>
            <Download className="h-4 w-4 mr-2" />
            {t('music.downloadMP4')}
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
