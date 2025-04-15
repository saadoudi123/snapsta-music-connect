
import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "../types";

interface MessageListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  handleSelectContact: (contact: Contact) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  formatTime: (timestamp: string) => string;
}

const MessageList: React.FC<MessageListProps> = ({
  contacts,
  selectedContact,
  handleSelectContact,
  searchQuery,
  setSearchQuery,
  formatTime,
}) => {
  const { t } = useTranslation();
  
  const filteredContacts = contacts.filter(contact => 
    (contact.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     contact.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="border-r col-span-1 md:col-span-1 lg:col-span-1 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('messages.messages')}</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('messages.searchConversations')}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              className={`p-3 flex items-center space-x-3 cursor-pointer hover:bg-accent/50 ${selectedContact?.id === contact.id ? 'bg-accent' : ''}`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar_url} />
                  <AvatarFallback>
                    {contact.username?.substring(0, 2).toUpperCase() || contact.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {contact.is_online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{contact.username || contact.email?.split('@')[0]}</h3>
                  <span className="text-xs text-muted-foreground">
                    {contact.last_message_time ? formatTime(contact.last_message_time) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.is_typing ? (
                      <span className="text-primary">{t('messages.typing')}</span>
                    ) : (
                      contact.last_message
                    )}
                  </p>
                  {contact.unread_count ? (
                    <span className="inline-flex items-center justify-center h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs">
                      {contact.unread_count}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {t('messages.noConversationsFound')}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MessageList;
