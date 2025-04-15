
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LoginRequired: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('auth.loginRequired')}</h2>
        <p className="mb-4">{t('messages.loginToChat')}</p>
        <Button onClick={() => navigate('/auth/login')}>{t('auth.login')}</Button>
      </div>
    </div>
  );
};

export default LoginRequired;
