
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithPhone: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyOTP: (phoneOrEmail: string, token: string) => Promise<void>;
  requestOTP: (phoneOrEmail: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}
