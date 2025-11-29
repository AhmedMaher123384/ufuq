import React, { useState, useEffect, useRef } from 'react';
import { Quote, User, ChevronLeft, ChevronRight, Star, Sparkles, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockTestimonials } from '../../mock/testimonials';
import { motion, useInView } from 'framer-motion';

// ==== عدّاد متحرك للإنجازات (من AboutUsSection) ====
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

const TestimonialsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar') ?? false;

  // ==== مراجع وأحداث عرض لأقسام الرحلة والإنجازات ====
  const journeyRef = useRef<HTMLElement | null>(null);
  const achievementsRef = useRef<HTMLElement | null>(null);
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.1 });
  const achievementsInView = useInView(achievementsRef, { once: true, amount: 0.3 });

  // ==== خطوات رحلة المشروع (من AboutUsSection) ====
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
  const [maxVisible, setMaxVisible] = useState(-1);

  useEffect(() => {
    if (journeyInView) {
      const timer = setTimeout(() => {
        steps.forEach((_, i) => {
          setTimeout(() => setMaxVisible(i), i * 180);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [journeyInView]);

  const toggleStep = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  // ==== إنجازات (لماذا تختارنا) ====
  const achievements = [
    { number: '3', label: t('home.about.stats.number_countries') },
    { number: '+548', label: t('home.about.stats.completed_projects') },
    { number: '24/7', label: t('home.about.stats.technical_support') },
    { number: '+460', label: t('home.about.stats.satisfied_clients') },
    { number: '5', label: t('home.about.stats.years_experience') },
  ];

  // تحديد عدد الكروت
  const cardsPerPage = isMobile ? 2 : 4;
  const totalPages = Math.ceil(mockTestimonials.length / cardsPerPage);
  const currentTestimonials = mockTestimonials.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  // مراقبة حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setCurrentPage(0);
        setVisibleCards([]);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setVisibleCards([]);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setVisibleCards([]);
  };

  // أنيميشن ظهور الكروت
  useEffect(() => {
    if (!sectionVisible) return;
    setTimeout(() => {
      currentTestimonials.forEach((testimonial, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, testimonial.id]);
        }, index * 200);
      });
    }, 150);
  }, [currentPage, sectionVisible]);

  // Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ==== Project Journey (من AboutUsSection) ==== */}
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

          {/* Desktop النسخة الأصلية (6 خطوات) */}
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

      {/* ==== Achievements (لماذا تختارنا) ==== */}
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

      {/* ==== Testimonials Section (الأصلي - بعد التعديل) ==== */}
      <section
        ref={sectionRef}
        data-section="testimonials"
        className="py-16 md:py-20 bg-[#16161B] relative overflow-hidden"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* العنوان */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white">
              <span
                style={{
                  background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('testimonials.subtitle')}
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#ffffff]/70 max-w-3xl mx-auto mt-3 leading-relaxed px-2">
              {t('home.testimonials.title', { defaultValue: t('home.testimonials.slug', { defaultValue: '' }) })}
            </p>
          </div>

          {/* السلايدر مع التحكم - ثابت على وضع اللغة العربي */}
          <div className="relative flex items-center justify-center">
            {/* السهم الأيمن (ثابت - للصفحة السابقة في الوضع العربي) */}
            {totalPages > 1 && (
              <button
                onClick={handlePrev}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-[#1f1f1f]/95 backdrop-blur-xl border border-[#8F93A5]/15 rounded-xl flex items-center justify-center hover:border-[#8F93A5]/40 hover:shadow-[0_0_16px_rgba(143,147,165,0.2)] transition-all duration-500 z-10 group hover:scale-110 flex-shrink-0 ml-2 sm:ml-3 -mr-1"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#8F93A5]/70 group-hover:text-[#8F93A5] transition-all duration-300 group-hover:scale-125" />
              </button>
            )}

            {/* الكروت — مصغّرة */}
            <div className="flex-1 min-w-0">
              <div
                className={`grid gap-3 sm:gap-4 ${
                  isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
                }`}
              >
                {currentTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`transform transition-all duration-700 ease-out ${
                      visibleCards.includes(testimonial.id)
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative group/card h-full">
                      {/* Glowing Border */}
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-xl sm:rounded-2xl opacity-25 blur-sm group-hover/card:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
                      
                      {/* Card Content */}
                      <div className="relative bg-[#1c1c24] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 h-full transition-all duration-300 border border-[#2a2a35]/50 group-hover/card:border-[#8F93A5]/20">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div>
                              <h3 className="font-bold text-white text-base sm:text-lg mb-0.5 group-hover/card:text-[#8F93A5] transition-colors">
                                {isAr ? (testimonial as any).name_ar : (testimonial as any).name_en}
                              </h3>
                              {(isAr ? (testimonial as any).position_ar : (testimonial as any).position_en) && (
                                <p className="text-[11px] sm:text-xs text-white/50 mb-1.5 font-medium">
                                  {isAr ? (testimonial as any).position_ar : (testimonial as any).position_en}
                                </p>
                              )}
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#8F93A5] text-[#8F93A5]" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-[#8F93A5]/15 group-hover/card:text-[#8F93A5]/30 transition-all duration-500 group-hover/card:scale-110 flex-shrink-0" />
                        </div>

                        <div className="mb-4 flex-1">
                          <p className="text-white/75 leading-relaxed text-[13px] sm:text-sm md:text-base font-light line-clamp-4">
                            "{isAr ? (testimonial as any).testimonial_ar : (testimonial as any).testimonial_en}"
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#252530]/40">
                          <div className="text-[10px] sm:text-xs text-white/40 flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-[#8F93A5] rounded-full"></div>
                            <span className="font-medium">
                              {new Date(testimonial.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* السهم الأيسر (ثابت - للصفحة التالية في الوضع العربي) */}
            {totalPages > 1 && (
              <button
                onClick={handleNext}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-[#1f1f1f]/95 backdrop-blur-xl border border-[#8F93A5]/15 rounded-xl flex items-center justify-center hover:border-[#8F93A5]/40 hover:shadow-[0_0_16px_rgba(143,147,165,0.2)] transition-all duration-500 z-10 group hover:scale-110 flex-shrink-0 mr-2 sm:mr-3 -ml-1"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#8F93A5]/70 group-hover:text-[#8F93A5] transition-all duration-300 group-hover:scale-125" />
              </button>
            )}
          </div>

          {/* مؤشر الصفحات */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 gap-1.5 sm:gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPage(index);
                    setVisibleCards([]);
                  }}
                  className={`transition-all duration-500 rounded-full ${
                    currentPage === index
                      ? 'w-8 h-1.5 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] shadow-[0_0_8px_rgba(143,147,165,0.4)]'
                      : 'w-1.5 h-1.5 bg-[#8F93A5]/40 hover:bg-[#8F93A5]/60 hover:scale-150'
                  }`}
                  aria-label={`${t('testimonials.page')} ${index + 1}`}
                />
              ))}
            </div>
          )}
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

export default TestimonialsSection;