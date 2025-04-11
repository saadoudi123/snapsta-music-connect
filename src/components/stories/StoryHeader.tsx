
import React from 'react';
import { X, Pause, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

interface StoryHeaderProps {
  user: User;
  createdAt: string;
  isPaused: boolean;
  onTogglePause: () => void;
  onClose: () => void;
}

const StoryHeader: React.FC<StoryHeaderProps> = ({
  user,
  createdAt,
  isPaused,
  onTogglePause,
  onClose
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours >= 1) {
      return `${diffHours}h`;
    } else {
      return `${diffMins}m`;
    }
  };

  return (
    <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2 border border-primary">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white text-sm font-medium">{user.username}</p>
          <p className="text-white/70 text-xs">
            {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={onTogglePause}
        >
          {isPaused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default StoryHeader;
