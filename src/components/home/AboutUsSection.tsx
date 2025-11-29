import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroImage from '../../assets/aboutt.jpg';


const AboutUsSection = () => {
  const { t } = useTranslation();

  const aboutRef = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });

  const whatWeDoItems = (t('home.about.services', { returnObjects: true }) as string[]) || [];



  return (
    <>
      {/* ==== Hero Section ==== */}
      <section ref={aboutRef} className="py-10 md:py-16 bg-[#16161B] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={aboutInView ? { opacity: 1, x: 0 } : {}} 
              transition={{ duration: 0.8 }}
              className="flex justify-center md:justify-start"
            >
              <img 
                src={heroImage} 
                alt="Be Group" 
                className="w-64 sm:w-72 md:w-80 lg:w-96 rounded-2xl shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-700" 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={aboutInView ? { opacity: 1, x: 0 } : {}} 
              transition={{ duration: 0.8, delay: 0.2 }} 
              className="space-y-4 md:space-y-6"
            >
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white"
                style={{
                  lineHeight: '1.5',
                  paddingTop: '0.2em',
                  paddingBottom: '0.2em',
                }}
              >
                <span style={{
                  background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  lineHeight: '1.6',
                }}>
                  {t('home.about.main_title')}
                </span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed">
                {t('home.about.main_description')}
              </p>
              
              <div className="pt-1">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#8F93A5] mb-2 md:mb-3">
                  {t('home.about.what_we_offer')}
                </h3>
                <ul className="space-y-1.5 md:space-y-2">
                  {whatWeDoItems.map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-2 md:gap-3 text-white/80 text-xs sm:text-sm md:text-base"
                    >
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#8F93A5] rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Shimmer Animation */}
      <style>{`
        @keyframes shimmer { 
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </>
  );
};

export default AboutUsSection;