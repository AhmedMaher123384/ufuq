import React, { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockTestimonials } from '../../mock/testimonials';
// framer-motion لم يعد مستخدمًا بعد نقل الأقسام

// تم نقل العدّاد والمكون المرتبط إلى ProjectJourneyAchievements.tsx

const TestimonialsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar') ?? false;

  // تم نقل المراجع والأحداث الخاصة بالرحلة والإنجازات إلى المكون الجديد

  // تم نقل خطوات الرحلة والمنطق المرتبط بها إلى المكون الجديد

  // تم نقل الإنجازات إلى المكون الجديد

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
      {/* تم نقل قسم رحلة نجاحك وقسم لماذا تختارنا إلى مكون منفصل */}

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