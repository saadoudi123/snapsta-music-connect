
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EmailOtpFormProps {
  onFormSubmit: (email: string) => void;
  loading: boolean;
}

const EmailOtpForm: React.FC<EmailOtpFormProps> = ({ onFormSubmit, loading }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const schema = z.object({
    email: z.string().email(t('auth.errors.invalidEmail')),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      onFormSubmit(values.email);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.otpRequestFailed'),
      });
    }
  };

  return (
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
  );
};

export default EmailOtpForm;
