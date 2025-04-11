
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import StoryProgress from './StoryProgress';
import StoryHeader from './StoryHeader';
import StoryNavigation from './StoryNavigation';
import StoryFooter from './StoryFooter';
import StoryReactions from './StoryReactions';

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
  const { user: authUser } = useAuth();
  const isMobile = useIsMobile();
  
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const progressIntervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeUsers = users.filter(user => stories[user.id]?.length > 0);
  const storyUser = activeUsers[currentUserIndex];
  const userStories = storyUser ? stories[storyUser.id] || [] : [];
  const currentStory = userStories[currentStoryIndex];
  const isOwnStory = storyUser?.id === authUser?.id;
  
  useEffect(() => {
    startProgressTimer();
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentUserIndex, currentStoryIndex, isPaused]);
  
  useEffect(() => {
    setProgress(0);
  }, [currentUserIndex, currentStoryIndex]);
  
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
  
  useEffect(() => {
    if (currentStory && storyUser) {
      console.log(`Marking story ${currentStory.id} as viewed by ${storyUser?.id}`);
    }
  }, [currentStory, storyUser]);
  
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
  
  const handleReplySubmit = (replyText: string) => {
    console.log(`Sending reply to ${storyUser?.username}: ${replyText}`);
    alert(`Reply sent: ${replyText}`);
  };
  
  const handleReaction = (reaction: string) => {
    console.log(`Adding reaction ${reaction} to story ${currentStory?.id}`);
    alert(`Reaction added: ${reaction}`);
  };
  
  if (!storyUser || !currentStory) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div 
        ref={containerRef}
        className="relative h-full max-h-[90vh] w-full max-w-md mx-auto overflow-hidden bg-black"
      >
        <div className="relative h-full w-full">
          <img 
            src={currentStory.media_url} 
            alt="Story" 
            className="h-full w-full object-cover"
          />
          
          <StoryProgress 
            totalStories={userStories.length}
            currentIndex={currentStoryIndex}
            progress={progress}
          />
          
          <StoryHeader 
            user={storyUser}
            createdAt={currentStory.created_at}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            onClose={onClose}
          />
          
          <StoryNavigation 
            onPrevious={goToPreviousStory}
            onNext={goToNextStory}
          />
          
          {currentStory.caption && (
            <div className="absolute bottom-24 left-0 right-0 px-4">
              <p className="text-white text-center">{currentStory.caption}</p>
            </div>
          )}
          
          <StoryFooter 
            isOwnStory={isOwnStory}
            viewCount={currentStory.view_count}
            viewers={currentStory.viewers}
            onReplySubmit={handleReplySubmit}
          />
          
          <StoryReactions 
            isOwnStory={isOwnStory}
            onReaction={handleReaction}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
