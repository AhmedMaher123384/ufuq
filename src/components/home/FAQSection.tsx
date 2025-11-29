import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import faq from '../../assets/faqs.webp';
import { mockFaqCategories } from '../../mock/faqs';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: number;
  title: string;
  icon: string;
  faqs: FAQ[];
}

const FAQSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 80);
          }
        });
      },
      { threshold: 0.15, rootMargin: '50px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.faq-card');
    cards?.forEach((el) => observer.observe(el));

    return () => cards?.forEach((el) => observer.unobserve(el));
  }, []);

  const toggleCategory = (id: number) => {
    setOpenCategory(openCategory === id ? null : id);
    setOpenFAQ(null);
  };

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const faqCategories: FAQCategory[] = mockFaqCategories.map((category) => ({
    id: category.id,
    title: isAr ? category.title_ar : category.title_en,
    icon: category.icon,
    faqs: category.faqs.map((f) => ({
      id: f.id,
      question: isAr ? f.question_ar : f.question_en,
      answer: isAr ? f.answer_ar : f.answer_en,
    })),
  }));

  return (
    <section
      ref={sectionRef}
      data-section="faq"
      className="py-16 md:py-24 bg-[#16161b] relative overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12 md:mb-16">
          

        
  <h2 className="text-3xl md:text-5xl font-black text-white mt-6">
              {/* inline gradient عشان نضمن مفيش كاش */}
              <span style={{
                background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('home.faq.heading_prefix')}
              </span>
            </h2>
          <p className="text-lg md:text-xl text-[#ffffff]/70 max-w-3xl mx-auto leading-relaxed">
            {t('home.faq.subtitle')}
          </p>
        </div>


        

        {/* الخدمات */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
  {faqCategories.map((category, index) => (
    <div
      key={category.id}
      data-index={category.id}
      className={`faq-card transition-all duration-700 ease-out will-change-transform ${
        visibleCards.includes(category.id)
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-12 opacity-0 scale-95'
      }`}
    >
      {/* Category Card with Glowing Border */}
      <div className="relative group/category h-full">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-2xl opacity-30 blur-sm group-hover/category:opacity-60 transition-opacity duration-500"></div>
        
        {/* Card Content */}
        <div className="relative bg-[#1c1c24] rounded-2xl overflow-hidden">
          {/* عنوان الفئة */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-[#25252f] transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                {category.icon}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#8F93A5] transition-colors duration-300">
                {category.title}
              </h3>
            </div>

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                openCategory === category.id
                  ? 'bg-[#8F93A5] rotate-180 scale-110'
                  : 'bg-[#25252f] border-2 border-[#2a2a35] group-hover:border-[#8F93A5] group-hover:scale-105'
              }`}
            >
              <ChevronDown
                className={`w-5 h-5 transition-colors ${
                  openCategory === category.id ? 'text-white' : 'text-[#8F93A5]'
                }`}
              />
            </div>
          </button>

          {/* الأسئلة */}
          {openCategory === category.id && (
            <div className="border-t-2 border-[#2a2a35] bg-[#1c1c24]">
              <div className="p-5 space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <div
                    key={faq.id}
                    className="transform transition-all duration-500 ease-out"
                    style={{ transitionDelay: `${faqIndex * 60}ms` }}
                  >
                    {/* FAQ Item with Mini Glowing Border */}
                    <div className="relative group/faq">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-xl opacity-20 blur-[2px] group-hover/faq:opacity-40 transition-opacity duration-300"></div>
                      
                      <div className="relative bg-[#25252f] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full px-5 py-4 text-right flex justify-between items-center hover:bg-[#2a2a35] transition-all duration-200 group"
                        >
                          <span className="text-white font-medium text-base md:text-lg pr-3">
                            {faq.question}
                          </span>

                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                              openFAQ === faq.id
                                ? 'bg-[#8F93A5] scale-110'
                                : 'bg-[#1c1c24] border-2 border-[#2a2a35] group-hover:border-[#8F93A5]'
                            }`}
                          >
                            {openFAQ === faq.id ? (
                              <Minus className="w-4 h-4 text-white" />
                            ) : (
                              <Plus className="w-4 h-4 text-[#8F93A5]" />
                            )}
                          </div>
                        </button>

                        {openFAQ === faq.id && (
                          <div className="px-5 pb-5 border-t-2 border-[#2a2a35]">
                            <div className="pt-4">
                              <p className="text-white/70 leading-relaxed text-sm md:text-base text-right">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* الأنيميشنز */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count:: 1 !important;
            transition-duration: 0ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FAQSection;