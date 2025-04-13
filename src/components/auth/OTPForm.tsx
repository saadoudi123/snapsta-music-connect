
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Clock } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import EmailOtpForm from './otp/EmailOtpForm';
import PhoneOtpForm from './otp/PhoneOtpForm';
import OtpVerificationForm from './otp/OtpVerificationForm';
import OtpLinks from './otp/OtpLinks';

const OTPForm: React.FC = () => {
  const { t } = useTranslation();
  const { requestOTP, verifyOTP, loading } = useAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email or phone from URL query params if available
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    if (email) {
      setAuthMethod('email');
      setIdentifier(email);
      setShowVerificationForm(true);
      requestOTP(email);
    } else if (phone) {
      setAuthMethod('phone');
      setIdentifier(phone);
      setShowVerificationForm(true);
      requestOTP(phone);
    }
  }, [location]);

  // Handle countdown for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailSubmit = async (email: string) => {
    try {
      await requestOTP(email);
      setIdentifier(email);
      setShowVerificationForm(true);
      setCountdown(60); // Set 60 seconds countdown for resend button
      
      toast({
        title: t('auth.verificationSent'),
        description: t('auth.checkEmail'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.otpRequestFailed'),
      });
    }
  };

  const handlePhoneSubmit = async (phone: string) => {
    try {
      await requestOTP(phone);
      setIdentifier(phone);
      setShowVerificationForm(true);
      setCountdown(60); // Set 60 seconds countdown for resend button
      
      toast({
        title: t('auth.verificationSent'),
        description: t('auth.checkPhone'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.otpRequestFailed'),
      });
    }
  };

  const handleVerifySubmit = async (code: string) => {
    try {
      setVerificationStatus('idle');
      await verifyOTP(identifier, code);
      setVerificationStatus('success');
      
      // Show success message
      toast({
        title: t('auth.verificationSuccessful'),
        description: t('auth.redirectingToAccount'),
      });
      
      // Redirect to main page after successful verification
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setVerificationStatus('error');
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.invalidCode'),
      });
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await requestOTP(identifier);
      setCountdown(60);
      
      toast({
        title: t('auth.codeSent'),
        description: t('auth.newCodeSent'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.resendFailed'),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {showVerificationForm ? t('auth.verifyCode') : t('auth.continueWith') + ' OTP'}
        </h1>
        {!showVerificationForm && (
          <p className="text-sm text-muted-foreground">
            {t('auth.sendCode')}
          </p>
        )}
      </div>

      {!showVerificationForm ? (
        <Tabs
          defaultValue="email"
          onValueChange={(value) => setAuthMethod(value as 'email' | 'phone')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
            <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <EmailOtpForm 
              onFormSubmit={handleEmailSubmit} 
              loading={loading} 
            />
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <PhoneOtpForm 
              onFormSubmit={handlePhoneSubmit} 
              loading={loading} 
            />
          </TabsContent>
        </Tabs>
      ) : (
        <OtpVerificationForm
          onVerify={handleVerifySubmit}
          onBack={() => setShowVerificationForm(false)}
          onResend={handleResendOTP}
          identifier={identifier}
          loading={loading}
          countdown={countdown}
          verificationStatus={verificationStatus}
        />
      )}

      <OtpLinks />
    </div>
  );
};

export default OTPForm;
