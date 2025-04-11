
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/social/PostCard';
import CreatePostForm from '@/components/social/CreatePostForm';
import RecommendedUsers from '@/components/social/RecommendedUsers';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Mock posts data
  const posts = [
    {
      id: '1',
      user: {
        id: 'user1',
        username: 'sarah_connor',
        name: 'Sarah Connor',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: 'Just visited the most amazing café in town! The atmosphere was perfect for getting some work done. ☕️💻 #cafelife #remotework',
      media: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'],
      likes: 42,
      comments: 7,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      liked: false
    },
    {
      id: '2',
      user: {
        id: 'user2',
        username: 'john_doe',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      content: 'Just released my new track! Check it out and let me know what you think 🎵🎧 #newmusic #producer',
      media: [],
      likes: 128,
      comments: 24,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      liked: true
    },
    {
      id: '3',
      user: {
        id: 'user3',
        username: 'emily_rose',
        name: 'Emily Rose',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'Beautiful sunset at the beach today 🌅 #nofilter #beach #sunset',
      media: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjBzdW5zZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBzdW5zZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
      ],
      likes: 256,
      comments: 32,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      liked: false
    }
  ];

  return (
    <div className="pb-16 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main feed column */}
        <div className="md:col-span-2 space-y-6">
          <CreatePostForm />
          
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="hidden md:block space-y-6">
          <RecommendedUsers />
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{t('feed.trending')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">#musiclife</span>
                  <span className="text-xs text-muted-foreground">2.5K posts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">#summervibe</span>
                  <span className="text-xs text-muted-foreground">1.8K posts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">#photography</span>
                  <span className="text-xs text-muted-foreground">1.2K posts</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-xs text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
