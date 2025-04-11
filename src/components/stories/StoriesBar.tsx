
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// This is a placeholder component for the stories feature
// In a real implementation, we would fetch stories from Supabase
const StoriesBar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Mocked stories data
  const stories = [
    { id: 'your-story', username: t('stories.yourStory'), avatar: '', hasStory: false, viewed: false },
    { id: '1', username: 'sarah', avatar: 'https://i.pravatar.cc/150?img=1', hasStory: true, viewed: false },
    { id: '2', username: 'john', avatar: 'https://i.pravatar.cc/150?img=2', hasStory: true, viewed: false },
    { id: '3', username: 'michael', avatar: 'https://i.pravatar.cc/150?img=3', hasStory: true, viewed: true },
    { id: '4', username: 'emily', avatar: 'https://i.pravatar.cc/150?img=4', hasStory: true, viewed: true },
    { id: '5', username: 'alex', avatar: 'https://i.pravatar.cc/150?img=5', hasStory: true, viewed: false },
    { id: '6', username: 'sophia', avatar: 'https://i.pravatar.cc/150?img=6', hasStory: true, viewed: false },
    { id: '7', username: 'david', avatar: 'https://i.pravatar.cc/150?img=7', hasStory: true, viewed: true },
  ];
  
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  
  const handleStoryClick = (storyId: string) => {
    if (storyId === 'your-story') {
      // Handle creating a new story
      console.log('Create a new story');
    } else {
      // Handle viewing a story
      console.log('View story', storyId);
      
      // Mark story as viewed
      if (!viewedStories.includes(storyId)) {
        setViewedStories([...viewedStories, storyId]);
      }
    }
  };
  
  const isStoryViewed = (storyId: string, originallyViewed: boolean) => {
    return viewedStories.includes(storyId) || originallyViewed;
  };

  return (
    <div className="flex items-center space-x-4 py-2 overflow-x-auto scrollbar-none">
      {stories.map((story) => (
        <Button
          key={story.id}
          variant="ghost"
          className="flex flex-col items-center p-0 space-y-1"
          onClick={() => handleStoryClick(story.id)}
        >
          <div className={cn(
            "rounded-full p-[2px]",
            {
              'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500': story.hasStory && !isStoryViewed(story.id, story.viewed),
              'bg-gray-300 dark:bg-gray-600': !story.hasStory || isStoryViewed(story.id, story.viewed)
            }
          )}>
            <div className="bg-background rounded-full p-[2px]">
              <Avatar className="h-14 w-14 border-2 border-background">
                {story.id === 'your-story' ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={story.avatar} alt={story.username} />
                    <AvatarFallback>{story.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </>
                )}
              </Avatar>
            </div>
          </div>
          <span className="text-xs truncate max-w-[64px]">
            {story.id === 'your-story' ? t('stories.yourStory') : story.username}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default StoriesBar;
