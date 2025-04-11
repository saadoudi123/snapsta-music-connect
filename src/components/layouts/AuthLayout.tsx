
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Globe } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import BrandLogo from '@/components/BrandLogo';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  // If user is already authenticated, redirect to home page
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Branding and info */}
      <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-8">
        <div className="flex flex-col space-y-4">
          <BrandLogo size={48} variant="light" />
          <h1 className="text-3xl font-bold">{t('app.name')}</h1>
          <p className="text-xl">{t('app.slogan')}</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>{t('settings.language')}</span>
            <LanguageSwitcher variant="auth" />
          </div>
          <ThemeSwitcher variant="auth" />
          <p className="text-sm">{t('footer.copyright')}</p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-8">
        <div className="md:hidden flex flex-col items-center mb-8">
          <BrandLogo size={48} />
          <h1 className="text-2xl font-bold mt-2">{t('app.name')}</h1>
          <p>{t('app.slogan')}</p>
          <div className="flex items-center mt-4 space-x-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>

        <div className="md:hidden text-center mt-8">
          <p className="text-xs text-muted-foreground">{t('footer.copyright')}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
