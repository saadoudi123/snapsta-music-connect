
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useProfileService = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(data, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      toast({
        title: t('success'),
        description: t('profile.profileUpdated'),
      });
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
    updateProfile,
  };
};
