
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Video, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CreatePostForm: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaSelection = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Check file types based on the selected type
      const validFiles = newFiles.filter(file => {
        if (type === 'image') {
          return file.type.startsWith('image/');
        } else if (type === 'video') {
          return file.type.startsWith('video/');
        }
        return false;
      });
      
      if (validFiles.length !== newFiles.length) {
        toast({
          title: t('errors.error'),
          description: type === 'image' 
            ? t('feed.selectValidImage') 
            : t('feed.selectValidVideo'),
          variant: 'destructive',
        });
      }
      
      if (validFiles.length > 0) {
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setMediaFiles([...mediaFiles, ...validFiles]);
        setMediaPreviews([...mediaPreviews, ...newPreviews]);
      }
    }
  };

  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...mediaPreviews];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        title: t('errors.error'),
        description: t('feed.emptyPost'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would upload media and create a post
      console.log('Submitting post:', {
        content,
        mediaFiles,
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success'),
        description: t('feed.postShared'),
      });
      
      // Reset form
      setContent('');
      
      // Revoke all object URLs
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
      
      setMediaFiles([]);
      setMediaPreviews([]);
    } catch (error) {
      toast({
        title: t('errors.error'),
        description: t('errors.somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <Textarea
              placeholder={t('feed.whatOnMind')}
              value={content}
              onChange={handleContentChange}
              className="flex-1 resize-none"
              rows={3}
            />
          </div>
          
          {mediaPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative rounded-md overflow-hidden">
                  {preview.includes('video') ? (
                    <video
                      src={preview}
                      className="w-full h-32 object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => removeMedia(index)}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-wrap justify-between">
          <div className="flex gap-2">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleMediaSelection(e, 'image')}
            />
            <label htmlFor="image-upload">
              <Button type="button" variant="ghost" size="sm" className="cursor-pointer" asChild>
                <div>
                  <Image className="h-4 w-4 mr-2" />
                  {t('feed.addPhoto')}
                </div>
              </Button>
            </label>
            
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => handleMediaSelection(e, 'video')}
            />
            <label htmlFor="video-upload">
              <Button type="button" variant="ghost" size="sm" className="cursor-pointer" asChild>
                <div>
                  <Video className="h-4 w-4 mr-2" />
                  {t('feed.addVideo')}
                </div>
              </Button>
            </label>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
          >
            {isSubmitting ? t('common.loading') : t('feed.post')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePostForm;
