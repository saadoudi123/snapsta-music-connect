
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useEmailAuth = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
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

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
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

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
          title: t('success'),
          description: t('auth.resetSuccess'),
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

  return {
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
  };
};
