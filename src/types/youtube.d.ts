
// Type definitions for YouTube IFrame API
interface YT {
  Player: {
    new (
      elementId: string | HTMLDivElement,
      options: {
        height?: string | number;
        width?: string | number;
        videoId?: string;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          disablekb?: 0 | 1;
          enablejsapi?: 0 | 1;
          fs?: 0 | 1;
          loop?: 0 | 1;
          modestbranding?: 0 | 1;
          playsinline?: 0 | 1;
          rel?: 0 | 1;
          showinfo?: 0 | 1;
          start?: number;
          end?: number;
          origin?: string;
          playlist?: string;
        };
        events?: {
          onReady?: (event: YT.PlayerEvent) => void;
          onStateChange?: (event: YT.PlayerStateEvent) => void;
          onPlaybackQualityChange?: (event: YT.PlayerEvent) => void;
          onPlaybackRateChange?: (event: YT.PlayerEvent) => void;
          onError?: (event: YT.PlayerErrorEvent) => void;
          onApiChange?: (event: YT.PlayerEvent) => void;
        };
      }
    ): YT.Player;
  };
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare namespace YT {
  interface PlayerEvent {
    target: Player;
    data: any;
  }
  
  interface PlayerStateEvent {
    target: Player;
    data: number;
  }
  
  interface PlayerErrorEvent {
    target: Player;
    data: number;
  }

  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    mute(): void;
    unMute(): void;
    getPlayerState(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoData(): { video_id: string };
    setVolume(volume: number): void;
    getVolume(): number;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    destroy(): void;
  }
}

interface Window {
  YT?: YT;
  onYouTubeIframeAPIReady?: () => void;
}
