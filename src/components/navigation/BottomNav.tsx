
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  MessageCircle, 
  Bell, 
  Music, 
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: t('navigation.home'),
      href: '/',
    },
    {
      icon: MessageCircle,
      label: t('navigation.messages'),
      href: '/messages',
    },
    {
      icon: Bell,
      label: t('navigation.notifications'),
      href: '/notifications',
    },
    {
      icon: Music,
      label: t('navigation.music'),
      href: '/music',
    },
    {
      icon: User,
      label: t('navigation.profile'),
      href: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
            
          return (
            <Link key={item.href} to={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn("w-full h-full rounded-none flex flex-col items-center justify-center gap-1", {
                  "text-primary": isActive && !location.pathname.startsWith('/music'),
                  "text-accent": isActive && location.pathname.startsWith('/music'),
                  "text-muted-foreground": !isActive,
                })}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
