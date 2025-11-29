import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'react-i18next';

interface Section {
  id: string;
  name: string;
}

const ScrollProgressIndicator: React.FC = () => {
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const sections: Section[] = [
    { id: "hero", name: t('scroll_progress.beginning') },
    { id: "services", name: t('scroll_progress.why_us') },
    { id: "clients", name: t('scroll_progress.our_clients') },
    { id: "our services", name: t('scroll_progress.our_products') },
    { id: "testimonials", name: t('scroll_progress.client_reviews') },
    { id: "faq", name: t('scroll_progress.faq') },
    { id: "contact", name: t('scroll_progress.contact_us') },
  ];

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    setIsVisible(scrollTop > 200);

    let currentSectionIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      const element = document.querySelector(`[data-section="${sections[i].id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        if (scrollTop >= elementTop - 200) {
          currentSectionIndex = i;
        }
      }
    }
    setCurrentSection(currentSectionIndex);
  }, [sections]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSectionClick = useCallback((index: number) => {
    const section = sections[index];
    const element = 
      document.querySelector(`#${section.id}`) ||
      document.querySelector(`[data-section="${section.id}"]`);
    
    element?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  }, [sections]);

  if (!isVisible) return null;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes whatsapp-glow {
            0%, 100% {
              box-shadow: 0 4px 20px rgba(64, 69, 70, 0.3);
            }
            50% {
              box-shadow: 0 4px 30px rgba(53, 68, 71, 0.6), 0 0 20px rgba(84, 91, 93, 0.4);
            }
          }
          
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          
          .animate-wiggle:hover {
            animation: wiggle 1s ease-in-out infinite alternate;
          }
          
          .white-dot {
            background: white;
            border: 1px solid #9d9d9d80;
          }
          
          .active-dot {
            background: #24a27b;
            animation: whatsapp-glow 2s ease-in-out infinite;
          }
          
          .active-text {
            text-shadow: 0 0 8px #24a27b;
          }
        `
      }} />
      {/* Main line */}
      <div className="relative h-80">
        <div className="absolute left-2 top-0 w-0.5 h-full bg-gradient-to-b from-[#24a27b] to-[#24a27b]"></div>
        
        {/* Start point */}
        <div className="absolute left-0.5 top-0 w-4 h-4 active-dot rounded-full"></div>
        
        {/* Middle points */}
        {sections.map((section, index) => (
          <div key={section.id} className="relative">
            {/* Point */}
            <div 
              className={`absolute w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentSection 
                  ? 'scale-125 active-dot' 
                  : 'white-dot hover:scale-125 animate-wiggle'
              }`}
              style={{ 
                left: '5px', 
                top: `${30 + (index * 35)}px` 
              }}
              onClick={() => handleSectionClick(index)}
            ></div>
            
            {/* Text */}
            <div 
              className={`absolute cursor-pointer transition-all duration-300 ${
                index === currentSection 
                  ? 'text-[#24a27b] font-semibold active-text' 
                  : 'text-[#8F93A5] hover:text-[#16161b]'
              }`}
              style={{ 
                left: '20px', 
                top: `${22 + (index * 35)}px` 
              }}
              onClick={() => handleSectionClick(index)}
            >
              <span className="text-sm whitespace-nowrap font-medium">{section.name}</span>
            </div>
          </div>
        ))}
        
        {/* End point */}
        <div className="absolute left-0.5 bottom-0 w-4 h-4 active-dot rounded-full"></div>
      </div>
    </div>
  );
};

export default ScrollProgressIndicator;