
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  MessageCircle,
  Bell,
  Search,
  Music,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export const MobileNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { signOut } = useAuth();

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
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex h-14 items-center border-b px-4">
        <BrandLogo />
      </div>
      <nav className="grid gap-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
            
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${isActive ? 'bg-muted font-medium' : ''}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 py-2">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );
};
