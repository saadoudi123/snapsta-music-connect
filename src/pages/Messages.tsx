
import React from "react";
import { useTranslation } from "react-i18next";
import MessagesContainer from "./messages/MessagesContainer";

const Messages: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <MessagesContainer />
    </div>
  );
};

export default Messages;
