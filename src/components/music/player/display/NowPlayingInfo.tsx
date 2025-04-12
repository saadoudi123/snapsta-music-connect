
import React from 'react';
import { Song } from '../types';

interface NowPlayingInfoProps {
  currentSong: Song;
}

const NowPlayingInfo: React.FC<NowPlayingInfoProps> = ({ currentSong }) => {
  return (
    <>
      <img 
        src={currentSong.thumbnail} 
        alt={currentSong.title} 
        className="w-48 h-48 rounded-lg shadow-lg mb-6 object-cover"
      />
      
      <h2 className="text-xl font-bold mb-1">{currentSong.title}</h2>
      <p className="text-muted-foreground mb-6">{currentSong.artist}</p>
    </>
  );
};

export default NowPlayingInfo;
