
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Heart, MessageCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface StoryReaction {
  id: string;
  storyId: string;
  userId: string;
  type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
  createdAt: string;
}

interface StoryView {
  id: string;
  storyId: string;
  userId: string;
  viewedAt: string;
}

interface StoryReply {
  id: string;
  storyId: string;
  userId: string;
  message: string;
  createdAt: string;
}

interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  backgroundStyle?: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  reactions: StoryReaction[];
  replies: StoryReply[];
  hasViewed: boolean;
}

interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentIndex,
  onClose,
  onPrev,
  onNext
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [replyInput, setReplyInput] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reactionType, setReactionType] = useState<string | null>(null);

  const currentStory = stories[currentIndex];
  
  useEffect(() => {
    if (!currentStory || !user) return;
    
    // Record view in database
    const recordView = async () => {
      if (currentStory.hasViewed) return;
      
      const { error } = await supabase
        .from('story_views')
        .insert({
          story_id: currentStory.id,
          user_id: user.id,
          viewed_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error recording story view:', error);
      }
    };
    
    recordView();
    
    // Progress animation
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);
    
    // Auto advance after 10 seconds
    const timeout = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        onNext();
      } else {
        onClose();
      }
    }, 10000);
    
    // Check for screenshot
    const detectScreenshot = () => {
      toast({
        title: t('messages.screenshotAlert', { username: user.username || user.email }),
        description: t('messages.youTook'),
      });
    };
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen') {
        detectScreenshot();
      }
    });
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.removeEventListener('keydown', detectScreenshot);
    };
  }, [currentStory, currentIndex, onNext, onClose, user, t]);
  
  const handleReaction = async (type: 'like' | 'love' | 'wow' | 'sad' | 'angry') => {
    if (!user) return;
    
    setReactionType(type);
    
    const { error } = await supabase
      .from('story_reactions')
      .insert({
        story_id: currentStory.id,
        user_id: user.id,
        type
      });
    
    if (error) {
      console.error('Error adding reaction:', error);
    } else {
      toast({
        title: t('common.success'),
        description: t('stories.reactionAdded'),
      });
    }
  };
  
  const handleReply = async () => {
    if (!replyInput.trim() || !user) return;
    
    const { error } = await supabase
      .from('story_replies')
      .insert({
        story_id: currentStory.id,
        user_id: user.id,
        message: replyInput.trim()
      });
    
    if (error) {
      console.error('Error sending reply:', error);
    } else {
      toast({
        title: t('common.success'),
        description: t('stories.replySent'),
      });
      setReplyInput('');
      setShowReplyInput(false);
    }
  };
  
  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!currentStory) return '';
    
    const expiresAt = new Date(currentStory.expiresAt).getTime();
    const now = new Date().getTime();
    const timeLeft = expiresAt - now;
    
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return t('stories.hoursLeft', { count: hoursLeft });
    }
    return t('stories.minutesLeft', { count: minutesLeft });
  };
  
  if (!currentStory) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-[80vh] bg-gradient-to-b from-primary/10 to-black/30 rounded-lg overflow-hidden backdrop-blur">
        {/* Story header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <Progress value={progress} className="h-1 mb-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={currentStory.userAvatar} alt={currentStory.username} />
                <AvatarFallback>{currentStory.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{currentStory.username}</p>
                <p className="text-white/70 text-xs">{getTimeRemaining()}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Story content */}
        <div 
          className="h-full w-full flex items-center justify-center p-8"
          style={currentStory.backgroundStyle ? { background: currentStory.backgroundStyle } : {}}
        >
          {currentStory.mediaUrl ? (
            currentStory.mediaType === 'video' ? (
              <video 
                src={currentStory.mediaUrl} 
                className="max-h-full max-w-full object-contain"
                autoPlay 
                muted 
                loop
              />
            ) : (
              <img 
                src={currentStory.mediaUrl} 
                alt="Story" 
                className="max-h-full max-w-full object-contain"
              />
            )
          ) : (
            <div className="text-center text-white text-xl md:text-2xl font-medium">
              {currentStory.content}
            </div>
          )}
        </div>
        
        {/* Story footer/actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-white" onClick={() => handleReaction('like')}>
                <Heart className={`h-5 w-5 ${reactionType === 'like' ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 text-white/80">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{currentStory.viewCount}</span>
            </div>
          </div>
          
          {showReplyInput && (
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder={t('stories.replyToStory')}
                className="flex-1 bg-white/10 text-white border-0 rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-primary"
              />
              <Button size="sm" onClick={handleReply}>
                {t('stories.reply')}
              </Button>
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white"
            onClick={onPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        
        {currentIndex < stories.length - 1 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            onClick={onNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
