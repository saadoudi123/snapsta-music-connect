
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import StoryCard from './StoryCard';
import StoryViewer from './StoryViewer';
import CreateStoryForm from './CreateStoryForm';
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

interface StoriesContainerProps {
  className?: string;
}

const StoriesContainer: React.FC<StoriesContainerProps> = ({ className }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Record<string, Story[]>>({});
  const [viewingStories, setViewingStories] = useState<boolean>(false);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
  const [showCreateStory, setShowCreateStory] = useState<boolean>(false);
  
  // Fetch users with stories
  useEffect(() => {
    const fetchUsers = async () => {
      // In a real app, this would be an API call to fetch users with active stories
      // For demo, we'll create mock data
      
      const mockUsers: User[] = [
        {
          id: 'user-1',
          username: 'johndoe',
          avatar_url: 'https://i.pravatar.cc/300?img=1'
        },
        {
          id: 'user-2',
          username: 'janedoe',
          avatar_url: 'https://i.pravatar.cc/300?img=5'
        },
        {
          id: 'user-3',
          username: 'mike_smith',
          avatar_url: 'https://i.pravatar.cc/300?img=3'
        },
        {
          id: 'user-4',
          username: 'sarah_j',
          avatar_url: 'https://i.pravatar.cc/300?img=9'
        },
        {
          id: 'user-5',
          username: 'alex_p',
          avatar_url: 'https://i.pravatar.cc/300?img=7'
        }
      ];
      
      if (user) {
        // Add the current user to the beginning of the list
        mockUsers.unshift({
          id: user.id,
          username: user.email?.split('@')[0] || 'me',
          avatar_url: user.user_metadata?.avatar_url || undefined
        });
      }
      
      setUsers(mockUsers);
      
      // Generate mock stories for each user
      const mockStories: Record<string, Story[]> = {};
      
      mockUsers.forEach((user) => {
        if (user.id !== 'user-1') { // Skip the first user to demonstrate users without stories
          const storyCount = Math.floor(Math.random() * 3) + 1;
          mockStories[user.id] = Array(storyCount).fill(null).map((_, i) => {
            const createdAt = new Date();
            createdAt.setHours(createdAt.getHours() - Math.random() * 23);
            
            const expiresAt = new Date(createdAt);
            expiresAt.setHours(expiresAt.getHours() + 24);
            
            return {
              id: `story-${user.id}-${i}`,
              user_id: user.id,
              media_url: `https://source.unsplash.com/random/1080x1920?sig=${user.id}-${i}`,
              caption: Math.random() > 0.5 ? `This is my story ${i + 1}!` : undefined,
              created_at: createdAt.toISOString(),
              expires_at: expiresAt.toISOString(),
              view_count: Math.floor(Math.random() * 50),
              viewers: [],
              reactions: {
                '❤️': Math.floor(Math.random() * 10),
                '👍': Math.floor(Math.random() * 7),
                '😮': Math.floor(Math.random() * 5)
              }
            };
          });
        }
      });
      
      setStories(mockStories);
    };
    
    fetchUsers();
  }, [user]);
  
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
      setStories(prev => ({
        ...prev,
        [user.id]: [story, ...(prev[user.id] || [])]
      }));
    }
    setShowCreateStory(false);
  };
  
  const usersWithStories = users.map(user => ({
    ...user,
    hasStory: !!stories[user.id]?.length,
    hasUnviewed: !!stories[user.id]?.some(story => !story.viewers.includes(user?.id || ''))
  }));
  
  return (
    <div className={className}>
      <ScrollArea className="w-full pb-2">
        <div className="flex space-x-4 px-4 py-2">
          {usersWithStories.map((user, index) => (
            <StoryCard
              key={user.id}
              username={user.username}
              avatar={user.avatar_url}
              hasStory={user.hasStory}
              hasUnviewed={user.hasUnviewed}
              isOwn={user.id === users[0]?.id}
              onClick={() => user.id === users[0]?.id && !user.hasStory 
                ? handleCreateStory() 
                : handleViewStory(index)
              }
            />
          ))}
        </div>
      </ScrollArea>
      
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
