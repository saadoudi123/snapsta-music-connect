
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

const StoryNavigation: React.FC<StoryNavigationProps> = ({ onPrevious, onNext }) => {
  return (
    <>
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
        onClick={onPrevious}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
        onClick={onNext}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </>
  );
};

export default StoryNavigation;
