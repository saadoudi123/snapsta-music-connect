
import React from "react";
import { Check, CheckCheck, Heart, ThumbsUp, Laugh, X, Smile } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isFromUser: boolean;
  selectedContact: {
    avatar_url?: string;
    username?: string;
    email?: string;
  };
  userId: string;
  formatTime: (timestamp: string) => string;
  selectedMessage: string | null;
  setSelectedMessage: (id: string | null) => void;
  showEmojiSelector: boolean;
  setShowEmojiSelector: (show: boolean) => void;
  handleReaction: (messageId: string, reaction: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromUser,
  selectedContact,
  userId,
  formatTime,
  selectedMessage,
  setSelectedMessage,
  showEmojiSelector,
  setShowEmojiSelector,
  handleReaction,
}) => {
  return (
    <div className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} relative group`}>
      <div className="relative max-w-[70%]">
        {!isFromUser && (
          <Avatar className="absolute -left-12 top-0 h-8 w-8">
            <AvatarImage src={selectedContact.avatar_url} />
            <AvatarFallback>
              {selectedContact.username?.substring(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div 
          className={`
            relative p-3 rounded-lg
            ${isFromUser 
              ? 'bg-primary text-primary-foreground rounded-br-none' 
              : 'bg-muted rounded-bl-none'
            }
          `}
        >
          {message.media_url && message.media_type === 'image' && (
            <img 
              src={message.media_url} 
              alt="Media" 
              className="mb-2 rounded max-w-full" 
            />
          )}
          
          <p>{message.content}</p>
          
          <div className="text-xs opacity-70 flex items-center mt-1 justify-end space-x-1">
            <span>{formatTime(message.created_at)}</span>
            {isFromUser && (
              message.read 
                ? <CheckCheck className="h-3 w-3 text-blue-400" /> 
                : <Check className="h-3 w-3" />
            )}
          </div>
          
          {message.reaction && (
            <div className="absolute -bottom-2 right-0 bg-background rounded-full px-1 shadow-sm border">
              <span className="text-sm">{message.reaction}</span>
            </div>
          )}
        </div>
        
        <div 
          className={`absolute ${isFromUser ? 'left-0' : 'right-0'} -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity`}
          onClick={() => {
            setSelectedMessage(message.id);
            setShowEmojiSelector(true);
          }}
        >
          <Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
            <Smile className="h-3 w-3" />
          </Button>
        </div>
        
        {selectedMessage === message.id && showEmojiSelector && (
          <div className={`absolute ${isFromUser ? 'right-0' : 'left-0'} -top-12 bg-background border rounded-lg shadow-lg z-10 p-1 flex items-center`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleReaction(message.id, "❤️")}
            >
              <Heart className="h-5 w-5 text-red-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleReaction(message.id, "👍")}
            >
              <ThumbsUp className="h-5 w-5 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleReaction(message.id, "😂")}
            >
              <Laugh className="h-5 w-5 text-yellow-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowEmojiSelector(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
