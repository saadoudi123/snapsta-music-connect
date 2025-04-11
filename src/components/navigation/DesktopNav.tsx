
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  MessageCircle, 
  Bell, 
  Music, 
  User, 
  Search,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DesktopNav: React.FC = () => {
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
      icon: Search,
      label: t('navigation.explore'),
      href: '/search',
    },
    {
      icon: User,
      label: t('navigation.profile'),
      href: '/profile',
    },
    {
      icon: Settings,
      label: t('navigation.settings'),
      href: '/settings',
    },
  ];

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== '/' && location.pathname.startsWith(item.href));
          
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn("flex items-center gap-2 text-sm", {
                "bg-primary/10 text-primary hover:bg-primary/20": isActive && !location.pathname.startsWith('/music'),
                "bg-accent/10 text-accent hover:bg-accent/20": isActive && location.pathname.startsWith('/music'),
              })}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
