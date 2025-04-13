
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const usePhoneAuth = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      } else {
        toast({
          title: t('auth.loginSuccessful'),
          description: t('auth.welcomeBack'),
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

  const signUpWithPhone = async (phone: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        phone,
        password,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      } else {
        toast({
          title: t('auth.signupSuccessful'),
          description: t('auth.verificationSent'),
        });
        navigate('/auth/verify');
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
    signInWithPhone,
    signUpWithPhone,
  };
};
