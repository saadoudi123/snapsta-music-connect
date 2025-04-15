
import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyConversation: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/20">
      <div className="text-center max-w-md px-4">
        <h3 className="text-2xl font-bold mb-2">{t('messages.selectConversation')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('messages.selectContactToChat')}
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('messages.newChat')}
        </Button>
      </div>
    </div>
  );
};

export default EmptyConversation;
