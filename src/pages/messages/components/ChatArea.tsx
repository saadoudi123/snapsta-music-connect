
import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import { Message, Contact } from "../types";

interface ChatAreaProps {
  messages: Message[];
  selectedContact: Contact;
  user: { id: string };
  formatTime: (timestamp: string) => string;
  selectedMessage: string | null;
  setSelectedMessage: (id: string | null) => void;
  showEmojiSelector: boolean;
  setShowEmojiSelector: (show: boolean) => void;
  handleReaction: (messageId: string, reaction: string) => void;
  isSelectedContactTyping: boolean | undefined;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  selectedContact,
  user,
  formatTime,
  selectedMessage,
  setSelectedMessage,
  showEmojiSelector,
  setShowEmojiSelector,
  handleReaction,
  isSelectedContactTyping,
}) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isFromUser = message.sender_id === user.id;
          const showDate = index === 0 || new Date(message.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();
          
          return (
            <React.Fragment key={message.id}>
              {showDate && (
                <div className="flex justify-center my-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <MessageBubble
                message={message}
                isFromUser={isFromUser}
                selectedContact={selectedContact}
                userId={user.id}
                formatTime={formatTime}
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
                showEmojiSelector={showEmojiSelector}
                setShowEmojiSelector={setShowEmojiSelector}
                handleReaction={handleReaction}
              />
            </React.Fragment>
          );
        })}
        
        {isSelectedContactTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatArea;
