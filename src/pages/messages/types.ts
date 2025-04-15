
export interface Message {
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

export interface Contact {
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
