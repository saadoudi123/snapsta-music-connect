import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';
import { Lock, EyeOff, Eye } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import 'react-phone-number-input/style.css';
import '../phone-input.css';

const PhoneSignupForm = () => {
  const { t } = useTranslation();
  const { signUpWithPhone, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const schema = z.object({
    phone: z.string().min(8, t('auth.errors.invalidPhone')),
    password: z.string().min(6, t('auth.errors.passwordLength')),
    confirmPassword: z.string().min(6, t('auth.errors.passwordLength')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.errors.passwordMatch'),
    path: ['confirmPassword'],
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await signUpWithPhone(values.phone, values.password);
      navigate(`/auth/otp?phone=${encodeURIComponent(values.phone)}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.signupFailed'),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.phone')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <PhoneInput
                    international
                    placeholder={t('auth.enterPhone')}
                    value={field.value}
                    onChange={field.onChange}
                    className="phone-input-container flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('auth.enterPassword')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pl-10 pr-12"
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.confirmPassword')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('auth.confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('common.loading') : t('auth.signup')}
        </Button>
      </form>
    </Form>
  );
};

export default PhoneSignupForm;
