import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import hero from '../../assets/hhero.webp';
import heroMobile from '../../assets/herrro.jpeg';

const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const mobileImgRef = useRef<HTMLImageElement | null>(null);
  const desktopImgRef = useRef<HTMLImageElement | null>(null);
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase();
  const isEnglish = currentLang.startsWith('en');

  useEffect(() => {
    // Apply native fetch priority via DOM to avoid React warning and TS typing issues
    mobileImgRef.current?.setAttribute('fetchpriority', 'high');
    desktopImgRef.current?.setAttribute('fetchpriority', 'high');
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden pt-28 bg-black" data-section="hero">
      {/* صورة الموبايل - تظهر أقل من 768px */}
      <img
        ref={mobileImgRef}
        src={heroMobile}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover md:hidden z-0"
        loading="eager"
        decoding="async"
      />
      
      {/* صورة الديسكتوب - تظهر من 768px وأكثر */}
      <img
        ref={desktopImgRef}
        src={hero}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
        loading="eager"
        decoding="async"
      />

      {/*
        Sidebars — LEFT (Contact Info) and RIGHT (Social Links) commented out per request

        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex">
          <div className="relative pr-8 flex flex-col items-end space-y-6">
            <a 
              href="tel:+02010947354" 
              className="text-white text-sm font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              dir="ltr"
            >
              +201010947354
            </a>
            <span 
              className="text-white text-sm font-light tracking-wider"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              |
            </span> 
            <a  
              href="mailto:info@ufuq-digital.com 
" 
              className="text-white text-sm font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              info@ufuq-digital.com 
            </a> 
          </div>
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex">
          <div className="relative pl-8 flex flex-col items-start space-y-6">
            <a 
              href="https://wa.me/966543098895" 
              className="text-white text-xs font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              WhatsApp
            </a>
            <span 
              className="text-white text-xs font-light tracking-wider"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              |
            </span> 
            <a 
              href="https://www.snapchat.com/@ufuqdigital?share_id=IrYR7CBgmec&locale=en-US" 
              className="text-white text-xs font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Snapchat
            </a>
            <span 
              className="text-white text-xs font-light tracking-wider"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              |
            </span> 
            <a 
              href="https://www.instagram.com/ufuqdigital/?utm_source=qr&igsh=MTk5ZTlkZXl4ZGNmOA%3D%3D#" 
              className="text-white text-xs font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Instagram
            </a>
            <span 
              className="text-white text-xs font-light tracking-wider"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              |
            </span> 
            <a 
              href="https://www.facebook.com/UfuqDigitalcom" 
              className="text-white text-xs font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Facebook
            </a>
            <span 
              className="text-white text-xs font-medium tracking-wider mt-4" 
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Follow Us —
            </span>
          </div>
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        </div>
      */}

      {/* Main Content - الموبايل زي ما هو، والديسكتوب تحت سيطرتك */}
<div className="relative z-10 h-full w-full">

  {/* الموبايل فقط – نفس ألوان الديسكتوب + مرفوعة فوق شوية */}
  {/* الموبايل – سطر واحد بالكامل + ألوان سيلفر وأخضر غامق + مرفوعة فوق */}
  {isEnglish ? (
    <h1
      className="block md:hidden text-[12px] sm:text-sm font-bold tracking-tight leading-none text-center font-cairo px-6 absolute inset-x-0 whitespace-nowrap"
      style={{ top: '10%' }}
      dir="ltr"
    >
      <span className="text-gray-300">Towards </span>
      <span className="text-green-700 font-extrabold text-[12px] sm:text-sm">Ufuq</span>
      <span className="text-gray-300"> a new horizon of digital creativity</span>
    </h1>
  ) : (
    <h1
      className="block md:hidden text-2xl sm:text-3xl font-bold tracking-tight text-center font-cairo px-6 absolute inset-x-0"
      style={{ top: '10%' }}
    >
      <span className="text-gray-300">نحو </span>
      <span className="text-green-700 font-extrabold text-2xl sm:text-3xl">أُفق</span>
      <span className="text-gray-300"> جديد من الإبداع الرقمي</span>
    </h1>
  )}

  {/* === الديسكتوب: جملة سطر واحد + كلمة "أُفق" خضرا غامق === */}
{/* === الديسكتوب فقط: أُفق أخضر غامق + الباقي سيلفر فاتح ناصع === */}
<div className="hidden md:block absolute top-[50%] left-[15%] -translate-y-1/2">
  {isEnglish ? (
    <h1 className="text-xl lg:text-3xl font-bold tracking-wider text-left font-cairo whitespace-nowrap" dir="ltr">
      <span className="text-gray-300">Towards </span>
      <span className="text-green-700">Ufuq</span>
      <span className="text-gray-300"> a new horizon of digital creativity</span>
    </h1>
  ) : (
    <h1 className="text-3xl lg:text-5xl font-bold tracking-wider text-right font-cairo whitespace-nowrap">
      <span className="text-gray-300">نحو </span>
      <span className="text-green-700">أُفق</span>
      <span className="text-gray-300"> جديد من الإبداع الرقمي</span>
    </h1>
  )}
</div>

</div>
    </section>
  );
};

export default HeroSection;
