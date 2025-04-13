
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import 'react-phone-number-input/style.css';
import '../phone-input.css';

interface PhoneOtpFormProps {
  onFormSubmit: (phone: string) => void;
  loading: boolean;
}

const PhoneOtpForm: React.FC<PhoneOtpFormProps> = ({ onFormSubmit, loading }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const schema = z.object({
    phone: z.string().min(8, t('auth.errors.invalidPhone')),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      onFormSubmit(values.phone);
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
  );
};

export default PhoneOtpForm;
