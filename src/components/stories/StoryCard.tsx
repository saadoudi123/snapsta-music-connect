
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface StoryCardProps {
  id?: string;
  username: string;
  avatar?: string;
  hasStory?: boolean;
  hasUnviewed?: boolean;
  isOwn?: boolean;
  onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  username,
  avatar,
  hasStory = false,
  hasUnviewed = false,
  isOwn = false,
  onClick
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center group cursor-pointer"
    >
      <div 
        className={`p-0.5 rounded-full mb-1
          ${hasStory && !isOwn 
            ? (hasUnviewed ? 'bg-gradient-to-tr from-primary to-primary/60' : 'bg-muted') 
            : 'bg-transparent'
          }`}
      >
        <div className={`relative p-0.5 bg-background rounded-full ${isOwn ? 'ring-1 ring-border' : ''}`}>
          <Avatar className="h-14 w-14 border-2 border-background">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="text-xs">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {isOwn && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5">
              <PlusCircle className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      
      <span className="text-xs truncate max-w-[72px] text-center">
        {isOwn ? t('stories.yourStory') : username}
      </span>
    </div>
  );
};

export default StoryCard;
