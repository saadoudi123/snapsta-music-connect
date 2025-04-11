
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StoryFooterProps {
  isOwnStory: boolean;
  viewCount: number;
  viewers: string[];
  onReplySubmit: (reply: string) => void;
}

const StoryFooter: React.FC<StoryFooterProps> = ({
  isOwnStory,
  viewCount,
  viewers,
  onReplySubmit
}) => {
  const { t } = useTranslation();
  const [replyText, setReplyText] = useState('');
  const [showViewers, setShowViewers] = useState(false);
  
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    onReplySubmit(replyText);
    setReplyText('');
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
      {isOwnStory ? (
        <div>
          <Button 
            variant="ghost" 
            className="text-white text-sm"
            onClick={() => setShowViewers(!showViewers)}
          >
            <span className="flex items-center">
              {t('stories.viewedBy')} {viewCount}
            </span>
          </Button>
          
          {showViewers && (
            <div className="mt-2 bg-black/70 rounded-lg p-2">
              {viewers.length > 0 ? (
                <div>
                  <p className="text-white text-xs">Viewers will be shown here</p>
                </div>
              ) : (
                <p className="text-white text-xs">{t('stories.noViewersYet')}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleReplySubmit} className="flex items-center space-x-2">
          <Input 
            placeholder={t('stories.replyToStory')}
            className="bg-white/20 border-none text-white placeholder:text-white/70"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-white bg-white/20"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default StoryFooter;
