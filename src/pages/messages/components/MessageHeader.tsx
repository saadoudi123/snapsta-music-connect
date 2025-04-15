
import React from "react";
import { useTranslation } from "react-i18next";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact } from "../types";

interface MessageHeaderProps {
  selectedContact: Contact;
  isDesktop: boolean;
  showChatList: boolean;
  setShowChatList: (show: boolean) => void;
  formatLastSeen: (timestamp: string) => string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  selectedContact,
  isDesktop,
  showChatList,
  setShowChatList,
  formatLastSeen,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 border-b flex items-center">
      {!isDesktop && !showChatList && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => setShowChatList(true)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={selectedContact.avatar_url} />
        <AvatarFallback>
          {selectedContact.username?.substring(0, 2).toUpperCase() || selectedContact.email?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="font-medium">
          {selectedContact.username || selectedContact.email?.split('@')[0]}
        </h3>
        <p className="text-xs text-muted-foreground">
          {selectedContact.is_online 
            ? t('messages.online') 
            : (selectedContact.last_seen ? formatLastSeen(selectedContact.last_seen) : t('messages.offline'))}
        </p>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t('messages.viewProfile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('messages.clearChat')}</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              {t('messages.blockUser')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MessageHeader;
