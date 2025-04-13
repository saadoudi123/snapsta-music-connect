
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OtpVerificationFormProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
  identifier: string;
  loading: boolean;
  countdown: number;
  verificationStatus: 'idle' | 'error' | 'success';
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  onVerify,
  onBack,
  onResend,
  identifier,
  loading,
  countdown,
  verificationStatus
}) => {
  const { t } = useTranslation();

  const schema = z.object({
    code: z.string().min(6, t('auth.errors.codeLength')),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    onVerify(values.code);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {t('auth.verificationSent')} {identifier}
        </p>
      </div>
      
      {verificationStatus === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center">
            <X className="h-4 w-4 mr-2" />
            {t('auth.errors.invalidCode')}
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'success' && (
        <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
          <AlertDescription className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            {t('auth.verificationSuccessful')}
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.verificationCode')}</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
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

      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          size="sm"
        >
          {t('common.back')}
        </Button>
        <Button 
          variant="ghost" 
          onClick={onResend} 
          disabled={loading || countdown > 0}
          size="sm"
        >
          {countdown > 0 ? `${t('auth.resendCodeIn')} ${countdown}s` : t('auth.resendCode')}
        </Button>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
