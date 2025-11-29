import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check, Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('selectedLanguage', langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group flex items-center gap-1 text-xs"
      >
        <div className="flex items-center gap-1">
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="font-medium text-white/90 text-[10px] sm:text-xs">{currentLanguage.code.toUpperCase()}</span>
        </div>
        <ChevronDown className={`w-3 h-3 transition-all duration-300 text-white/70 ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} />
      </button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-40 bg-white/10 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="px-2 py-1.5 border-b border-white/15 bg-white/5">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-white/90">
              <Languages className="w-2.5 h-2.5" />
              {t('common.language', 'اللغة')}
            </div>
          </div>

          {/* Language Options */}
          <div className="p-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-300 mb-0.5 ${
                  currentLanguage.code === language.code
                    ? 'bg-cyan-500/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm">{language.flag}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{language.nativeName}</div>
                </div>
                {currentLanguage.code === language.code && (
                  <Check className="w-2.5 h-2.5 text-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;