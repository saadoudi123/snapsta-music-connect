
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailSignupForm from './signup/EmailSignupForm';
import PhoneSignupForm from './signup/PhoneSignupForm';
import AuthSeparator from './signup/AuthSeparator';

const SignupForm: React.FC = () => {
  const { t } = useTranslation();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('auth.signup')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/auth/login" className="underline underline-offset-4 hover:text-primary">
            {t('auth.login')}
          </Link>
        </p>
      </div>

      <Tabs
        defaultValue="email"
        onValueChange={(value) => setAuthMethod(value as 'email' | 'phone')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
          <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <EmailSignupForm />
        </TabsContent>

        <TabsContent value="phone" className="space-y-4">
          <PhoneSignupForm />
        </TabsContent>
      </Tabs>

      <AuthSeparator />

      <div className="text-center">
        <Link
          to="/auth/otp"
          className="text-sm underline-offset-4 hover:underline text-primary"
        >
          {t('auth.continueWith')} OTP
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
