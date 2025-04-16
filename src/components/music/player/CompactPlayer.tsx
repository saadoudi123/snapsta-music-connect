
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SkipBack, Play, Pause, SkipForward, Download, MinusCircle, Maximize2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface CompactPlayerProps {
  currentSong: {
    title: string;
    artist: string;
    coverUrl: string;
    currentTime: string;
    duration: string;
  };
  isPlaying: boolean;
  togglePlay: () => void;
  playPreviousSong: () => void;
  playNextSong: () => void;
  progress: number;
  handleProgressChange: (value: number[]) => void;
  volume: number;
  handleVolumeChange: (value: number[]) => void;
  toggleMinimize: () => void;
  toggleFullscreen: () => void;
  setShowDownloadDialog: (show: boolean) => void;
}

const CompactPlayer: React.FC<CompactPlayerProps> = ({
  currentSong,
  isPlaying,
  togglePlay,
  playPreviousSong,
  playNextSong,
  progress,
  handleProgressChange,
  volume,
  handleVolumeChange,
  toggleMinimize,
  toggleFullscreen,
  setShowDownloadDialog
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 flex-1">
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title} 
            className="h-12 w-12 rounded"
          />
          <div className="truncate">
            <p className="font-medium">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={playPreviousSong}>
                  <SkipBack className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('music.previous')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? t('music.pause') : t('music.play')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={playNextSong}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('music.next')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="hidden md:flex items-center space-x-2 w-1/3">
          <span className="text-xs text-muted-foreground">{currentSong.currentTime}</span>
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">{currentSong.duration}</span>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('common.volume')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>

        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowDownloadDialog(true)}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('music.download')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleMinimize}>
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('common.minimize')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('music.fullscreen')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <Progress value={progress} className="h-1 mt-2 md:hidden" />
    </>
  );
};

export default CompactPlayer;
