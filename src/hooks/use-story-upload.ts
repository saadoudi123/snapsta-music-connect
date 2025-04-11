
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase';

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  caption?: string;
  created_at: string;
  expires_at: string;
  view_count: number;
  viewers: string[];
  reactions: { [key: string]: number };
}

export const useStoryUpload = (
  onStoryCreated: (story: Story) => void,
  onSuccess?: () => void
) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const uploadStory = async (
    text: string,
    selectedFile: File | null,
    mediaType: 'image' | 'video' | null
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let mediaUrl = '';
      
      // Upload media file if selected
      if (selectedFile) {
        const fileName = `${user.id}-${Date.now()}.${selectedFile.name.split('.').pop()}`;
        const filePath = `stories/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, selectedFile);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        mediaUrl = data.publicUrl;
      }
      
      // Calculate expiry time (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Create a mock story for demo
      const newStory: Story = {
        id: `story-${user.id}-${Date.now()}`,
        user_id: user.id,
        media_url: mediaUrl || 'https://source.unsplash.com/random/1080x1920',
        caption: text || undefined,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        view_count: 0,
        viewers: [],
        reactions: {}
      };
      
      // In a real app, we would save this to Supabase
      // const { error: insertError } = await supabase
      //   .from('stories')
      //   .insert({
      //     user_id: user.id,
      //     content: text,
      //     media_url: mediaUrl || null,
      //     media_type: mediaType || null,
      //     background_style: !mediaUrl ? `background-color: ${backgroundColor}; color: ${textColor}; font-size: ${fontSize};` : null,
      //     expires_at: expiresAt.toISOString()
      //   });
      
      // if (insertError) {
      //   throw new Error(insertError.message);
      // }
      
      toast({
        title: t('stories.storyShared'),
        description: t('stories.storyWillDisappear'),
      });
      
      onStoryCreated(newStory);
      if (onSuccess) onSuccess();
      
      return true;
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: t('errors.somethingWentWrong'),
        description: typeof error === 'string' ? error : (error as Error).message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    uploadStory,
    isLoading
  };
};
