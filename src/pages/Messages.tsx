
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  Plus, 
  Send, 
  Smile, 
  Paperclip, 
  Image,
  Mic, 
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
  Heart,
  ThumbsUp,
  Laugh,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { useMediaQuery } from "@/hooks/use-mobile";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  media_url?: string;
  media_type?: string;
  reaction?: string;
}

interface Contact {
  id: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  last_seen?: string;
  is_online?: boolean;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  is_typing?: boolean;
}

const Messages: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Fetch contacts
  useEffect(() => {
    if (!user) return;
    
    const fetchContacts = async () => {
      try {
        // This would be a more complex query in a real app
        // For demo purposes, we're just getting some users
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .limit(20);
        
        if (error) throw error;
        
        const mockContacts: Contact[] = (data || []).map((profile) => ({
          id: profile.id,
          username: profile.username || profile.first_name || profile.email?.split('@')[0],
          avatar_url: profile.avatar_url,
          email: profile.email,
          last_seen: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          is_online: Math.random() > 0.5,
          last_message: "Hey, how are you?",
          last_message_time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          unread_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
          is_typing: false
        }));
        
        setContacts(mockContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    
    fetchContacts();
  }, [user]);
  
  // Generate mock messages for selected contact
  useEffect(() => {
    if (!selectedContact || !user) return;
    
    // Mark as read
    setContacts(prev => 
      prev.map(contact => 
        contact.id === selectedContact.id 
          ? { ...contact, unread_count: 0, is_typing: false } 
          : contact
      )
    );
    
    // Generate some mock messages
    const generateMockMessages = () => {
      const mockMessages: Message[] = [];
      const messageCount = 10 + Math.floor(Math.random() * 20);
      
      for (let i = 0; i < messageCount; i++) {
        const isFromUser = Math.random() > 0.5;
        const timestamp = new Date();
        timestamp.setMinutes(timestamp.getMinutes() - (messageCount - i) * 10);
        
        mockMessages.push({
          id: `msg-${i}`,
          sender_id: isFromUser ? user.id : selectedContact.id,
          receiver_id: isFromUser ? selectedContact.id : user.id,
          content: isFromUser 
            ? ["Hey there!", "How's it going?", "I was wondering if you're free tomorrow?", "Did you see the new movie?"][Math.floor(Math.random() * 4)]
            : ["Hi!", "I'm good, thanks!", "Yes, I'm free after 5pm", "No, what movie?"][Math.floor(Math.random() * 4)],
          created_at: timestamp.toISOString(),
          read: true,
          media_url: Math.random() > 0.9 ? 'https://source.unsplash.com/random/400x300' : undefined,
          media_type: Math.random() > 0.9 ? 'image' : undefined,
          reaction: Math.random() > 0.8 ? ["❤️", "👍", "😂", "😮", "😢", "🙏"][Math.floor(Math.random() * 6)] : undefined
        });
      }
      
      return mockMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    };
    
    setMessages(generateMockMessages());
    
    // Simulate occasional typing indicator
    const randomlyShowTyping = () => {
      if (Math.random() > 0.7) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === selectedContact.id 
              ? { ...contact, is_typing: true } 
              : contact
          )
        );
        
        setTimeout(() => {
          setContacts(prev => 
            prev.map(contact => 
              contact.id === selectedContact.id 
                ? { ...contact, is_typing: false } 
                : contact
            )
          );
        }, 3000);
      }
    };
    
    const typingInterval = setInterval(randomlyShowTyping, 10000);
    
    return () => {
      clearInterval(typingInterval);
    };
  }, [selectedContact, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Reset mobile view when navigating away
  useEffect(() => {
    return () => {
      setShowChatList(true);
    };
  }, []);
  
  // Handle typing indicator
  useEffect(() => {
    if (!newMessage || !selectedContact) return;
    
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, selectedContact]);
  
  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    if (!isDesktop) {
      setShowChatList(false);
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact || !user) return;
    
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      sender_id: user.id,
      receiver_id: selectedContact.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate reply
    if (Math.random() > 0.3) {
      setTimeout(() => {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === selectedContact.id 
              ? { ...contact, is_typing: true } 
              : contact
          )
        );
        
        setTimeout(() => {
          const replyMsg: Message = {
            id: `reply-${Date.now()}`,
            sender_id: selectedContact.id,
            receiver_id: user.id,
            content: ["Ok!", "Sounds good!", "I'll check it out", "Let me think about it"][Math.floor(Math.random() * 4)],
            created_at: new Date().toISOString(),
            read: false
          };
          
          setMessages(prev => [...prev, replyMsg]);
          
          setContacts(prev => 
            prev.map(contact => 
              contact.id === selectedContact.id 
                ? { ...contact, is_typing: false, last_message: replyMsg.content, last_message_time: replyMsg.created_at } 
                : contact
            )
          );
        }, 2000 + Math.random() * 2000);
      }, 1000 + Math.random() * 3000);
    }
  };
  
  // Handle adding reaction to message
  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reaction } 
          : msg
      )
    );
    
    setSelectedMessage(null);
    setShowEmojiSelector(false);
  };
  
  // Screenshot detection
  useEffect(() => {
    const detectScreenshot = () => {
      toast({
        title: t('messages.screenshotAlert', { username: user?.email?.split('@')[0] || 'Someone' }),
        description: t('messages.youTook'),
      });
    };
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen') {
        detectScreenshot();
      }
    });
    
    return () => {
      document.removeEventListener('keydown', detectScreenshot);
    };
  }, [t, user]);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than a week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Format "last seen"
  const formatLastSeen = (timestamp: string) => {
    if (!timestamp) return t('messages.offline');
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than a minute
      return t('messages.justNow');
    } else if (diff < 3600000) { // Less than an hour
      const minutes = Math.floor(diff / 60000);
      return t('common.minutesAgo', { count: minutes });
    } else if (diff < 86400000) { // Less than a day
      const hours = Math.floor(diff / 3600000);
      return t('common.hoursAgo', { count: hours });
    } else {
      return t('messages.lastSeen') + ' ' + date.toLocaleDateString();
    }
  };
  
  // Filter contacts by search query
  const filteredContacts = contacts.filter(contact => 
    (contact.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     contact.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('auth.loginRequired')}</h2>
          <p className="mb-4">{t('messages.loginToChat')}</p>
          <Button onClick={() => navigate('/auth/login')}>{t('auth.login')}</Button>
        </div>
      </div>
    );
  }
  
  const isSelectedContactTyping = contacts.find(c => c.id === selectedContact?.id)?.is_typing;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="rounded-lg border shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        {/* Contact list - hidden on mobile when in chat view */}
        {(isDesktop || showChatList) && (
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
        )}
        
        {/* Chat area */}
        {selectedContact ? (
          <div className={`${isDesktop ? 'col-span-2 lg:col-span-3' : 'col-span-1'} flex flex-col h-full`}>
            {/* Chat header */}
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
            
            {/* Messages area */}
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
            
            {/* Message input */}
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
                <Button variant="primary" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Empty state when no chat is selected
          <div className={`${isDesktop ? 'col-span-2 lg:col-span-3' : 'hidden'} flex flex-col items-center justify-center h-full bg-muted/20`}>
            <div className="text-center max-w-md px-4">
              <h3 className="text-2xl font-bold mb-2">{t('messages.selectConversation')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('messages.selectContactToChat')}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('messages.newChat')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
