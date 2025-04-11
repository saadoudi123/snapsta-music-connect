
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download, 
  Maximize2, 
  X, 
  MinusCircle,
  Heart,
  Repeat,
  Shuffle,
  ListMusic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';

// This is a placeholder component for the music player feature
// In a real implementation, we would integrate with YouTube's iframe API
const MusicPlayer: React.FC = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock song data
  const currentSong = {
    title: "Lose Yourself",
    artist: "Eminem",
    album: "8 Mile Soundtrack",
    coverUrl: "https://i.pravatar.cc/300?img=5",
    duration: "4:28",
    currentTime: "1:20",
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-background border-t py-2 px-4 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={toggleMinimize}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <div className="truncate max-w-[150px]">
              <p className="text-sm font-medium">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-1 mt-1" />
      </div>
    );
  }

  return (
    <div className={`fixed ${isFullscreen ? 'inset-0 z-50' : 'bottom-16 md:bottom-0 left-0 right-0 z-30'} bg-background border-t px-4 py-3`}>
      <div className={`container mx-auto ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        {isFullscreen ? (
          <div className="flex justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <X className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ListMusic className="h-5 w-5" />
            </Button>
          </div>
        ) : null}

        <div className={`flex ${isFullscreen ? 'flex-col flex-1 justify-center items-center space-y-8' : 'items-center space-x-4'}`}>
          {!isFullscreen ? (
            <>
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
                      <Button variant="ghost" size="icon">
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
                      <Button variant="ghost" size="icon">
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
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t('music.download')}</SheetTitle>
                      <SheetDescription>
                        {t('music.downloadInstructions')}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                      <Button className="w-full">
                        {t('music.downloadMP3')}
                      </Button>
                      <Button className="w-full" variant="outline">
                        {t('music.downloadMP4')}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

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
            </>
          ) : (
            <>
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title} 
                className="h-60 w-60 rounded-lg shadow-lg"
              />
              
              <div className="text-center">
                <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                <p className="text-muted-foreground">{currentSong.artist}</p>
                <p className="text-sm text-muted-foreground">{currentSong.album}</p>
              </div>
              
              <div className="w-full max-w-md flex flex-col space-y-2">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">{currentSong.currentTime}</span>
                  <span className="text-sm text-muted-foreground">{currentSong.duration}</span>
                </div>
                <Slider
                  value={[progress]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-6 w-6" />
                </Button>
                <Button variant="default" size="icon" className="h-14 w-14 rounded-full" onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Repeat className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-32"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        {!isFullscreen && (
          <Progress value={progress} className="h-1 mt-2 md:hidden" />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
