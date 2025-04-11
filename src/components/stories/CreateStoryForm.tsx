
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Image, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStoryUpload } from '@/hooks/use-story-upload';
import { useStoryMedia } from '@/hooks/use-story-media';
import TextContentSection from './form-sections/TextContentSection';
import MediaSection from './form-sections/MediaSection';
import StyleSection from './form-sections/StyleSection';

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

export interface CreateStoryFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
  onStoryCreated: (story: Story) => void;
}

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({ 
  onStoryCreated, 
  onCancel, 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State for the form
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('24px');
  
  // Media file handling
  const { 
    selectedFile, 
    setSelectedFile, 
    mediaType, 
    setMediaType, 
    handleFileChange 
  } = useStoryMedia();
  
  // Story upload handling
  const { uploadStory, isLoading } = useStoryUpload(onStoryCreated, onSuccess);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text && !selectedFile) {
      toast({
        title: t('errors.validation'),
        description: t('stories.addContentOrMedia'),
        variant: 'destructive',
      });
      return;
    }
    
    uploadStory(text, selectedFile, mediaType);
  };
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-background border rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('stories.createStory')}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="text">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="text" className="flex-1">
                <Type className="h-4 w-4 mr-2" />
                {t('stories.text')}
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                <Image className="h-4 w-4 mr-2" />
                {t('stories.media')}
              </TabsTrigger>
              <TabsTrigger value="style" className="flex-1">
                <Palette className="h-4 w-4 mr-2" />
                {t('stories.style')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <TextContentSection 
                text={text} 
                setText={setText} 
              />
            </TabsContent>
            
            <TabsContent value="media">
              <MediaSection 
                selectedFile={selectedFile} 
                setSelectedFile={setSelectedFile}
                setMediaType={setMediaType}
                handleFileChange={handleFileChange}
              />
            </TabsContent>
            
            <TabsContent value="style">
              <StyleSection 
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                textColor={textColor}
                setTextColor={setTextColor}
                fontSize={fontSize}
                setFontSize={setFontSize}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex space-x-2 mt-6">
            <Button variant="outline" type="button" onClick={onCancel} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('stories.shareToStory')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryForm;
