import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroImage from '../../assets/aboutt.jpg';

// ========== Animated Counter (محسن) ==========
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | undefined;
    let frame: number;
    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setCount(end);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, shouldStart]);
  return count;
};

interface AnimatedCounterProps {
  number: string;
  label: string;
  shouldAnimate: boolean;
  delay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = React.memo(({ number, label, shouldAnimate, delay = 0 }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { value, suffix } = useMemo(() => {
    const match = number.match(/(\d+)(.*)/);
    if (match) return { value: parseInt(match[1]), suffix: match[2] };
    return { value: 0, suffix: number };
  }, [number]);
  const count = useCountUp(value, 2000, startAnimation);

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setStartAnimation(true), 80);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay]);

  const displayValue = value ? `${count}${suffix}` : number;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="group/card relative h-full"
    >
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-2xl opacity-30 blur-sm group-hover/card:opacity-60 transition-opacity duration-500" />
      <div className="relative bg-[#1c1c24] rounded-2xl p-5 sm:p-6 h-full backdrop-blur-2xl border border-[#8F93A5]/10 hover:border-[#8F93A5]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#8F93A5]/20">
        <div className="text-center">
          <div className="font-black text-3xl sm:text-4xl md:text-5xl text-[#8F93A5] mb-2 group-hover/card:scale-110 transition-transform duration-500">
            {displayValue}
          </div>
          <div className="text-white/70 text-xs sm:text-sm font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
});

const AboutUsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const achievementsInView = useInView(achievementsRef, { once: true, amount: 0.3 });

  const achievements = useMemo(() => [
    { number: '4', label: t('home.about.stats.number_countries') },
    { number: '+548', label: t('home.about.stats.completed_projects') },
    { number: '24/7', label: t('home.about.stats.technical_support') },
    { number: '+460', label: t('home.about.stats.satisfied_clients') },
    { number: '5', label: t('home.about.stats.years_experience') },
  ], [t]);

  const shimmerAnimation = {
    background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="py-12 md:py-20 bg-[#16161B] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: i18n.language === 'ar' ? 50 : -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex justify-center md:justify-start"
            >
              <img
                src={heroImage}
                alt="Be Group"
                className="w-64 sm:w-72 md:w-80 lg:w-96 rounded-2xl shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: i18n.language === 'ar' ? -50 : 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="space-y-5 md:space-y-7"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us (Achievements) */}
      <section ref={achievementsRef} className="py-16 sm:py-20 bg-[#16161B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              <span style={{ ...shimmerAnimation, animation: 'shimmer 3s linear infinite' }}>
                {t('home.about.why_choose_us')}
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {achievements.map((ach, i) => (
              <AnimatedCounter key={i} number={ach.number} label={ach.label} shouldAnimate={achievementsInView} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};

export default AboutUsSection;