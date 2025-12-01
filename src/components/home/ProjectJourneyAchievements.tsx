import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';

// عدّاد متحرك للإنجازات
const useCountUp = (end: number, duration: number = 2500, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | undefined;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      setCount(currentCount);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else setCount(end);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);
  return count;
};

interface AnimatedCounterProps {
  number: string;
  label: string;
  shouldAnimate: boolean;
  delay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ number, label, shouldAnimate, delay = 0 }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { value, suffix } = React.useMemo(() => {
    const match = number.match(/(\d+)(.*)/);
    if (match) return { value: parseInt(match[1]), suffix: match[2] };
    return { value: 0, suffix: number };
  }, [number]);

  const count = useCountUp(value, 2500, startAnimation);

  useEffect(() => {
    if (shouldAnimate) {
      const t = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setStartAnimation(true), 100);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [shouldAnimate, delay]);

  const displayValue = value ? `${count}${suffix}` : number;

  return (
    <div
      className={`group/card relative h-full transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-2xl opacity-30 blur-sm group-hover/card:opacity-60 transition-opacity duration-500"></div>
      <div className="relative bg-[#1c1c24] rounded-2xl p-5 sm:p-6 h-full backdrop-blur-2xl border border-[#8F93A5]/10 hover:border-[#8F93A5]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#8F93A5]/20">
        <div className="text-center">
          <div className="font-black text-3xl sm:text-4xl md:text-5xl text-[#8F93A5] mb-2 group-hover/card:scale-110 transition-transform duration-500">
            {displayValue}
          </div>
          <div className="text-white/70 text-xs sm:text-sm font-medium group-hover/card:text-white/90 transition-colors duration-300">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectJourneyAchievements: React.FC = () => {
  const { t } = useTranslation();

  // مراجع العرض
  const journeyRef = useRef<HTMLElement | null>(null);
  const achievementsRef = useRef<HTMLElement | null>(null);
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.1 });
  const achievementsInView = useInView(achievementsRef, { once: true, amount: 0.3 });

  // خطوات رحلة المشروع
  interface Step {
    number: string;
    title: string;
    description: string;
    details: string[];
  }

  const steps: Step[] = [
    { number: '01', title: t('home.about.steps.discovery'), description: t('home.about.steps.discovery_desc'), details: t('home.about.steps.discovery_details', { returnObjects: true }) as string[] },
    { number: '02', title: t('home.about.steps.approach'), description: t('home.about.steps.approach_desc'), details: t('home.about.steps.approach_details', { returnObjects: true }) as string[] },
    { number: '03', title: t('home.about.steps.planning'), description: t('home.about.steps.planning_desc'), details: t('home.about.steps.planning_details', { returnObjects: true }) as string[] },
    { number: '04', title: t('home.about.steps.creativity'), description: t('home.about.steps.creativity_desc'), details: t('home.about.steps.creativity_details', { returnObjects: true }) as string[] },
    { number: '05', title: t('home.about.steps.assembly'), description: t('home.about.steps.assembly_desc'), details: t('home.about.steps.assembly_details', { returnObjects: true }) as string[] },
    { number: '06', title: t('home.about.steps.launch'), description: t('home.about.steps.launch_desc'), details: t('home.about.steps.launch_details', { returnObjects: true }) as string[] },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleStep = (i: number) => setActiveIndex(activeIndex === i ? null : i);

  // إنجازات (لماذا تختارنا)
  const achievements = [
    { number: '4', label: t('home.about.stats.number_countries') },
    { number: '+548', label: t('home.about.stats.completed_projects') },
    { number: '24/7', label: t('home.about.stats.technical_support') },
    { number: '+460', label: t('home.about.stats.satisfied_clients') },
    { number: '5', label: t('home.about.stats.years_experience') },
  ];

  return (
    <>
      {/* Project Journey */}
      <section ref={journeyRef} className="py-10 lg:py-20 bg-[#16161B]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-6 lg:mb-16">
            <h2 className="text-xl sm:text-2xl lg:text-5xl font-black text-white">
              <span className="inline-block bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
                {t('home.about.project_journey')}
              </span>
            </h2>
            <p className="text-white/70 mt-3 text-sm lg:text-lg max-w-2xl mx-auto hidden lg:block">
              {t('home.about.project_journey_description')}
            </p>
          </div>

          {/* Desktop (6 خطوات) */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute top-12 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#8F93A5]/30 to-transparent"></div>
              <div className="grid grid-cols-6 gap-8">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={journeyInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="group/card relative flex flex-col items-center"
                  >
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-full opacity-0 blur-xl group-hover/card:opacity-50 transition-opacity duration-700 pointer-events-none"></div>
                    <div className="relative z-10 w-24 h-24 bg-[#1c1c24] rounded-full border-4 border-[#8F93A5]/30 flex flex-col items-center justify-center transition-all duration-700 group-hover/card:border-[#8F93A5] group-hover/card:scale-110 group-hover/card:shadow-2xl group-hover/card:shadow-[#8F93A5]/50">
                      <span className="text-[#8F93A5] font-black text-2xl">{step.number}</span>
                    </div>
                    <div className="mt-8 text-center max-w-xs">
                      <h4 className="font-bold text-white text-base mb-2 group-hover/card:text-[#8F93A5] transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-white/60 text-sm mb-4">{step.description}</p>
                      <div className="space-y-3 max-h-0 opacity-0 overflow-hidden transition-all duration-700 group-hover/card:max-h-64 group-hover/card:opacity-100">
                        {step.details.map((d, j) => (
                          <div key={j} className="flex items-center justify-center gap-3 text-sm text-white/70">
                            <CheckCircle className="w-5 h-5 text-[#8F93A5]" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet */}
          <div className="lg:hidden">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={journeyInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex flex-col"
                >
                  <div className="w-full cursor-pointer" onClick={() => toggleStep(i)} dir="auto">
                    <div className="flex items-start gap-2.5 p-3 bg-[#1c1c24] rounded-xl border border-[#8F93A5]/10 hover:border-[#8F93A5]/30 transition-colors">
                      <div className="flex-shrink-0 w-9 h-9 bg-[#1c1c24] rounded-full border border-[#8F93A5]/50 flex items-center justify-center">
                        <span className="text-[#8F93A5] font-black text-xs">{step.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm sm:text-base leading-tight">{step.title}</h4>
                        <p className="text-white/60 text-[11px] sm:text-xs leading-tight mt-0.5">{step.description}</p>
                      </div>
                    </div>
                    <div className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-[#1c1c24]/70 rounded-xl p-3 border border-[#8F93A5]/20">
                        <div className="space-y-1.5">
                          {step.details.map((detail, j) => (
                            <div key={j} className="flex items-start gap-2 text-[11px] sm:text-xs text-white/70">
                              <CheckCircle className="w-3 h-3 text-[#8F93A5] mt-0.5 flex-shrink-0" />
                              <span className="leading-tight">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements (لماذا تختارنا) */}
      <section ref={achievementsRef} className="py-16 sm:py-20 bg-[#16161B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              <span className="inline-block bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
                {t('home.about.why_choose_us')}
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {achievements.map((ach, i) => (
              <AnimatedCounter key={i} number={ach.number} label={ach.label} shouldAnimate={achievementsInView} delay={i * 150} />
            ))}
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

export default ProjectJourneyAchievements;