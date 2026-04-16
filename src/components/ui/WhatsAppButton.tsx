import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WhatsAppButton: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const location = useLocation();
  const phoneNumber = '+966535166370';
  const message = 'عندي استفسار عن خدماتكم';

  useEffect(() => {
    const footerElement = document.querySelector('.gf-root') || document.querySelector('footer');
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px 0px 0px' }
    );

    observer.observe(footerElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
      setIsVisible(false);
      return;
    }

    if (isFooterVisible) {
      setIsVisible(false);
      return;
    }

    if (location.pathname === '/') {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 300 && !isFooterVisible);
        setRotation(scrollTop / 1);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsVisible(!isFooterVisible);
      setRotation(0);
    }
  }, [location.pathname, isFooterVisible]);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isVisible) return null;

  return (
    // معكوس: RTL -> يمين (right-4), LTR -> يسار (left-4)
    <div className={`fixed bottom-6 z-50 sm:bottom-8 ${isRTL ? 'right-4 sm:right-6' : 'left-4 sm:left-6'}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes whatsapp-glow {
            0%, 100% { box-shadow: 0 4px 20px rgba(24, 181, 213, 0.3); }
            50% { box-shadow: 0 4px 30px rgba(24, 181, 213, 0.6), 0 0 20px rgba(24, 181, 213, 0.4); }
          }
        `
      }} />
      <button
        onClick={handleWhatsAppClick}
        className="group relative text-white glassmorphism shadow-2xl transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #24a27b 0%, #16684eff 100%)',
          width: '90px',
          height: '90px',
          borderRadius: '30px',
          transform: `rotate(${rotation}deg) scale(${isVisible ? 1 : 0})`,
          transition: 'transform 0.1s ease-out'
        }}
        aria-label={t('whatsapp_button.contact_us')}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${-rotation}deg)`, transition: 'transform 0.1s ease-out' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:scale-110">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488" fill="white"/>
          </svg>
        </div>
        
        {/* Tooltip معكوس: RTL -> left-full ml-4, LTR -> right-full mr-4 */}
        <div className={`hidden sm:block absolute top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-semibold z-20 ${isRTL ?  'right-full mr-4' : 'left-full ml-4' }`}>
          💬 {"تواصل معنا فورآ"}
        </div>
      </button>
    </div>
  );
};

export default WhatsAppButton;