
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Song } from './types';

interface DownloadDialogProps {
  showDownloadDialog: boolean;
  setShowDownloadDialog: (show: boolean) => void;
  handleDownload: (format: 'mp3' | 'mp4') => void;
  currentSong?: Song | null;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({
  showDownloadDialog,
  setShowDownloadDialog,
  handleDownload,
  currentSong
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('music.download')}</SheetTitle>
          <SheetDescription>
            {currentSong ? (
              <>
                {t('music.downloadInstructions')}
                <div className="mt-2 text-sm font-medium">
                  {currentSong.title} - {currentSong.artist}
                </div>
              </>
            ) : (
              t('music.downloadInstructions')
            )}
          </SheetDescription>
        </SheetHeader>
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
      </SheetContent>
    </Sheet>
  );
};

export default DownloadDialog;
