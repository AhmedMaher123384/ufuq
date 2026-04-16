import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const ScrollToTopButton: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    // معكوس: RTL -> يمين (right-3), LTR -> يسار (left-3)
    <div className={`fixed top-1/2 -translate-y-1/2 z-40 hidden md:block ${isRTL ? 'right-3' : 'left-3'}`}>
      <button
        onClick={scrollToTop}
        aria-label={t('scroll_to_top.scroll_up')}
        className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-300"
      >
        <div className="flex flex-col items-center" style={{ color: "#24a27b" }}>
          <div className="text-lg font-bold">▲</div>
          <div className="w-0.5 h-6 bg-current"></div>
        </div>
        <span className="text-[#8F93A5] text-sm tracking-widest" style={{ writingMode: 'vertical-rl' }}>
          {t('scroll_to_top.scroll_up')}
        </span>
      </button>
    </div>
  );
};

export default ScrollToTopButton;