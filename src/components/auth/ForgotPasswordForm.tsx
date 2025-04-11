
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const { resetPassword, loading } = useAuth();

  // Validation schema
  const schema = z.object({
    email: z.string().email(t('auth.errors.invalidEmail')),
  });

  // Form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof schema>) => {
    await resetPassword(values.email);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('auth.resetPassword')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.resetInstructions')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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

      <div className="text-center">
        <Link
          to="/auth/login"
          className="text-sm underline-offset-4 hover:underline text-primary"
        >
          {t('common.back')} {t('auth.login')}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
