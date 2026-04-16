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

  useEffect(() => {
    const main = document.querySelector('#main-content') as HTMLElement | null;
    let nodes: HTMLElement[] = [];
    if (main) {
      // التعديل هنا: إزالة ':scope >' للبحث عن أي section داخل main
      nodes = Array.from(main.querySelectorAll('section[data-section]')) as HTMLElement[];
    } else {
      nodes = Array.from(document.querySelectorAll('section[data-section]')) as HTMLElement[];
    }

    const uniqueIds: string[] = [];
    nodes.forEach((n) => {
      const id = n.getAttribute('data-section');
      if (id && !uniqueIds.includes(id)) {
        uniqueIds.push(id);
      }
    });

    const labelFor = (id: string) => {
      switch (id) {
        case 'hero': return t('scroll_progress.beginning', 'البداية');
        case 'services': return isRTL ? 'من نحن' : 'About Us';
        case 'categories': return isRTL ? 'خدماتنا' : 'Our services';
        case 'journey-achievements': return t('home.about.project_journey', 'رحلة نجاحك');
        case 'testimonials': return t('testimonials.title', 'رحلة نجاحك');
        case 'clients': return t('clients.title', 'عملاؤنا');
        case 'faq': return t('faq.title', 'الأسئلة الشائعة');
        case 'contact': return t('contact.title', 'تواصل معنا');
        default: return id;
      }
    };

    setSections(uniqueIds.map((id) => ({ id, name: labelFor(id) })));
  }, [t, isRTL]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    let currentSectionIndex = 0;
    const main = document.querySelector('#main-content') as HTMLElement | null;
    for (let i = 0; i < sections.length; i++) {
      // التعديل هنا: إزالة ':scope >'
      const selector = `section[data-section="${sections[i].id}"]`;
      const element = main ? main.querySelector(selector) : document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        if (scrollTop >= elementTop - 200) {
          currentSectionIndex = i;
        }
      }
    }
    setCurrentSection(currentSectionIndex);

    const hero = main ? main.querySelector('section[data-section="hero"]') : document.querySelector('section[data-section="hero"]');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 100) {
        setIsVisible(false);
        return;
      }
    } else if (scrollTop <= 100) {
      setIsVisible(false);
      return;
    }

    const footer = document.querySelector('footer') || document.querySelector('.gf-root');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < windowHeight * 0.5) {
        setIsVisible(false);
        return;
      }
    }

    setIsVisible(true);
  }, [sections]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSectionClick = useCallback((index: number) => {
    const section = sections[index];
    const main = document.querySelector('#main-content') as HTMLElement | null;
    // التعديل هنا: إزالة ':scope >'
    const element = main ? main.querySelector(`section[data-section="${section.id}"]`) : document.querySelector(`section[data-section="${section.id}"]`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sections]);

  return (
    <div 
      className={`fixed top-1/2 -translate-y-1/2 z-50 hidden lg:block transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        [isRTL ? 'left' : 'right']: '24px'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes whatsapp-glow {
            0%, 100% { box-shadow: 0 4px 20px rgba(64, 69, 70, 0.3); }
            50% { box-shadow: 0 4px 30px rgba(53, 68, 71, 0.6), 0 0 20px rgba(84, 91, 93, 0.4); }
          }
          .white-dot { background: white; border: 1px solid #9d9d9d80; }
          .active-dot { background: #24a27b; animation: whatsapp-glow 2s ease-in-out infinite; }
          .active-text { text-shadow: 0 0 8px #24a27b; }
        `
      }} />
      <div className="relative" style={{ height: `${40 + (sections.length * 35)}px` }}>
        <div 
          className="absolute top-0 w-0.5 h-full bg-gradient-to-b from-[#24a27b] to-[#24a27b]"
          style={{ [isRTL ? 'left' : 'right']: '8px' }}
        ></div>
        
        <div 
          className="absolute top-0 w-4 h-4 active-dot rounded-full"
          style={{ [isRTL ? 'left' : 'right']: '2px' }}
        ></div>
        
        {sections.map((section, index) => (
          <div key={section.id} className="relative">
            <div 
              className={`absolute w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${index === currentSection ? 'scale-125 active-dot' : 'white-dot hover:scale-125'}`}
              style={{ 
                top: `${30 + (index * 35)}px`,
                [isRTL ? 'left' : 'right']: '5px'
              }}
              onClick={() => handleSectionClick(index)}
            ></div>
            
            <div 
              className={`absolute cursor-pointer transition-all duration-300 whitespace-nowrap ${index === currentSection ? 'text-[#24a27b] font-semibold active-text' : 'text-[#8F93A5] hover:text-[#16161b]'}`}
              style={{ 
                top: `${22 + (index * 35)}px`,
                [isRTL ? 'left' : 'right']: '20px'
              }}
              onClick={() => handleSectionClick(index)}
            >
              <span className="text-sm font-medium">{section.name}</span>
            </div>
          </div>
        ))}
        
        <div 
          className="absolute bottom-0 w-4 h-4 active-dot rounded-full"
          style={{ [isRTL ? 'left' : 'right']: '2px' }}
        ></div>
      </div>
    </div>
  );
};

export default ScrollProgressIndicator;