
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Video, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaSectionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setMediaType: (type: 'image' | 'video' | null) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ 
  selectedFile, 
  setSelectedFile, 
  setMediaType,
  handleFileChange 
}) => {
  const { t } = useTranslation();
  
  return (
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
  );
};

export default MediaSection;
