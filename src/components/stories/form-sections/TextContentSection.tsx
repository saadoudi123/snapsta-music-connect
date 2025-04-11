
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';

interface TextContentSectionProps {
  text: string;
  setText: (text: string) => void;
}

const TextContentSection: React.FC<TextContentSectionProps> = ({ text, setText }) => {
  const { t } = useTranslation();
  
  return (
    <Textarea 
      placeholder={t('stories.writeYourStory')}
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="h-36 mb-4"
    />
  );
};

export default TextContentSection;
