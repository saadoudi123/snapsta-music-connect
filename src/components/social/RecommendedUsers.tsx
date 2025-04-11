
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecommendedUsers: React.FC = () => {
  const { t } = useTranslation();

  // Mock recommended users data
  const recommendedUsers = [
    {
      id: 'user1',
      username: 'music_lover',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=11',
      bio: 'Producer & DJ | Music enthusiast',
    },
    {
      id: 'user2',
      username: 'photo_pro',
      name: 'Jessica Lee',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'Photographer | Travel lover',
    },
    {
      id: 'user3',
      username: 'tech_geek',
      name: 'Mike Smith',
      avatar: 'https://i.pravatar.cc/150?img=13',
      bio: 'Software Engineer | Tech enthusiast',
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t('feed.suggestedForYou')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {recommendedUsers.map(user => (
            <div key={user.id} className="flex items-start justify-between">
              <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
              </Link>
              <Button variant="outline" size="sm">
                {t('feed.follow')}
              </Button>
            </div>
          ))}
        </div>
        
        <Button variant="link" size="sm" className="px-0 mt-2">
          {t('feed.seeMore')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendedUsers;
