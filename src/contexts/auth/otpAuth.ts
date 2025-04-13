
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useOtpAuth = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const requestOTP = async (phoneOrEmail: string) => {
    try {
      const isEmail = phoneOrEmail.includes('@');
      
      let signInParams;
      if (isEmail) {
        signInParams = { email: phoneOrEmail };
      } else {
        signInParams = { phone: phoneOrEmail };
      }
      
      const { error } = await supabase.auth.signInWithOtp(signInParams);

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      } else {
        toast({
          title: t('success'),
          description: t('auth.verificationSent'),
        });
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const verifyOTP = async (phoneOrEmail: string, token: string) => {
    try {
      const isEmail = phoneOrEmail.includes('@');
      
      let verifyParams;
      if (isEmail) {
        verifyParams = { 
          email: phoneOrEmail,
          token,
          type: 'magiclink' as const
        };
      } else {
        verifyParams = { 
          phone: phoneOrEmail,
          token,
          type: 'sms' as const
        };
      }
      
      const { error } = await supabase.auth.verifyOtp(verifyParams);

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      } else {
        toast({
          title: t('success'),
          description: t('auth.verificationSuccessful'),
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    requestOTP,
    verifyOTP,
  };
};
