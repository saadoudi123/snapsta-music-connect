
import { useTranslation } from 'react-i18next';
import { YouTubePlayerState } from '../types';
import { toast } from '@/hooks/use-toast';

interface UsePlayerEventsParams {
  setIsPlaying: (isPlaying: boolean) => void;
  startProgressTimer: (player: YT.Player) => void;
  stopProgressTimer: () => void;
  handleSongEnd: () => void;
}

export function usePlayerEvents({
  setIsPlaying,
  startProgressTimer,
  stopProgressTimer,
  handleSongEnd
}: UsePlayerEventsParams) {
  const { t } = useTranslation();
  
  // Player event handlers
  const onPlayerReady = (player: YT.Player, volume: number) => {
    console.log('Player ready');
    player.setVolume(volume);
  };
  
  const onPlayerStateChange = (state: YouTubePlayerState, player: YT.Player) => {
    if (state === YouTubePlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTimer(player);
    } else if (state === YouTubePlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTimer();
    } else if (state === YouTubePlayerState.ENDED) {
      handleSongEnd();
    }
  };
  
  const onPlayerError = (errorCode: number) => {
    console.error('Player error:', errorCode);
    toast({
      title: t('errors.mediaPlaybackError'),
      description: t('errors.tryAgain'),
      variant: 'destructive'
    });
  };
  
  const onProgressChange = (currentTime: number, duration: number) => {
    return { currentTime, duration };
  };
  
  return {
    onPlayerReady,
    onPlayerStateChange,
    onPlayerError,
    onProgressChange
  };
}
