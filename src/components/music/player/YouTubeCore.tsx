
import React, { useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface YouTubeCoreProps {
  onPlayerReady: (player: YT.Player) => void;
  onPlayerStateChange: (event: YT.PlayerStateEvent) => void;
  onPlayerError: (event: YT.PlayerErrorEvent) => void;
}

const YouTubeCore: React.FC<YouTubeCoreProps> = ({
  onPlayerReady,
  onPlayerStateChange,
  onPlayerError
}) => {
  const { t } = useTranslation();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  
  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    
    // This function will be called when the API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (playerContainerRef.current && window.YT) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          height: '0',
          width: '0',
          videoId: '',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              console.log('Player ready');
              onPlayerReady(event.target);
            },
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
          }
        });
      }
    };
    
    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [onPlayerReady, onPlayerStateChange, onPlayerError]);
  
  return <div ref={playerContainerRef} className="hidden"></div>;
};

export default YouTubeCore;
