
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'auth';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  className
}) => {
  const { i18n, t } = useTranslation();
  const isAuth = variant === 'auth';
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Store the language preference in local storage
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isAuth ? "outline" : "ghost"} 
          size="icon"
          className={cn(className, {
            'border-white/20 text-white hover:bg-white/10 hover:text-white': isAuth && currentTheme === 'dark',
            'border-black/20 text-black hover:bg-black/10 hover:text-black': isAuth && currentTheme === 'light',
          })}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          <span className="mr-2">🇺🇸</span>
          <span>{t('settings.english')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ar')}>
          <span className="mr-2">🇸🇦</span>
          <span>{t('settings.arabic')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')}>
          <span className="mr-2">🇷🇺</span>
          <span>{t('settings.russian')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
