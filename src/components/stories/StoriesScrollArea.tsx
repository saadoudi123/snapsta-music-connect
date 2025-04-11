
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import StoryCard from './StoryCard';
import { User } from '@/hooks/use-stories';

interface StoriesScrollAreaProps {
  usersWithStories: (User & {
    hasStory: boolean;
    hasUnviewed: boolean;
  })[];
  onCreateStory: () => void;
  onViewStory: (userIndex: number) => void;
}

const StoriesScrollArea: React.FC<StoriesScrollAreaProps> = ({
  usersWithStories,
  onCreateStory,
  onViewStory
}) => {
  return (
    <ScrollArea className="w-full pb-2">
      <div className="flex space-x-4 px-4 py-2">
        {usersWithStories.map((user, index) => (
          <StoryCard
            key={user.id}
            username={user.username}
            avatar={user.avatar_url}
            hasStory={user.hasStory}
            hasUnviewed={user.hasUnviewed}
            isOwn={user.id === usersWithStories[0]?.id}
            onClick={() => user.id === usersWithStories[0]?.id && !user.hasStory 
              ? onCreateStory() 
              : onViewStory(index)
            }
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default StoriesScrollArea;
