
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Upload, Video, Type, Palette, X, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface CreateStoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('24px');
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const uploadStory = async () => {
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
      
      // Create story record
      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          content: text,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
          background_style: !mediaUrl ? `background-color: ${backgroundColor}; color: ${textColor}; font-size: ${fontSize};` : null,
          expires_at: expiresAt.toISOString()
        });
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      toast({
        title: t('stories.storyShared'),
        description: t('stories.storyWillDisappear'),
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: t('errors.somethingWentWrong'),
        description: typeof error === 'string' ? error : (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
    
    uploadStory();
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
              <Textarea 
                placeholder={t('stories.writeYourStory')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-36 mb-4"
              />
            </TabsContent>
            
            <TabsContent value="media">
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p>{selectedFile.name}</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedFile(null);
                          setMediaType(null);
                        }}
                      >
                        {t('common.remove')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {t('stories.dropMediaHere')}
                      </p>
                      <Button variant="outline" asChild>
                        <label>
                          {t('stories.browse')}
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleFileChange(e as any);
                      input.click();
                    }}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {t('stories.addPhoto')}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*';
                      input.onchange = (e) => handleFileChange(e as any);
                      input.click();
                    }}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {t('stories.addVideo')}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="style">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('stories.background')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('stories.textColor')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('stories.fontSize')}
                  </label>
                  <Input
                    type="text"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  />
                </div>
                
                <div className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      // Generate random style
                      const colors = [
                        '#FF5757', '#5271FF', '#38B6FF', '#5CE1E6',
                        '#38CAAF', '#FF66C4', '#CB6CE6', '#FFD93D'
                      ];
                      const randomBg = colors[Math.floor(Math.random() * colors.length)];
                      const randomText = '#FFFFFF';
                      const fontSizes = ['20px', '24px', '28px', '32px'];
                      const randomFont = fontSizes[Math.floor(Math.random() * fontSizes.length)];
                      
                      setBackgroundColor(randomBg);
                      setTextColor(randomText);
                      setFontSize(randomFont);
                    }}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {t('stories.randomStyle')}
                  </Button>
                </div>
              </div>
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
