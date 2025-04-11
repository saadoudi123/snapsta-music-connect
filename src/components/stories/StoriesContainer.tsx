import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import StoryCard from './StoryCard';
import StoryViewer from './StoryViewer';
import CreateStoryForm from './CreateStoryForm';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  backgroundStyle?: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  reactions: any[];
  replies: any[];
  hasViewed: boolean;
}

const StoriesContainer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [usersWithStories, setUsersWithStories] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [selectedUserStories, setSelectedUserStories] = useState<Story[]>([]);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [hasCurrentUserStory, setHasCurrentUserStory] = useState(false);
  
  // Fetch stories on mount
  useEffect(() => {
    if (!user) return;
    
    const fetchStories = async () => {
      try {
        // Get current stories (not expired)
        const { data: storiesData, error: storiesError } = await supabase
          .from('stories')
          .select(`
            id, 
            content, 
            media_url, 
            media_type, 
            background_style, 
            created_at, 
            expires_at,
            user_id,
            profiles(id, username, avatar_url)
          `)
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });
        
        if (storiesError) throw storiesError;
        
        if (!storiesData || storiesData.length === 0) {
          setStories([]);
          setUsersWithStories([]);
          return;
        }
        
        // Get views for current user
        const { data: viewsData, error: viewsError } = await supabase
          .from('story_views')
          .select('story_id')
          .eq('user_id', user.id);
        
        if (viewsError) throw viewsError;
        
        const viewedStoryIds = new Set((viewsData || []).map(v => v.story_id));
        
        // Get view counts for each story
        const { data: viewCountData, error: viewCountError } = await supabase
          .from('story_views')
          .select('story_id, count')
          .order('count', { ascending: false });
        
        if (viewCountError) throw viewCountError;
        
        const viewCounts = (viewCountData || []).reduce((acc, curr) => {
          acc[curr.story_id] = curr.count;
          return acc;
        }, {} as Record<string, number>);
        
        // Transform data
        const formattedStories = storiesData.map(story => ({
          id: story.id,
          userId: story.user_id,
          username: story.profiles?.username || 'Unknown',
          userAvatar: story.profiles?.avatar_url || '',
          content: story.content,
          mediaUrl: story.media_url,
          mediaType: story.media_type,
          backgroundStyle: story.background_style,
          createdAt: story.created_at,
          expiresAt: story.expires_at,
          viewCount: viewCounts[story.id] || 0,
          reactions: [],
          replies: [],
          hasViewed: viewedStoryIds.has(story.id)
        }));
        
        // Group stories by user
        const userMap = new Map<string, User>();
        
        formattedStories.forEach(story => {
          if (!userMap.has(story.userId)) {
            userMap.set(story.userId, {
              id: story.userId,
              username: story.username,
              avatar_url: story.userAvatar
            });
          }
        });
        
        // Check if current user has stories
        setHasCurrentUserStory(formattedStories.some(story => story.userId === user.id));
        
        setStories(formattedStories);
        setUsersWithStories(Array.from(userMap.values()));
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
    
    fetchStories();
    
    // Set up real-time subscription for new stories
    const storiesSubscription = supabase
      .channel('public:stories')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'stories' }, 
        () => {
          fetchStories();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(storiesSubscription);
    };
  }, [user]);
  
  const handleStoryCardClick = (userIndex: number) => {
    // If it's the current user and they have no story, show create form
    if (userIndex === 0 && !hasCurrentUserStory && usersWithStories[0]?.id === user?.id) {
      setShowCreateStory(true);
      return;
    }
    
    setSelectedUserIndex(userIndex);
    setSelectedStoryIndex(0);
    
    // Get stories for selected user
    const userStories = stories.filter(story => story.userId === usersWithStories[userIndex].id);
    setSelectedUserStories(userStories);
  };
  
  const handleStoryCreated = () => {
    setShowCreateStory(false);
    // Refetch will happen through subscription
  };
  
  const handleCloseViewer = () => {
    setSelectedUserIndex(null);
    setSelectedUserStories([]);
  };
  
  const handleNextStory = () => {
    if (selectedStoryIndex < selectedUserStories.length - 1) {
      setSelectedStoryIndex(prev => prev + 1);
    } else {
      // Move to next user's stories
      if (selectedUserIndex !== null && selectedUserIndex < usersWithStories.length - 1) {
        const nextUserIndex = selectedUserIndex + 1;
        setSelectedUserIndex(nextUserIndex);
        setSelectedStoryIndex(0);
        
        const nextUserStories = stories.filter(story => story.userId === usersWithStories[nextUserIndex].id);
        setSelectedUserStories(nextUserStories);
      } else {
        // No more stories, close viewer
        handleCloseViewer();
      }
    }
  };
  
  const handlePrevStory = () => {
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(prev => prev - 1);
    } else {
      // Move to previous user's stories
      if (selectedUserIndex !== null && selectedUserIndex > 0) {
        const prevUserIndex = selectedUserIndex - 1;
        setSelectedUserIndex(prevUserIndex);
        
        const prevUserStories = stories.filter(story => story.userId === usersWithStories[prevUserIndex].id);
        setSelectedUserStories(prevUserStories);
        setSelectedStoryIndex(prevUserStories.length - 1);
      }
    }
  };
  
  // Sort users to show current user first, then users with unviewed stories
  const sortedUsers = [...usersWithStories].sort((a, b) => {
    // Current user always first
    if (a.id === user?.id) return -1;
    if (b.id === user?.id) return 1;
    
    // Then users with unviewed stories
    const aHasUnviewed = stories.some(s => s.userId === a.id && !s.hasViewed);
    const bHasUnviewed = stories.some(s => s.userId === b.id && !s.hasViewed);
    
    if (aHasUnviewed && !bHasUnviewed) return -1;
    if (!aHasUnviewed && bHasUnviewed) return 1;
    
    return 0;
  });
  
  return (
    <div className="mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 p-4">
          {/* Add your story */}
          {user && (
            <StoryCard
              username={user.email?.split('@')[0] || 'You'}
              avatar={user.user_metadata?.avatar_url}
              hasStory={hasCurrentUserStory}
              isOwn={true}
              onClick={() => handleStoryCardClick(0)}
            />
          )}
          
          {/* Other users' stories */}
          {sortedUsers
            .filter(u => u.id !== user?.id) // Filter out current user as we already show them first
            .map((storyUser, index) => {
              const userStories = stories.filter(s => s.userId === storyUser.id);
              const hasUnviewed = userStories.some(s => !s.hasViewed);
              
              return (
                <StoryCard
                  key={storyUser.id}
                  id={storyUser.id}
                  username={storyUser.username}
                  avatar={storyUser.avatar_url}
                  hasStory={true}
                  hasUnviewed={hasUnviewed}
                  onClick={() => handleStoryCardClick(index + 1)} // +1 because index 0 is current user
                />
              );
            })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Story viewer */}
      {selectedUserIndex !== null && selectedUserStories.length > 0 && (
        <StoryViewer
          stories={selectedUserStories}
          currentIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
          onPrev={handlePrevStory}
          onNext={handleNextStory}
        />
      )}
      
      {/* Create story form */}
      {showCreateStory && (
        <CreateStoryForm
          onSuccess={handleStoryCreated}
          onCancel={() => setShowCreateStory(false)}
        />
      )}
    </div>
  );
};

export default StoriesContainer;
