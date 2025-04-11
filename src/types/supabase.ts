
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          language: string
          theme: string
          is_private: boolean
          is_online: boolean
          last_seen: string | null
          is_verified: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          language?: string
          theme?: string
          is_private?: boolean
          is_online?: boolean
          last_seen?: string | null
          is_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          language?: string
          theme?: string
          is_private?: boolean
          is_online?: boolean
          last_seen?: string | null
          is_verified?: boolean
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          content: string | null
          media_urls: string[] | null
          likes_count: number
          comments_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          content?: string | null
          media_urls?: string[] | null
          likes_count?: number
          comments_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          content?: string | null
          media_urls?: string[] | null
          likes_count?: number
          comments_count?: number
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          post_id: string
          user_id: string
          content: string | null
          media_url: string | null
          parent_id: string | null
          likes_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          post_id: string
          user_id: string
          content?: string | null
          media_url?: string | null
          parent_id?: string | null
          likes_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          post_id?: string
          user_id?: string
          content?: string | null
          media_url?: string | null
          parent_id?: string | null
          likes_count?: number
        }
      }
      likes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          post_id: string | null
          comment_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
        }
      }
      followers: {
        Row: {
          id: string
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          id?: string
          created_at?: string
          follower_id?: string
          following_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          sender_id: string
          receiver_id: string | null
          conversation_id: string
          content: string | null
          media_urls: string[] | null
          is_read: boolean
          message_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          sender_id: string
          receiver_id?: string | null
          conversation_id: string
          content?: string | null
          media_urls?: string[] | null
          is_read?: boolean
          message_type?: string
        }
        Update: {
          id?: string
          created_at?: string
          sender_id?: string
          receiver_id?: string | null
          conversation_id?: string
          content?: string | null
          media_urls?: string[] | null
          is_read?: boolean
          message_type?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          is_group: boolean
          last_message_id: string | null
          owner_id: string | null
          is_channel: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          is_group?: boolean
          last_message_id?: string | null
          owner_id?: string | null
          is_channel?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          is_group?: boolean
          last_message_id?: string | null
          owner_id?: string | null
          is_channel?: boolean
        }
      }
      conversation_participants: {
        Row: {
          id: string
          created_at: string
          user_id: string
          conversation_id: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          conversation_id: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          conversation_id?: string
          is_admin?: boolean
        }
      }
      typing_indicators: {
        Row: {
          id: string
          created_at: string
          user_id: string
          conversation_id: string
          expires_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          conversation_id: string
          expires_at: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          conversation_id?: string
          expires_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          created_at: string
          user_id: string
          media_url: string | null
          content: string | null
          expires_at: string
          views_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          media_url?: string | null
          content?: string | null
          expires_at: string
          views_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          media_url?: string | null
          content?: string | null
          expires_at?: string
          views_count?: number
        }
      }
      story_views: {
        Row: {
          id: string
          created_at: string
          story_id: string
          viewer_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          story_id: string
          viewer_id: string
        }
        Update: {
          id?: string
          created_at?: string
          story_id?: string
          viewer_id?: string
        }
      }
      story_reactions: {
        Row: {
          id: string
          created_at: string
          story_id: string
          user_id: string
          reaction: string
        }
        Insert: {
          id?: string
          created_at?: string
          story_id: string
          user_id: string
          reaction: string
        }
        Update: {
          id?: string
          created_at?: string
          story_id?: string
          user_id?: string
          reaction?: string
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          sender_id: string | null
          type: string
          content: string | null
          is_read: boolean
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          sender_id?: string | null
          type: string
          content?: string | null
          is_read?: boolean
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          sender_id?: string | null
          type?: string
          content?: string | null
          is_read?: boolean
          reference_id?: string | null
          reference_type?: string | null
        }
      }
      music_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string
          youtube_id: string
          title: string | null
          artist: string | null
          duration: number | null
          thumbnail_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          youtube_id: string
          title?: string | null
          artist?: string | null
          duration?: number | null
          thumbnail_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          youtube_id?: string
          title?: string | null
          artist?: string | null
          duration?: number | null
          thumbnail_url?: string | null
        }
      }
      screenshot_alerts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          target_id: string
          conversation_id: string | null
          story_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          target_id: string
          conversation_id?: string | null
          story_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          target_id?: string
          conversation_id?: string | null
          story_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
