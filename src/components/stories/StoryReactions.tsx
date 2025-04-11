
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryReactionsProps {
  isOwnStory: boolean;
  onReaction: (reaction: string) => void;
}

const StoryReactions: React.FC<StoryReactionsProps> = ({ isOwnStory, onReaction }) => {
  if (isOwnStory) {
    return null;
  }
  
  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white/20 text-white"
        onClick={() => onReaction('❤️')}
      >
        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white/20 text-white"
        onClick={() => onReaction('👍')}
      >
        <span className="text-xl">👍</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white/20 text-white"
        onClick={() => onReaction('😮')}
      >
        <span className="text-xl">😮</span>
      </Button>
    </div>
  );
};

export default StoryReactions;
