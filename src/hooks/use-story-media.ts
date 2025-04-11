
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export const useStoryMedia = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    
    const fileType = file.type.split('/')[0];
    if (fileType === 'image') {
      setMediaType('image');
      setSelectedFile(file);
    } else if (fileType === 'video') {
      setMediaType('video');
      setSelectedFile(file);
    } else {
      toast({
        title: t('errors.mediaUploadFailed'),
        description: t('errors.unsupportedFileType'),
        variant: 'destructive',
      });
    }
  };
  
  return {
    selectedFile,
    setSelectedFile,
    mediaType,
    setMediaType,
    handleFileChange
  };
};
