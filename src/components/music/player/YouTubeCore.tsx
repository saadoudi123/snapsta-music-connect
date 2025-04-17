
import React, { useRef } from 'react';
import { YouTubePlayerState } from './types';
import { useYouTubeAPI } from './hooks/useYouTubeAPI';
import { useYouTubePlayerLifecycle } from './hooks/useYouTubePlayerLifecycle';

export interface YouTubeCoreProps {
  videoId?: string | null;
  isPlaying?: boolean;
  volume?: number;
  onReady: () => void;
  onStateChange: (state: YouTubePlayerState) => void;
  onError: (error: number) => void;
  onProgressChange?: (currentTime: number, duration: number) => void;
}

const YouTubeCore: React.FC<YouTubeCoreProps> = ({
  videoId = null,
  isPlaying = false,
  volume = 80,
  onReady,
  onStateChange,
  onError,
  onProgressChange = () => {},
}) => {
  const playerElementRef = useRef<HTMLDivElement>(null);
  const { isAPIReady, apiLoadError } = useYouTubeAPI();
  
  // If API failed to load, trigger the error callback
  React.useEffect(() => {
    if (apiLoadError) {
      onError(apiLoadError);
    }
  }, [apiLoadError, onError]);

  // Initialize and manage the YouTube player
  useYouTubePlayerLifecycle({
    elementRef: playerElementRef,
    isAPIReady,
    videoId,
    isPlaying,
    volume,
    onReady,
    onStateChange,
    onError,
    onProgressChange
  });

  return <div ref={playerElementRef} id="youtube-player"></div>;
};

export default YouTubeCore;
