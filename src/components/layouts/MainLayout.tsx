
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, MessageCircle, Bell, Search, Music, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MobileNav } from '@/components/navigation/MobileNav';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import StoriesBar from '@/components/stories/StoriesBar';
import BottomNav from '@/components/navigation/BottomNav';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import BrandLogo from '@/components/BrandLogo';
import { useIsMobile } from '@/hooks/use-mobile';
import MusicPlayer from '@/components/music/MusicPlayer';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showStoriesBar, setShowStoriesBar] = useState(true);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  useEffect(() => {
    const pathsWithoutStoriesBar = ['/messages', '/music', '/settings', '/notifications', '/search'];
    setShowStoriesBar(!pathsWithoutStoriesBar.some(path => location.pathname.startsWith(path)));

    setShowMusicPlayer(location.pathname.startsWith('/music') && !location.pathname.startsWith('/auth'));
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !user && !location.pathname.startsWith('/auth')) {
      navigate('/auth/login');
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <BrandLogo size={64} />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (location.pathname.startsWith('/auth')) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <BrandLogo />
          </div>
          
          <Sheet>
            <SheetTrigger asChild className="mr-2 md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          
          <div className="flex md:hidden mx-auto">
            <BrandLogo />
          </div>
          
          <div className="hidden md:flex items-center gap-x-6 md:gap-x-8">
            <DesktopNav />
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {showStoriesBar && (
        <div className="border-b py-2 px-4 overflow-x-auto scrollbar-none">
          <StoriesBar />
        </div>
      )}

      <main className="flex-1 container py-4">
        <Outlet />
      </main>

      {showMusicPlayer && <MusicPlayer />}

      {isMobile && <BottomNav />}

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default MainLayout;
