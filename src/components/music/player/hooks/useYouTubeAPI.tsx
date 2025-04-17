
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to initialize the YouTube IFrame API
 */
export function useYouTubeAPI() {
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [apiLoadError, setApiLoadError] = useState<number | null>(null);

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
          setApiLoadError(100); // Custom error code for API load failure
        };

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Set up the API ready callback
        window.onYouTubeIframeAPIReady = () => {
          setIsAPIReady(true);
        };
      } catch (error) {
        console.error('Error initializing YouTube API:', error);
        setApiLoadError(101); // Custom error code for initialization error
      }
    };

    initYouTubeAPI();

    // Cleanup function
    return () => {
      // Clean up global callback to prevent memory leaks
      if (window.onYouTubeIframeAPIReady === setIsAPIReady) {
        window.onYouTubeIframeAPIReady = null;
      }
    };
  }, []);

  return { isAPIReady, apiLoadError };
}
