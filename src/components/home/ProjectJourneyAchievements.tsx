import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step {
  number: string;
  title: string;
  description: string;
  details: string[];
}

const ProjectJourneyAchievements: React.FC = () => {
  const { t, i18n } = useTranslation();
  const journeyRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.1 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });

  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const steps: Step[] = useMemo(() => [
    {
      number: '01',
      title: t('home.about.steps.discovery'),
      description: t('home.about.steps.discovery_desc'),
      details: t('home.about.steps.discovery_details', { returnObjects: true }) as string[],
    },
    {
      number: '02',
      title: t('home.about.steps.approach'),
      description: t('home.about.steps.approach_desc'),
      details: t('home.about.steps.approach_details', { returnObjects: true }) as string[],
    },
    {
      number: '03',
      title: t('home.about.steps.planning'),
      description: t('home.about.steps.planning_desc'),
      details: t('home.about.steps.planning_details', { returnObjects: true }) as string[],
    },
    {
      number: '04',
      title: t('home.about.steps.creativity'),
      description: t('home.about.steps.creativity_desc'),
      details: t('home.about.steps.creativity_details', { returnObjects: true }) as string[],
    },
    {
      number: '05',
      title: t('home.about.steps.assembly'),
      description: t('home.about.steps.assembly_desc'),
      details: t('home.about.steps.assembly_details', { returnObjects: true }) as string[],
    },
    {
      number: '06',
      title: t('home.about.steps.launch'),
      description: t('home.about.steps.launch_desc'),
      details: t('home.about.steps.launch_details', { returnObjects: true }) as string[],
    },
  ], [t]);

  const toggleStep = (index: number) => {
    setActiveStepIndex(activeStepIndex === index ? null : index);
  };

  // FAQ content ثنائي اللغة يعتمد على i18n.language الحالية
  const faqContent = useMemo(() => {
    const isArabic = i18n.language?.startsWith('ar');
    return {
      title: isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions',
      subtitle: isArabic
        ? 'كل ما تريد معرفته عن خدماتنا في مكان واحد'
        : 'Everything you need to know about our services in one place',
      items: isArabic
        ? [
            { question: 'ما هي مدة تنفيذ المشروع؟', answer: 'تختلف المدة حسب حجم المشروع، ولكن في المتوسط ننتهي خلال 4-6 أسابيع.' },
            {question: 'هل تقدمون دعمًا بعد التسليم؟',answer: 'يوجد دعم فني، بالإضافة إلى باقات مختلفة للإدارة والصيانة' } ,
           { question: 'كيف يتم تحديد التكلفة؟', answer: 'نعتمد على تحليل المتطلبات ونقدم عرض سعر شفاف بدون رسوم خفية.' },
            { question: 'هل يمكنني طلب تعديلات أثناء العمل؟', answer: 'بالتأكيد، نحن نعمل بشكل مرن ونتفهم احتياجاتك المتغيرة.' },
            { question: 'ما هي لغات البرمجة التي تستخدمونها؟', answer: 'React, Node.js, Laravel, Flutter، وأحدث التقنيات.' },
          ]
        : [
            { question: 'How long does a project take?', answer: 'It depends on the project scope, but on average we deliver within 4-6 weeks.' },
            { question: 'Do you provide support after delivery?',answer: 'We offer technical support, as well as various management and maintenance packages.'},            { question: 'How is the cost determined?', answer: 'We analyze your requirements and provide a transparent quote with no hidden fees.' },
            { question: 'Can I request changes during the project?', answer: 'Absolutely, we work flexibly and accommodate your evolving needs.' },
            { question: 'What technologies do you use?', answer: 'React, Node.js, Laravel, Flutter, and the latest tech stack.' },
          ],
      footer: isArabic
        ? 'لم تجد إجابتك؟ تواصل معنا وسنرد خلال 24 ساعة'
        : "Didn't find your answer? Contact us and we'll reply within 24 hours",
    };
  }, [i18n.language]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const stepItemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <>
      {/* Project Journey Section */}
      <section ref={journeyRef} className="py-12 lg:py-24 bg-[#16161B]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            animate={journeyInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-center mb-12 lg:mb-20"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white">
              <span className="inline-block bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
                {t('home.about.project_journey')}
              </span>
            </h2>
            <p className="text-white/70 mt-4 text-base lg:text-lg max-w-2xl mx-auto hidden lg:block">
              {t('home.about.project_journey_description')}
            </p>
          </motion.div>

          {/* Desktop Steps */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute top-12 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8F93A5]/40 to-transparent" />
              <motion.div
                initial="hidden"
                animate={journeyInView ? 'visible' : 'hidden'}
                variants={staggerContainer}
                className="grid grid-cols-6 gap-8"
              >
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    variants={stepItemVariant}
                    className="group/card relative flex flex-col items-center cursor-pointer"
                    onClick={() => toggleStep(i)}
                  >
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-full opacity-0 blur-xl group-hover/card:opacity-40 transition-opacity duration-700 pointer-events-none" />
                    <div className="relative z-10 w-24 h-24 bg-[#1c1c24] rounded-full border-4 border-[#8F93A5]/30 flex flex-col items-center justify-center transition-all duration-500 group-hover/card:border-[#8F93A5] group-hover/card:scale-110 group-hover/card:shadow-2xl group-hover/card:shadow-[#8F93A5]/50">
                      <span className="text-[#8F93A5] font-black text-2xl">{step.number}</span>
                    </div>
                    <div className="mt-8 text-center max-w-xs">
                      <h4 className="font-bold text-white text-base mb-2 group-hover/card:text-[#8F93A5] transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-white/60 text-sm mb-4">{step.description}</p>
                      <div
                        className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${
                          activeStepIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
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
              </motion.div>
            </div>
          </div>

          {/* Mobile/Tablet Steps */}
          <div className="lg:hidden">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={journeyInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col"
                >
                  <div className="w-full cursor-pointer" onClick={() => toggleStep(i)}>
                    <div className="flex items-start gap-2.5 p-3 bg-[#1c1c24] rounded-xl border border-[#8F93A5]/10 hover:border-[#8F93A5]/30 transition-colors">
                      <div className="flex-shrink-0 w-9 h-9 bg-[#1c1c24] rounded-full border border-[#8F93A5]/50 flex items-center justify-center">
                        <span className="text-[#8F93A5] font-black text-xs">{step.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm sm:text-base leading-tight">{step.title}</h4>
                        <p className="text-white/60 text-[11px] sm:text-xs mt-0.5">{step.description}</p>
                      </div>
                    </div>
                    <div
                      className={`mt-2 overflow-hidden transition-all duration-500 ${
                        activeStepIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="bg-[#1c1c24]/70 rounded-xl p-3 border border-[#8F93A5]/20">
                        <div className="space-y-1.5">
                          {step.details.map((detail, j) => (
                            <div key={j} className="flex items-start gap-2 text-[11px] sm:text-xs text-white/70">
                              <CheckCircle className="w-3 h-3 text-[#8F93A5] mt-0.5" />
                              <span>{detail}</span>
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

      {/* FAQ Section - يتغير مع اللغة تلقائياً */}
      <section ref={faqRef} className="py-16 lg:py-24 bg-[#16161B] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#8F93A5]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#6c7081]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={faqInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              <span className="inline-block bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
                {faqContent.title}
              </span>
            </h2>
            <p className="text-white/60 mt-4 text-lg">{faqContent.subtitle}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={faqInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqContent.items.map((item, index) => (
              <motion.div key={index} variants={stepItemVariant} className="group">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-right bg-[#1c1c24] rounded-2xl border border-[#8F93A5]/10 hover:border-[#8F93A5]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8F93A5]/50"
                >
                  <div className="flex justify-between items-center p-5 md:p-6">
                    <span className="text-white font-bold text-lg md:text-xl">{item.question}</span>
                    <div className="flex-shrink-0 ml-4">
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-6 h-6 text-[#8F93A5] transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-[#8F93A5]/70 group-hover:text-[#8F93A5] transition-all duration-300" />
                      )}
                    </div>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaqIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-[#1c1c24]/50 rounded-xl p-5 md:p-6 mx-1 border border-[#8F93A5]/5">
                    <p className="text-white/80 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-white/50 text-sm">{faqContent.footer}</p>
          </motion.div>
        </div>
      </section>

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