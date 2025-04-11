
import React from 'react';

interface StoryProgressProps {
  totalStories: number;
  currentIndex: number;
  progress: number;
}

const StoryProgress: React.FC<StoryProgressProps> = ({
  totalStories,
  currentIndex,
  progress
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex px-2 pt-2 space-x-1">
      {Array.from({ length: totalStories }).map((_, index) => (
        <div 
          key={index} 
          className="h-1 rounded-full flex-1 bg-white/30 overflow-hidden"
        >
          {index === currentIndex && (
            <div 
              className="h-full bg-white" 
              style={{ width: `${progress}%` }}
            />
          )}
          {index < currentIndex && (
            <div className="h-full bg-white w-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StoryProgress;
