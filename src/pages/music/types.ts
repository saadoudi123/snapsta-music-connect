
export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  viewCount?: string;
  likes?: string;
}

export interface Playlist {
  id: string;
  title: string;
  tracks: Track[];
  thumbnail: string;
  createdBy: string;
}
