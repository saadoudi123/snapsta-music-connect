
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoryViewer from './StoryViewer';
import CreateStoryForm from './CreateStoryForm';
import StoriesScrollArea from './StoriesScrollArea';
import { useStories, type Story } from '@/hooks/use-stories';
import { useAuth } from '@/contexts/AuthContext';

interface StoriesContainerProps {
  className?: string;
}

const StoriesContainer: React.FC<StoriesContainerProps> = ({ className }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { usersWithStories, users, stories, updateStories } = useStories();
  
  const [viewingStories, setViewingStories] = useState<boolean>(false);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
  const [showCreateStory, setShowCreateStory] = useState<boolean>(false);
  
  const handleViewStory = (userIndex: number) => {
    setCurrentUserIndex(userIndex);
    setViewingStories(true);
  };
  
  const handleCloseStoryViewer = () => {
    setViewingStories(false);
  };
  
  const handleCreateStory = () => {
    setShowCreateStory(true);
  };
  
  const handleStoryCreated = (story: Story) => {
    if (user) {
      updateStories(user.id, story);
    }
    setShowCreateStory(false);
  };
  
  return (
    <div className={className}>
      <StoriesScrollArea 
        usersWithStories={usersWithStories}
        onCreateStory={handleCreateStory}
        onViewStory={handleViewStory}
      />
      
      {viewingStories && (
        <StoryViewer
          users={users}
          stories={stories}
          initialUserIndex={currentUserIndex}
          onClose={handleCloseStoryViewer}
        />
      )}
      
      {showCreateStory && (
        <CreateStoryForm
          onStoryCreated={handleStoryCreated}
          onCancel={() => setShowCreateStory(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default StoriesContainer;
