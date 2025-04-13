
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';

const AuthSeparator = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{t('auth.or')}</span>
      </div>
    </div>
  );
};

export default AuthSeparator;
