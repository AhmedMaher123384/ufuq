import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const DynamicToastContainer: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase();
  const isRTL = currentLang.startsWith('ar');

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={isRTL}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{
        fontSize: '14px',
        fontFamily: 'inherit'
      }}
    />
  );
};

export default DynamicToastContainer;
