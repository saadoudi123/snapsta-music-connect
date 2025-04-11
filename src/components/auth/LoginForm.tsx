
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

import 'react-phone-number-input/style.css';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { signInWithEmail, signInWithPhone, loading } = useAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);

  // Email login validation schema
  const emailSchema = z.object({
    email: z.string().email(t('auth.errors.invalidEmail')),
    emailPassword: z.string().min(6, t('auth.errors.passwordLength')),
  });

  // Phone login validation schema
  const phoneSchema = z.object({
    phone: z.string().min(8, t('auth.errors.invalidPhone')),
    phonePassword: z.string().min(6, t('auth.errors.passwordLength')),
  });

  // Form for email login
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      emailPassword: '',
    },
  });

  // Form for phone login
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
      phonePassword: '',
    },
  });

  // Submit handlers
  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    await signInWithEmail(values.email, values.emailPassword);
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    await signInWithPhone(values.phone, values.phonePassword);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('auth.login')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.dontHaveAccount')}{' '}
          <Link to="/auth/signup" className="underline underline-offset-4 hover:text-primary">
            {t('auth.signup')}
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

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('auth.enterEmail')}
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="emailPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t('auth.enterPassword')}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Phone Tab */}
        <TabsContent value="phone" className="space-y-4">
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.phone')}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        placeholder={t('auth.enterPhone')}
                        value={field.value}
                        onChange={field.onChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={phoneForm.control}
                name="phonePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t('auth.enterPassword')}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{t('auth.or')}</span>
        </div>
      </div>

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

export default LoginForm;
