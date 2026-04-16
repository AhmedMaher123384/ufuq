import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import hero from '../../assets/hhh.png';
import heroMobile from '../../assets/mob.png';

const BTN_POSITION = {
  desktop: { top: '75%', left: '51%' },
  mobile:  { top: '72%', left: '50%' }, // تم التعديل هنا
};

const HeroSection: React.FC = () => {
  const { i18n } = useTranslation();
  const mobileImgRef  = useRef<HTMLImageElement | null>(null);
  const desktopImgRef = useRef<HTMLImageElement | null>(null);
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase();
  const isEnglish = currentLang.startsWith('en');

  useEffect(() => {
    mobileImgRef.current?.setAttribute('fetchpriority', 'high');
    desktopImgRef.current?.setAttribute('fetchpriority', 'high');
  }, []);

  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&display=swap');

        @keyframes borderRotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 130%; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(0,180,70,0.4); }
          50%       { opacity: 0.6; transform: scale(0.75); box-shadow: 0 0 0 4px rgba(0,180,70,0); }
        }

        .hero-buttons-group {
          position: absolute;
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
        }

        @media (max-width: 767px) {
          .hero-buttons-group {
            gap: 10px;
            width: 100%;
            padding: 0 12px;
            top: ${BTN_POSITION.mobile.top};
            left: ${BTN_POSITION.mobile.left};
          }

          .hero-btn {
            flex: 1;
            justify-content: center;
            padding: 10px 12px;
            font-size: 12px;
          }

          .hero-btn-arrow { width: 12px; height: 12px; }
          .hero-btn-dot { width: 5px; height: 5px; }

          /* تقليل الأنيميشن */
          .hero-btn::after {
            animation: none;
          }

          .hero-btn-wrapper::before {
            animation: none;
          }
        }

        @media (min-width: 768px) {
          .hero-buttons-group {
            top: ${BTN_POSITION.desktop.top};
            left: ${BTN_POSITION.desktop.left};
          }

          .hero-btn { padding: 8px 22px; font-size: 13px; }
          .hero-btn-arrow { width: 14px; height: 14px; }
          .hero-btn-dot { width: 6px; height: 6px; }
        }

        .hero-btn-wrapper {
          position: relative;
          display: inline-flex;
          border-radius: 40px;
          padding: 2px;
          overflow: hidden;
          isolation: isolate;
        }

        .hero-btn-wrapper::before {
          content: '';
          position: absolute;
          inset: -100%;
          width: 300%;
          height: 300%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 60deg,
            #00aa55 90deg,
            #008844 110deg,
            #005522 140deg,
            transparent 170deg,
            transparent 360deg
          );
          animation: borderRotate 2.4s linear infinite;
          z-index: 0;
        }

        .hero-btn-inner-bg {
          position: absolute;
          inset: 2px;
          border-radius: 38px;
          background: #051a0c;
          z-index: 1;
        }

        .hero-btn {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 38px;
          background: linear-gradient(135deg, #052210 0%, #073518 25%, #0a4620 50%, #073818 75%, #04240e 100%);
          font-family: 'Cairo', sans-serif;
          font-weight: 800;
          color: #c0e0cc;
          letter-spacing: 0.02em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.05); /* تحسين الشكل */
          outline: none;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), color 0.2s ease;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 12px rgba(0,60,20,0.4);
        }

        .hero-btn.services-btn {
          background: linear-gradient(135deg, #16161b 0%, #1a1a22 25%, #22222c 50%, #1c1c24 75%, #121216 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.5);
        }

        .hero-btn.services-btn:hover { color: #e0e0ff; }

        .hero-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -70%;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100,200,130,0.08), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
        }

        .hero-btn:hover  { transform: scale(1.045); color: #e0faea; }
        .hero-btn:active { transform: scale(0.97); }

        .hero-btn-dot {
          border-radius: 50%;
          background: #4dff8f;
          flex-shrink: 0;
          animation: dotPulse 2.2s ease-in-out infinite;
        }

        .hero-btn-arrow {
          flex-shrink: 0;
          opacity: 0.7;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .hero-btn:hover .hero-btn-arrow { transform: translateX(2px); opacity: 1; }
      `}</style>

      <section className="relative h-screen w-full overflow-hidden pt-28 bg-black">
        <img ref={mobileImgRef} src={heroMobile} alt="" role="presentation" className="absolute inset-0 w-full h-full object-cover md:hidden z-0" loading="eager" decoding="async" />
        <img ref={desktopImgRef} src={hero} alt="" role="presentation" className="absolute inset-0 w-full h-full object-cover hidden md:block z-0" loading="eager" decoding="async" />

        <div className="relative z-10 h-full w-full">
          <div className="hero-buttons-group">

            <div className="hero-btn-wrapper">
              <span className="hero-btn-inner-bg" aria-hidden="true" />
              <Link to="/contact" className="hero-btn" dir={isEnglish ? 'ltr' : 'rtl'}>
                <span className="hero-btn-dot" />
                {isEnglish ? 'Contact Us' : 'تواصل معنا'}
                <svg className="hero-btn-arrow" viewBox="0 0 24 24" fill="none">
                  <path d={isEnglish ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} stroke="#c0c0c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="hero-btn-wrapper">
              <span className="hero-btn-inner-bg" aria-hidden="true" />
              <a href="#services" onClick={scrollToServices} className="hero-btn services-btn" dir={isEnglish ? 'ltr' : 'rtl'}>
                <span className="hero-btn-dot" />
                {isEnglish ? 'Our Services' : 'خدماتنا'}
                <svg className="hero-btn-arrow" viewBox="0 0 24 24" fill="none">
                  <path d={isEnglish ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} stroke="#c0c0c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;