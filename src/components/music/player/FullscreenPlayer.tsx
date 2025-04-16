
import React from 'react';
import { X, ListMusic, Heart, Download, Share, ExternalLink, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface FullscreenPlayerProps {
  toggleFullscreen: () => void;
  currentSong: {
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    currentTime: string;
    duration: string;
    videoId?: string;
  };
  isPlaying: boolean;
  togglePlay: () => void;
  progress: number;
  handleProgressChange: (value: number[]) => void;
  volume: number;
  handleVolumeChange: (value: number[]) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffleOn: boolean;
  repeatMode: number;
  playPreviousSong: () => void;
  playNextSong: () => void;
}

const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({
  toggleFullscreen,
  currentSong,
  isPlaying,
  togglePlay,
  progress,
  handleProgressChange,
  volume,
  handleVolumeChange,
  toggleShuffle,
  toggleRepeat,
  isShuffleOn,
  repeatMode,
  playPreviousSong,
  playNextSong
}) => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center space-y-8">
      <div className="flex justify-between mb-4 w-full">
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          <X className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <ListMusic className="h-5 w-5" />
        </Button>
      </div>

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
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleShuffle}
          className={isShuffleOn ? "text-primary" : ""}
        >
          <Shuffle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={playPreviousSong}>
          <SkipBack className="h-6 w-6" />
        </Button>
        <Button variant="default" size="icon" className="h-14 w-14 rounded-full" onClick={togglePlay}>
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={playNextSong}>
          <SkipForward className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleRepeat}
          className={repeatMode > 0 ? "text-primary" : ""}
        >
          <Repeat className="h-5 w-5" />
          {repeatMode === 2 && <span className="absolute text-xs">1</span>}
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
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" asChild>
          <a 
            href={`https://www.youtube.com/watch?v=${currentSong.videoId}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            YouTube
          </a>
        </Button>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default FullscreenPlayer;
