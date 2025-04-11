
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  variant?: 'default' | 'auth';
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = 'default',
  className
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const isAuth = variant === 'auth';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isAuth ? "outline" : "ghost"} 
          size="icon"
          className={cn(className, {
            'border-white/20 text-white hover:bg-white/10 hover:text-white': isAuth && resolvedTheme === 'dark',
            'border-black/20 text-black hover:bg-black/10 hover:text-black': isAuth && resolvedTheme === 'light',
          })}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : resolvedTheme === 'light' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{t('settings.lightMode')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{t('settings.darkMode')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('comfort')}>
          <EyeIcon className="mr-2 h-4 w-4" />
          <span>{t('settings.eyeComfort')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <span className="mr-2">💻</span>
          <span>{t('settings.autoTheme')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
