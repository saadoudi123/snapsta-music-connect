
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StyleSectionProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

const StyleSection: React.FC<StyleSectionProps> = ({
  backgroundColor,
  setBackgroundColor,
  textColor,
  setTextColor,
  fontSize,
  setFontSize
}) => {
  const { t } = useTranslation();
  
  const generateRandomStyle = () => {
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
  };
  
  return (
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
          onClick={generateRandomStyle}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {t('stories.randomStyle')}
        </Button>
      </div>
    </div>
  );
};

export default StyleSection;
