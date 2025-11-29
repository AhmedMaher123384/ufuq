import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import hero from '../../assets/herro.jpg'; // ← اسم الملف كما طلبت: "herro.jpg"

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  const titlePart1 = t("home.hero.titlePart1");
  const titlePart11 = t("home.hero.titlePart11");
  const titlePart2 = t("home.hero.titlePart2");
  const subtitle = t("home.hero.subtitle");

  return (
    <section className="relative h-screen w-full overflow-hidden pt-28 bg-black" data-section="hero">
      {/* الصورة تغطي القسم كله (بدون بلور، بأعلى جودة) */}
      <img
        src={hero}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover z-0" // ← object-cover لتمتد على كامل المساحة
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      {/* ⚠️ تم إزالة الـ gradient overlay تمامًا حسب رغبتك — الصورة نقية 100% */}

      {/* Sidebars — LEFT (Contact Info) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex">
        <div className="relative pr-8 flex flex-col items-end space-y-6">
          <a 
            href="tel:+966543098895" 
            className="text-white text-sm font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            dir="ltr"
          >
            +966 54 309 8895
          </a>
          <span 
            className="text-white text-sm font-light tracking-wider"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            |
          </span> 
          <a 
            href="mailto:info@fasslasoftware.com" 
            className="text-white text-sm font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            info@UfuqDigital.com 
          </a> 
        </div>
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Sidebars — RIGHT (Social Links) */}
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
            href="https://www.linkedin.com/company/fassla-software" 
            className="text-white text-xs font-light tracking-wider hover:text-[#7e22ce] transition-all duration-300 cursor-pointer"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            LinkedIn
          </a>
          <span 
            className="text-white text-xs font-light tracking-wider"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            |
          </span> 
          <a 
            href="https://www.instagram.com/fasslasoftware" 
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
            href="https://www.facebook.com/fasslasoftware" 
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-6 sm:px-8 space-y-8 pb-24">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tight leading-[1.05] font-cairo">
          <span className="block text-white">{titlePart1}</span>
        </h1>
        <h1 className="flex items-baseline gap-2 text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tight leading-[1.05] font-cairo">
          <span className="text-white">{titlePart11}</span>
          <span className="bg-gradient-to-r from-[#24a67b] to-[#24a67b] bg-clip-text text-transparent">{titlePart2}</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-3xl leading-relaxed font-light px-4 font-cairo">
          {subtitle}
        </p>

        {/* Scroll Indicator */}
        <button
          type="button"
          aria-label="Scroll to next section"
          onClick={() => {
            const currentSection = document.querySelector('[data-section="hero"]');
            const nextSection = currentSection?.nextElementSibling;
            if (nextSection && 'scrollIntoView' in nextSection) {
              (nextSection as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="group absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center items-start p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce-slow"></div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;