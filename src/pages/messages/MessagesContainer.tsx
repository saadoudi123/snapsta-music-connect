
import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import MessageList from "./components/MessageList";
import MessageHeader from "./components/MessageHeader";
import ChatArea from "./components/ChatArea";
import MessageInput from "./components/MessageInput";
import EmptyConversation from "./components/EmptyConversation";
import LoginRequired from "./components/LoginRequired";
import { useMessagesData } from "./hooks/useMessagesData";
import { formatTime, formatLastSeen } from "./utils";

const MessagesContainer: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { user } = useAuth();
  
  const {
    contacts,
    selectedContact,
    messages,
    newMessage,
    searchQuery,
    showChatList,
    showEmojiSelector,
    selectedMessage,
    setSearchQuery,
    setShowChatList,
    setNewMessage,
    setSelectedMessage,
    setShowEmojiSelector,
    handleSelectContact,
    handleSendMessage,
    handleReaction
  } = useMessagesData(user);
  
  if (!user) {
    return <LoginRequired />;
  }
  
  const isSelectedContactTyping = contacts.find(c => c.id === selectedContact?.id)?.is_typing;
  
  const handleContactSelect = (contact: any) => {
    handleSelectContact(contact);
    
    if (!isDesktop) {
      setShowChatList(false);
    }
  };
  
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
      {(isDesktop || showChatList) && (
        <MessageList
          contacts={contacts}
          selectedContact={selectedContact}
          handleSelectContact={handleContactSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          formatTime={formatTime}
        />
      )}
      
      {selectedContact ? (
        <div className={`${isDesktop ? 'col-span-2 lg:col-span-3' : 'col-span-1'} flex flex-col h-full`}>
          <MessageHeader
            selectedContact={selectedContact}
            isDesktop={isDesktop}
            showChatList={showChatList}
            setShowChatList={setShowChatList}
            formatLastSeen={formatLastSeen}
          />
          
          <ChatArea
            messages={messages}
            selectedContact={selectedContact}
            user={user}
            formatTime={formatTime}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
            showEmojiSelector={showEmojiSelector}
            setShowEmojiSelector={setShowEmojiSelector}
            handleReaction={handleReaction}
            isSelectedContactTyping={isSelectedContactTyping}
          />
          
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <div className={`${isDesktop ? 'col-span-2 lg:col-span-3' : 'hidden'}`}>
          <EmptyConversation />
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
