import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';

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
import { useAuth } from '@/contexts/AuthContext';

import 'react-phone-number-input/style.css';
import './phone-input.css';

const OTPForm: React.FC = () => {
  const { t } = useTranslation();
  const { requestOTP, verifyOTP, loading } = useAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [identifier, setIdentifier] = useState('');

  const requestEmailSchema = z.object({
    email: z.string().email(t('auth.errors.invalidEmail')),
  });

  const requestPhoneSchema = z.object({
    phone: z.string().min(8, t('auth.errors.invalidPhone')),
  });

  const verifySchema = z.object({
    code: z.string().min(6, t('auth.errors.codeRequired')),
  });

  const emailRequestForm = useForm<z.infer<typeof requestEmailSchema>>({
    resolver: zodResolver(requestEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const phoneRequestForm = useForm<z.infer<typeof requestPhoneSchema>>({
    resolver: zodResolver(requestPhoneSchema),
    defaultValues: {
      phone: '',
    },
  });

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onEmailRequestSubmit = async (values: z.infer<typeof requestEmailSchema>) => {
    await requestOTP(values.email);
    setIdentifier(values.email);
    setShowVerificationForm(true);
  };

  const onPhoneRequestSubmit = async (values: z.infer<typeof requestPhoneSchema>) => {
    await requestOTP(values.phone);
    setIdentifier(values.phone);
    setShowVerificationForm(true);
  };

  const onVerifySubmit = async (values: z.infer<typeof verifySchema>) => {
    await verifyOTP(identifier, values.code);
  };

  const handleResendOTP = async () => {
    await requestOTP(identifier);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {showVerificationForm ? t('auth.verifyCode') : t('auth.continueWith') + ' OTP'}
        </h1>
        {!showVerificationForm && (
          <p className="text-sm text-muted-foreground">
            {t('auth.sendCode')}
          </p>
        )}
      </div>

      {!showVerificationForm ? (
        <Tabs
          defaultValue="email"
          onValueChange={(value) => setAuthMethod(value as 'email' | 'phone')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
            <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Form {...emailRequestForm}>
              <form onSubmit={emailRequestForm.handleSubmit(onEmailRequestSubmit)} className="space-y-4">
                <FormField
                  control={emailRequestForm.control}
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.sendCode')}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <Form {...phoneRequestForm}>
              <form onSubmit={phoneRequestForm.handleSubmit(onPhoneRequestSubmit)} className="space-y-4">
                <FormField
                  control={phoneRequestForm.control}
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
                          className="phone-input-container flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.sendCode')}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              {t('auth.verificationSent')} {identifier}
            </p>
          </div>
          
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              <FormField
                control={verifyForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.verificationCode')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('auth.enterCode')}
                        type="text"
                        autoComplete="one-time-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('auth.verifyCode')}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button variant="link" onClick={handleResendOTP} disabled={loading}>
              {t('auth.resendCode')}
            </Button>
          </div>

          <div className="text-center">
            <Button variant="link" onClick={() => setShowVerificationForm(false)}>
              {t('common.back')}
            </Button>
          </div>
        </div>
      )}

      <div className="text-center space-y-2">
        <div>
          <Link
            to="/auth/login"
            className="text-sm underline-offset-4 hover:underline text-primary"
          >
            {t('auth.login')}
          </Link>
        </div>
        <div>
          <Link
            to="/auth/signup"
            className="text-sm underline-offset-4 hover:underline text-primary"
          >
            {t('auth.signup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
