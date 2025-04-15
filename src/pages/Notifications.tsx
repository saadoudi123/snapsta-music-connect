
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';

const Notifications: React.FC = () => {
  const { t } = useTranslation();

  // Example notifications (in a real app, these would come from an API)
  const mockNotifications = [
    {
      id: 1,
      type: 'like',
      user: 'John Doe',
      content: 'liked your post',
      time: '2h ago',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      user: 'Jane Smith',
      content: 'commented on your post',
      time: '5h ago',
      read: true,
    },
    {
      id: 3,
      type: 'follow',
      user: 'Mike Johnson',
      content: 'started following you',
      time: '1d ago',
      read: true,
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('pages.notifications.title')}</h1>
        <p className="text-muted-foreground">{t('pages.notifications.description')}</p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">{t('pages.notifications.tabs.all')}</TabsTrigger>
          <TabsTrigger value="mentions">{t('pages.notifications.tabs.mentions')}</TabsTrigger>
          <TabsTrigger value="unread">{t('pages.notifications.tabs.unread')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4">
          {mockNotifications.length > 0 ? (
            mockNotifications.map((notification) => (
              <Card key={notification.id} className={`p-4 flex items-center ${!notification.read ? 'bg-muted/30' : ''}`}>
                <div className="mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.user}</span> {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('pages.notifications.noNotifications')}</p>
          )}
        </TabsContent>
        
        <TabsContent value="mentions" className="mt-4">
          <p className="text-center text-muted-foreground py-8">{t('pages.notifications.noMentions')}</p>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-4">
          {mockNotifications.filter(n => !n.read).length > 0 ? (
            mockNotifications.filter(n => !n.read).map((notification) => (
              <Card key={notification.id} className="p-4 flex items-center bg-muted/30">
                <div className="mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.user}</span> {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('pages.notifications.noUnread')}</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
