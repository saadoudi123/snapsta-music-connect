
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { Message, Contact } from "../types";

export const useMessagesData = (user: any) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchContacts = async () => {
      try {
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
  
  useEffect(() => {
    if (!selectedContact || !user) return;
    
    setContacts(prev => 
      prev.map(contact => 
        contact.id === selectedContact.id 
          ? { ...contact, unread_count: 0, is_typing: false } 
          : contact
      )
    );
    
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
  
  useEffect(() => {
    return () => {
      setShowChatList(true);
    };
  }, []);
  
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
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
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
  
  return {
    contacts,
    selectedContact,
    messages,
    newMessage,
    searchQuery,
    showChatList,
    isTyping,
    showEmojiSelector,
    selectedMessage,
    setSelectedContact,
    setMessages,
    setNewMessage,
    setSearchQuery,
    setShowChatList,
    setIsTyping,
    setShowEmojiSelector,
    setSelectedMessage,
    handleSelectContact,
    handleSendMessage,
    handleReaction
  };
};
