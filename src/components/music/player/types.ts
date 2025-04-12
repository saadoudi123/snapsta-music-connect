
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  videoId?: string;
}

export enum YouTubePlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}
