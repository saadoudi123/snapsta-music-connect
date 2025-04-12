import React, { useEffect, useRef, useState, useCallback } from 'react';
import { YouTubePlayerState } from './types';

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
  const playerRef = useRef<YT.Player | null>(null);
  const playerElementRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<number | null>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [playerLoadAttempts, setPlayerLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Function to safely clear our progress timer (prevent memory leaks)
  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  // Initialize YouTube IFrame API
  useEffect(() => {
    const initYouTubeAPI = () => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        setIsAPIReady(true);
        return;
      }

      // Don't re-add the script tag if it's already been added
      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        return;
      }

      try {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.onerror = () => {
          console.error('Failed to load YouTube IFrame API');
          onError(100); // Custom error code for API load failure
        };

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Set up the API ready callback
        window.onYouTubeIframeAPIReady = () => {
          setIsAPIReady(true);
        };
      } catch (error) {
        console.error('Error initializing YouTube API:', error);
        onError(101); // Custom error code for initialization error
      }
    };

    initYouTubeAPI();

    // Cleanup function
    return () => {
      clearProgressTimer();
      
      // Clean up global callback to prevent memory leaks
      if (window.onYouTubeIframeAPIReady === setIsAPIReady) {
        window.onYouTubeIframeAPIReady = null;
      }
    };
  }, [clearProgressTimer, onError]);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isAPIReady || !playerElementRef.current) return;
    
    // Don't reinitialize if player already exists
    if (playerRef.current) return;
    
    try {
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
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      
      // Retry logic for initialization
      if (playerLoadAttempts < MAX_LOAD_ATTEMPTS) {
        setTimeout(() => {
          setPlayerLoadAttempts(prev => prev + 1);
        }, 1000); // Wait 1 second before retry
      } else {
        onError(102); // Custom error code for repeated init failures
      }
    }
  }, [isAPIReady, playerLoadAttempts, onError]);

  const handleReady = useCallback(() => {
    if (!playerRef.current) return;
    
    try {
      // Set initial volume
      playerRef.current.setVolume(volume);
      
      // Start progress tracking
      clearProgressTimer();
      progressTimerRef.current = window.setInterval(() => trackProgress(), 1000);
      
      onReady();
    } catch (error) {
      console.error('Error in player ready handler:', error);
      onError(103); // Custom error code for ready event error
    }
  }, [volume, onReady, clearProgressTimer, onError]);

  const handleStateChange = useCallback((event: { data: number }) => {
    try {
      const state = event.data as YouTubePlayerState;
      onStateChange(state);
    } catch (error) {
      console.error('Error in state change handler:', error);
      onError(104); // Custom error code for state change error
    }
  }, [onStateChange, onError]);

  const handleError = useCallback((event: { data: number }) => {
    const errorCode = event.data as number;
    console.error('YouTube player error:', errorCode);
    onError(errorCode);
  }, [onError]);

  const trackProgress = useCallback(() => {
    if (!playerRef.current) return;
    
    try {
      const currentTime = playerRef.current.getCurrentTime() || 0;
      const duration = playerRef.current.getDuration() || 0;
      
      // Only update if we have valid numbers
      if (!isNaN(currentTime) && !isNaN(duration) && duration > 0) {
        onProgressChange(currentTime, duration);
      }
    } catch (error) {
      console.error('Error tracking progress:', error);
      // Don't call onError here to avoid spamming - this is a non-critical error
    }
  }, [onProgressChange]);

  // Update player when video ID changes
  useEffect(() => {
    if (!playerRef.current || !videoId) return;
    
    try {
      playerRef.current.cueVideoById(videoId);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error loading video:', error);
      onError(105); // Custom error code for video loading error
    }
  }, [videoId, isPlaying, onError]);

  // Handle playing state changes
  useEffect(() => {
    if (!playerRef.current || !videoId) return;
    
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error('Error changing play state:', error);
      onError(106); // Custom error code for play state change error
    }
  }, [isPlaying, videoId, onError]);

  // Handle volume changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    try {
      playerRef.current.setVolume(volume);
    } catch (error) {
      console.error('Error setting volume:', error);
      // Non-critical error, don't call onError
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearProgressTimer();
      
      // Clean up the player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
      }
    };
  }, [clearProgressTimer]);

  return <div ref={playerElementRef} id="youtube-player"></div>;
};

export default YouTubeCore;
