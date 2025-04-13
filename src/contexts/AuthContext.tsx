
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { AuthContextType } from './auth/types';
import { useEmailAuth } from './auth/emailAuth';
import { usePhoneAuth } from './auth/phoneAuth';
import { useOtpAuth } from './auth/otpAuth';
import { useProfileService } from './auth/profileService';
import { useSessionManager } from './auth/useSessionManager';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { session, user, loading } = useSessionManager();
  const { signInWithEmail, signUpWithEmail, resetPassword } = useEmailAuth();
  const { signInWithPhone, signUpWithPhone } = usePhoneAuth();
  const { requestOTP, verifyOTP } = useOtpAuth();
  const { updateProfile } = useProfileService();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
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
