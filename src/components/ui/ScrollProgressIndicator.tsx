import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'react-i18next';

interface Section {
  id: string;
  name: string;
}

const ScrollProgressIndicator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Build sections dynamically from DOM to match actual page order
  useEffect(() => {
    const main = document.querySelector('#main-content') as HTMLElement | null;
    let nodes: HTMLElement[] = [];
    if (main) {
      nodes = Array.from(main.querySelectorAll(':scope > section[data-section]')) as HTMLElement[];
    } else {
      nodes = Array.from(document.querySelectorAll('section[data-section]')) as HTMLElement[];
    }

    // Preserve order while removing duplicates
    const uniqueIds: string[] = [];
    nodes.forEach((n) => {
      const id = n.getAttribute('data-section');
      if (id && !uniqueIds.includes(id)) {
        uniqueIds.push(id);
      }
    });

    const labelFor = (id: string) => {
      switch (id) {
        case 'hero':
          return t('scroll_progress.beginning', 'البداية');
        case 'services':
          return isRTL ? 'من نحن' : 'About Us';
        case 'categories':
          return isRTL ? 'خدماتنا' : 'Our services';
        case 'journey-achievements':
          return t('home.about.project_journey', 'رحلة نجاحك');
        case 'testimonials':
          return t('testimonials.title', 'رحلة نجاحك');
        case 'clients':
          return t('clients.title', 'عملاؤنا');
        case 'faq':
          return t('faq.title', 'الأسئلة الشائعة');
        case 'contact':
          return t('contact.title', 'تواصل معنا');
        default:
          return id;
      }
    };

    setSections(uniqueIds.map((id) => ({ id, name: labelFor(id) })));
  }, [t]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;

    let currentSectionIndex = 0;
    const main = document.querySelector('#main-content') as HTMLElement | null;
    for (let i = 0; i < sections.length; i++) {
      const selector = `:scope > section[data-section="${sections[i].id}"]`;
      const element = main ? main.querySelector(selector) : document.querySelector(`section[data-section="${sections[i].id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        if (scrollTop >= elementTop - 200) {
          currentSectionIndex = i;
        }
      }
    }
    setCurrentSection(currentSectionIndex);

    // Control visibility: hide indicator while hero section is in view
    const hero = main 
      ? main.querySelector(':scope > section[data-section="hero"]') 
      : document.querySelector('section[data-section="hero"]');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      // Show only after hero is mostly out of view
      setIsVisible(rect.bottom <= 100);
    } else {
      // Fallback: show after slight scroll
      setIsVisible(scrollTop > 100);
    }
  }, [sections]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSectionClick = useCallback((index: number) => {
    const section = sections[index];
    const main = document.querySelector('#main-content') as HTMLElement | null;
    const element = main 
      ? main.querySelector(`:scope > section[data-section="${section.id}"]`) 
      : document.querySelector(`section[data-section="${section.id}"]`);
    
    element?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  }, [sections]);

  // المؤشر يظهر فقط بعد تجاوز الهيرو

  return (
    <div className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block ${isVisible ? '' : 'opacity-0 pointer-events-none'}`}>
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
      <div 
        className="relative"
        style={{ height: `${40 + (sections.length * 35)}px` }}
      >
        <div className="absolute left-2 top-0 w-0.5 h-full bg-gradient-to-b from-[#24a27b] to-[#24a27b]"></div>
        
        {/* Start point (non-interactive) */}
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