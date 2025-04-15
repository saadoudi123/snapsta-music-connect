
import React from "react";
import { useTranslation } from "react-i18next";
import { Send, Smile, Image, Mic, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-3 border-t">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Input
          placeholder={t('messages.typeMessage')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1"
        />
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Image className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Mic className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="default" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
