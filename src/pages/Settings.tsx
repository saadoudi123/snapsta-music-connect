
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('pages.settings.title')}</h1>
        <p className="text-muted-foreground">{t('pages.settings.description')}</p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">{t('pages.settings.tabs.account')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('pages.settings.tabs.appearance')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('pages.settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('pages.settings.tabs.privacy')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.settings.account.profileSettings')}</CardTitle>
              <CardDescription>{t('pages.settings.account.profileDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{t('pages.settings.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.settings.appearance.themeSettings')}</CardTitle>
              <CardDescription>{t('pages.settings.appearance.themeDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">{t('settings.theme')}</Label>
                <ThemeSwitcher />
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <Label htmlFor="language">{t('settings.language')}</Label>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.settings.notifications.notificationSettings')}</CardTitle>
              <CardDescription>{t('pages.settings.notifications.notificationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('pages.settings.notifications.pushNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">{t('pages.settings.notifications.pushDescription')}</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('pages.settings.notifications.emailNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">{t('pages.settings.notifications.emailDescription')}</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.settings.privacy.privacySettings')}</CardTitle>
              <CardDescription>{t('pages.settings.privacy.privacyDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{t('pages.settings.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
