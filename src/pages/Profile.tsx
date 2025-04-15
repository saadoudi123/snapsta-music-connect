
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4 pb-6 pt-4 md:flex-row md:space-y-0 md:space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg" alt={user?.email || "User"} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user?.email || t('pages.profile.user')}</h1>
          <p className="text-sm text-muted-foreground">{t('pages.profile.memberSince')}</p>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts">{t('pages.profile.tabs.posts')}</TabsTrigger>
          <TabsTrigger value="about">{t('pages.profile.tabs.about')}</TabsTrigger>
          <TabsTrigger value="friends">{t('pages.profile.tabs.friends')}</TabsTrigger>
          <TabsTrigger value="photos">{t('pages.profile.tabs.photos')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">{t('pages.profile.noPosts')}</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="mt-6">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">{t('pages.profile.noInfo')}</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="friends" className="mt-6">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">{t('pages.profile.noFriends')}</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos" className="mt-6">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">{t('pages.profile.noPhotos')}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
