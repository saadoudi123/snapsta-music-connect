
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('auth.loginSuccessful'),
          description: t('auth.welcomeBack'),
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('auth.loginSuccessful'),
          description: t('auth.welcomeBack'),
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('auth.signupSuccessful'),
          description: t('auth.verificationSent'),
        });
        navigate('/auth/verify');
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        phone,
        password,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('auth.signupSuccessful'),
          description: t('auth.verificationSent'),
        });
        navigate('/auth/verify');
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (phoneOrEmail: string) => {
    setLoading(true);
    try {
      const isEmail = phoneOrEmail.includes('@');
      
      const { error } = await supabase.auth.signInWithOtp({
        [isEmail ? 'email' : 'phone']: phoneOrEmail,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('success'),
          description: t('auth.verificationSent'),
        });
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phoneOrEmail: string, token: string) => {
    setLoading(true);
    try {
      const isEmail = phoneOrEmail.includes('@');
      
      const { error } = await supabase.auth.verifyOtp({
        [isEmail ? 'email' : 'phone']: phoneOrEmail,
        token,
        type: 'sms',
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('success'),
          description: t('auth.verificationSuccessful'),
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast({
          title: t('errors.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('success'),
          description: t('auth.resetSuccess'),
        });
      }
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(data, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      toast({
        title: t('success'),
        description: t('profile.profileUpdated'),
      });
    } catch (error: any) {
      toast({
        title: t('errors.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signInWithEmail,
        signInWithPhone,
        signUpWithEmail,
        signUpWithPhone,
        signOut,
        resetPassword,
        verifyOTP,
        requestOTP,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
