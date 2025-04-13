
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OtpLinks: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center space-y-2">
      <div>
        <Link
          to="/auth/login"
          className="text-sm underline-offset-4 hover:underline text-primary"
        >
          {t('auth.login')}
        </Link>
      </div>
      <div>
        <Link
          to="/auth/signup"
          className="text-sm underline-offset-4 hover:underline text-primary"
        >
          {t('auth.signup')}
        </Link>
      </div>
    </div>
  );
};

export default OtpLinks;
