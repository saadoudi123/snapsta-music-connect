
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Heart, Send, MessageCircle, Pause, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  caption?: string;
  created_at: string;
  expires_at: string;
  view_count: number;
  viewers: string[];
  reactions: { [key: string]: number };
}

interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

interface StoryViewerProps {
  users: User[];
  stories: Record<string, Story[]>;
  initialUserIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  users,
  stories,
  initialUserIndex,
  onClose
}) => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const isMobile = useIsMobile();
  
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [showViewers, setShowViewers] = useState(false);
  
  const progressIntervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeUsers = users.filter(user => stories[user.id]?.length > 0);
  const currentUser = activeUsers[currentUserIndex];
  const userStories = currentUser ? stories[currentUser.id] || [] : [];
  const currentStory = userStories[currentStoryIndex];
  const isOwnStory = currentUser?.id === currentUser?.id;
  
  // Initialize story progress timer
  useEffect(() => {
    startProgressTimer();
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentUserIndex, currentStoryIndex, isPaused]);
  
  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentUserIndex, currentStoryIndex]);
  
  // Detect when outside is clicked to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Mark story as viewed
  useEffect(() => {
    if (currentStory && currentUser) {
      // In a real app, this would send an API request to mark story as viewed
      console.log(`Marking story ${currentStory.id} as viewed by ${currentUser?.id}`);
    }
  }, [currentStory, currentUser]);
  
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
  
  const startProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    if (!isPaused) {
      const interval = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.333; // Update 3 times per second for a 5 second total duration
          
          if (newProgress >= 100) {
            goToNextStory();
            return 0;
          }
          
          return newProgress;
        });
      }, 50);
      
      progressIntervalRef.current = interval;
    }
  };
  
  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      const prevUserIndex = currentUserIndex - 1;
      setCurrentUserIndex(prevUserIndex);
      const prevUserStories = stories[activeUsers[prevUserIndex].id] || [];
      setCurrentStoryIndex(prevUserStories.length - 1);
    }
  };
  
  const goToNextStory = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < activeUsers.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose(); // We've reached the end of all stories
    }
  };
  
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    // In a real app, this would send the reply to the server
    console.log(`Sending reply to ${currentUser?.username}: ${replyText}`);
    alert(`Reply sent: ${replyText}`);
    setReplyText('');
  };
  
  const handleReaction = (reaction: string) => {
    // In a real app, this would add the reaction to the server
    console.log(`Adding reaction ${reaction} to story ${currentStory?.id}`);
    alert(`Reaction added: ${reaction}`);
  };
  
  if (!currentUser || !currentStory) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div 
        ref={containerRef}
        className="relative h-full max-h-[90vh] w-full max-w-md mx-auto overflow-hidden bg-black"
      >
        {/* Story image/video */}
        <div className="relative h-full w-full">
          <img 
            src={currentStory.media_url} 
            alt="Story" 
            className="h-full w-full object-cover"
          />
          
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 flex px-2 pt-2 space-x-1">
            {userStories.map((_, index) => (
              <div 
                key={index} 
                className="h-1 rounded-full flex-1 bg-white/30 overflow-hidden"
              >
                {index === currentStoryIndex && (
                  <div 
                    className="h-full bg-white" 
                    style={{ width: `${progress}%` }}
                  />
                )}
                {index < currentStoryIndex && (
                  <div className="h-full bg-white w-full" />
                )}
              </div>
            ))}
          </div>
          
          {/* User info */}
          <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border border-primary">
                <AvatarImage src={currentUser.avatar_url} />
                <AvatarFallback>{currentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium">{currentUser.username}</p>
                <p className="text-white/70 text-xs">
                  {formatTimeAgo(currentStory.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsPaused(!isPaused)}
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
          
          {/* Navigation controls */}
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
            onClick={goToPreviousStory}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
            onClick={goToNextStory}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
          
          {/* Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-24 left-0 right-0 px-4">
              <p className="text-white text-center">{currentStory.caption}</p>
            </div>
          )}
          
          {/* Story interactions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            {isOwnStory ? (
              <div>
                <Button 
                  variant="ghost" 
                  className="text-white text-sm"
                  onClick={() => setShowViewers(!showViewers)}
                >
                  <span className="flex items-center">
                    {t('stories.viewedBy')} {currentStory.view_count}
                  </span>
                </Button>
                
                {showViewers && (
                  <div className="mt-2 bg-black/70 rounded-lg p-2">
                    {currentStory.viewers.length > 0 ? (
                      <div>
                        {/* Viewer list would go here */}
                        <p className="text-white text-xs">Viewers will be shown here</p>
                      </div>
                    ) : (
                      <p className="text-white text-xs">{t('stories.noViewersYet')}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleReplySubmit} className="flex items-center space-x-2">
                <Input 
                  placeholder={t('stories.replyToStory')}
                  className="bg-white/20 border-none text-white placeholder:text-white/70"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-white bg-white/20"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
          
          {/* Reaction buttons (only shown for others' stories) */}
          {!isOwnStory && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/20 text-white"
                onClick={() => handleReaction('❤️')}
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/20 text-white"
                onClick={() => handleReaction('👍')}
              >
                <span className="text-xl">👍</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/20 text-white"
                onClick={() => handleReaction('😮')}
              >
                <span className="text-xl">😮</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
