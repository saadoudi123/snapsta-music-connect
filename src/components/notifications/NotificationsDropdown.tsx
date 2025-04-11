
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Heart, MessageSquare, UserPlus, AtSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'follow_request';
  actor: {
    id: string;
    username: string;
    avatar?: string;
  };
  content?: string;
  postId?: string;
  commentId?: string;
  messageId?: string;
  created_at: string;
  read: boolean;
}

const NotificationsDropdown: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        // In a real app, this would fetch from a database
        // Mock data for now
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'like',
            actor: {
              id: 'user1',
              username: 'johndoe',
              avatar: 'https://i.pravatar.cc/150?img=1'
            },
            postId: 'post1',
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
            read: false
          },
          {
            id: '2',
            type: 'comment',
            actor: {
              id: 'user2',
              username: 'janedoe',
              avatar: 'https://i.pravatar.cc/150?img=2'
            },
            content: 'Great post! I really enjoyed it.',
            postId: 'post1',
            commentId: 'comment1',
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            read: false
          },
          {
            id: '3',
            type: 'follow',
            actor: {
              id: 'user3',
              username: 'alex123',
              avatar: 'https://i.pravatar.cc/150?img=3'
            },
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: true
          },
          {
            id: '4',
            type: 'mention',
            actor: {
              id: 'user4',
              username: 'sarah',
              avatar: 'https://i.pravatar.cc/150?img=4'
            },
            content: 'Hey @johndoe, check out this new restaurant!',
            postId: 'post2',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            read: true
          },
          {
            id: '5',
            type: 'message',
            actor: {
              id: 'user5',
              username: 'mike',
              avatar: 'https://i.pravatar.cc/150?img=5'
            },
            content: 'Hey, are you free tomorrow?',
            messageId: 'message1',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
            read: false
          },
          {
            id: '6',
            type: 'follow_request',
            actor: {
              id: 'user6',
              username: 'emma',
              avatar: 'https://i.pravatar.cc/150?img=6'
            },
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
            read: false
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up realtime subscription in a real app
    // const subscription = supabase
    //   .channel('public:notifications')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
    //   .subscribe();
    
    // return () => {
    //   supabase.removeChannel(subscription);
    // };
  }, [user]);
  
  // Mark all as read
  const markAllAsRead = async () => {
    try {
      // In a real app, this would update the database
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Update unread count
    if (!notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    // Navigate based on notification type
    if (notification.type === 'like' || notification.type === 'comment' || notification.type === 'mention') {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.actor.username}`);
    } else if (notification.type === 'message') {
      navigate(`/messages?user=${notification.actor.username}`);
    } else if (notification.type === 'follow_request') {
      // Open follow requests list
      navigate('/notifications?tab=follow_requests');
    }
    
    setIsOpen(false);
  };
  
  // Handle accepting follow request
  const handleAcceptFollowRequest = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // In a real app, this would update the database
      toast({
        title: t('notifications.requestAccepted'),
        description: t('notifications.followRequestAccepted'),
      });
      
      // Remove the notification
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error accepting follow request:', error);
    }
  };
  
  // Handle declining follow request
  const handleDeclineFollowRequest = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // In a real app, this would update the database
      toast({
        title: t('notifications.requestDeclined'),
        description: t('notifications.followRequestDeclined'),
      });
      
      // Remove the notification
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error declining follow request:', error);
    }
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mentions') return notification.type === 'mention';
    if (activeTab === 'likes') return notification.type === 'like';
    if (activeTab === 'comments') return notification.type === 'comment';
    if (activeTab === 'follows') return notification.type === 'follow' || notification.type === 'follow_request';
    if (activeTab === 'messages') return notification.type === 'message';
    return true;
  });
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than a minute
      return t('common.justNow');
    } else if (diff < 3600000) { // Less than an hour
      const minutes = Math.floor(diff / 60000);
      return t('common.minutesAgo', { count: minutes });
    } else if (diff < 86400000) { // Less than a day
      const hours = Math.floor(diff / 3600000);
      return t('common.hoursAgo', { count: hours });
    } else if (diff < 604800000) { // Less than a week
      const days = Math.floor(diff / 86400000);
      return t('common.daysAgo', { count: days });
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Toast for follow requests
  const toast = ({ title, description }: { title: string, description: string }) => {
    console.log(`Toast: ${title} - ${description}`);
    // In a real app, this would show a toast notification
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('notifications.notifications')}</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                {t('notifications.markAllAsRead')}
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="all" className="flex-1">{t('notifications.all')}</TabsTrigger>
            <TabsTrigger value="mentions" className="flex-1">{t('notifications.mentions')}</TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">{t('notifications.likes')}</TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">{t('notifications.comments')}</TabsTrigger>
            <TabsTrigger value="follows" className="flex-1">{t('notifications.follows')}</TabsTrigger>
          </TabsList>
          
          <div className="py-2">
            <TabsContent value="all" className="m-0">
              <NotificationsList 
                notifications={filteredNotifications}
                onNotificationClick={handleNotificationClick}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onDeclineFollowRequest={handleDeclineFollowRequest}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="mentions" className="m-0">
              <NotificationsList 
                notifications={filteredNotifications}
                onNotificationClick={handleNotificationClick}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onDeclineFollowRequest={handleDeclineFollowRequest}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="likes" className="m-0">
              <NotificationsList 
                notifications={filteredNotifications}
                onNotificationClick={handleNotificationClick}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onDeclineFollowRequest={handleDeclineFollowRequest}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="comments" className="m-0">
              <NotificationsList 
                notifications={filteredNotifications}
                onNotificationClick={handleNotificationClick}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onDeclineFollowRequest={handleDeclineFollowRequest}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="follows" className="m-0">
              <NotificationsList 
                notifications={filteredNotifications}
                onNotificationClick={handleNotificationClick}
                onAcceptFollowRequest={handleAcceptFollowRequest}
                onDeclineFollowRequest={handleDeclineFollowRequest}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="p-2 text-center border-t">
          <Button variant="link" size="sm" onClick={() => { navigate('/notifications'); setIsOpen(false); }}>
            {t('notifications.viewAll')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onAcceptFollowRequest: (notificationId: string, e: React.MouseEvent) => void;
  onDeclineFollowRequest: (notificationId: string, e: React.MouseEvent) => void;
  formatTimestamp: (timestamp: string) => string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onNotificationClick,
  onAcceptFollowRequest,
  onDeclineFollowRequest,
  formatTimestamp
}) => {
  const { t } = useTranslation();
  
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="max-h-[400px]">
      <div className="space-y-1 p-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
            onClick={() => onNotificationClick(notification)}
          >
            <div className="flex">
              <div className="mr-3">
                <Avatar>
                  <AvatarImage src={notification.actor.avatar} />
                  <AvatarFallback>{notification.actor.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold">
                      {notification.actor.username}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {formatTimestamp(notification.created_at)}
                    </span>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                  )}
                </div>
                
                <div className="text-sm flex items-center">
                  {notification.type === 'like' && (
                    <>
                      <Heart className="h-3 w-3 text-red-500 mr-1" />
                      <span>{t('notifications.likedPost')}</span>
                    </>
                  )}
                  
                  {notification.type === 'comment' && (
                    <>
                      <MessageSquare className="h-3 w-3 text-blue-500 mr-1" />
                      <span>{t('notifications.commentedPost')}</span>
                    </>
                  )}
                  
                  {notification.type === 'follow' && (
                    <>
                      <UserPlus className="h-3 w-3 text-green-500 mr-1" />
                      <span>{t('notifications.newFollower')}</span>
                    </>
                  )}
                  
                  {notification.type === 'mention' && (
                    <>
                      <AtSign className="h-3 w-3 text-purple-500 mr-1" />
                      <span>{t('notifications.mentionedYou')}</span>
                    </>
                  )}
                  
                  {notification.type === 'message' && (
                    <>
                      <MessageSquare className="h-3 w-3 text-indigo-500 mr-1" />
                      <span>{t('notifications.newMessageFrom', { username: notification.actor.username })}</span>
                    </>
                  )}
                  
                  {notification.type === 'follow_request' && (
                    <>
                      <UserPlus className="h-3 w-3 text-orange-500 mr-1" />
                      <span>{t('notifications.sentRequest', { username: notification.actor.username })}</span>
                    </>
                  )}
                </div>
                
                {notification.content && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {notification.content}
                  </p>
                )}
                
                {notification.type === 'follow_request' && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      className="h-8"
                      onClick={(e) => onAcceptFollowRequest(notification.id, e)}
                    >
                      {t('notifications.acceptRequest')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={(e) => onDeclineFollowRequest(notification.id, e)}
                    >
                      {t('notifications.declineRequest')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationsDropdown;
