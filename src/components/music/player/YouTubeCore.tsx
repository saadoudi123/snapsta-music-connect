
import React, { useEffect, useRef } from 'react';
import { YouTubePlayerState } from '@/components/music/player/types';

interface YouTubeCoreProps {
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
  const playerRef = useRef<YT.Player | null>(null);
  const playerElementRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Initialize YouTube player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const initPlayer = () => {
    if (!playerElementRef.current) return;

    playerRef.current = new window.YT.Player(playerElementRef.current, {
      height: '0',
      width: '0',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: handleReady,
        onStateChange: handleStateChange,
        onError: handleError,
      },
    });
  };

  const handleReady = () => {
    if (!playerRef.current) return;
    
    // Set initial volume
    playerRef.current.setVolume(volume * 100);
    
    // Start progress tracking
    progressTimerRef.current = window.setInterval(trackProgress, 1000);
    
    onReady();
  };

  const handleStateChange = (event: YT.PlayerEvent) => {
    const state = event.data as YouTubePlayerState;
    onStateChange(state);
  };

  const handleError = (event: YT.PlayerEvent) => {
    onError(event.data as number);
  };

  const trackProgress = () => {
    if (!playerRef.current) return;
    
    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (currentTime && duration) {
        onProgressChange(currentTime, duration);
      }
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  };

  // Handle video ID changes
  useEffect(() => {
    if (!playerRef.current || !videoId) return;
    
    playerRef.current.cueVideoById(videoId);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  }, [videoId]);

  // Handle playing state changes
  useEffect(() => {
    if (!playerRef.current || !videoId) return;
    
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, videoId]);

  // Handle volume changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    playerRef.current.setVolume(volume * 100);
  }, [volume]);

  return <div ref={playerElementRef} id="youtube-player"></div>;
};

export default YouTubeCore;
