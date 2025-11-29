export interface MockFAQ {
  id: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}

export interface MockFAQCategory {
  id: number;
  title_ar: string;
  title_en: string;
  icon: string;
  faqs: MockFAQ[];
}

export const mockFaqCategories: MockFAQCategory[] = [
  {
    id: 1,
    title_ar: 'الخدمات والخدمات الرقمية',
    title_en: 'Products & Digital Goods',
    icon: '🛒',
    faqs: [
      {
        id: 1,
        question_ar: 'هل الخدمات والخدمات الرقمية قابلة للاسترجاع أو الاستبدال؟',
        question_en: 'Are products and digital goods returnable or exchangeable?',
        answer_ar:
          'الخدمات الرقمية لا يمكن استرجاعها بعد الشراء، لكن نضمن لك الدعم الفني والإصلاح لأي مشكلة تواجهك.',
        answer_en:
          'Digital goods cannot be returned after purchase, but we guarantee technical support and fixes for any issues you face.',
      },
      {
        id: 2,
        question_ar: 'كيف أستلم المنتج أو المنتج بعد الدفع؟',
        question_en: 'How do I receive the product after payment?',
        answer_ar:
          'بمجرد إتمام الدفع، يتم إرسال الملفات أو تفاصيل المنتج على بريدك الإلكتروني أو من خلال حسابك على الموقع.',
        answer_en:
          'Once payment is completed, the files or product details are sent to your email or made available in your site account.',
      },
      {
        id: 3,
        question_ar: 'هل أحتاج خبرة تقنية لاستخدام الخدمات الرقمية (مثل الثيمات أو التصاميم)؟',
        question_en: 'Do I need technical experience to use digital products (themes or designs)?',
        answer_ar:
          'لا، نقدم لك دليل استخدام بسيط، بالإضافة إلى إمكانية طلب خدمة التثبيت أو التخصيص.',
        answer_en:
          'No. We provide a simple usage guide, and you can request installation or customization services if needed.',
      },
    ],
  },
  {
    id: 2,
    title_ar: 'المواقع والتطبيقات',
    title_en: 'Websites & Apps',
    icon: '🌐',
    faqs: [
      {
        id: 4,
        question_ar: 'كم يستغرق وقت تنفيذ موقع أو تطبيق؟',
        question_en: 'How long does it take to deliver a website or app?',
        answer_ar:
          'يعتمد على حجم المشروع، عادة يبدأ التنفيذ من أسبوعين إلى 8 أسابيع حسب المتطلبات.',
        answer_en:
          'It depends on scope. Delivery typically ranges from 2 to 8 weeks based on requirements.',
      },
      {
        id: 5,
        question_ar: 'هل أستطيع تعديل الموقع أو التطبيق بعد تسليمه؟',
        question_en: 'Can I modify the website or app after delivery?',
        answer_ar:
          'نعم، نوفر لك لوحة تحكم سهلة، وإذا احتجت تخصيص إضافي نوفر دعم وخدمات ما بعد التسليم.',
        answer_en:
          'Yes. We provide an easy admin panel, and for advanced customizations we offer post-delivery support and services.',
      },
      {
        id: 6,
        question_ar: 'هل تقدمون استضافة مع المواقع؟',
        question_en: 'Do you provide hosting with websites?',
        answer_ar:
          'نعم، لدينا باقات استضافة سريعة وآمنة، أو يمكننا ربط موقعك باستضافتك الخاصة.',
        answer_en:
          'Yes. We offer fast, secure hosting plans, or we can connect your site to your existing host.',
      },
    ],
  },
  {
    id: 3,
    title_ar: 'التصميم والجرافيك',
    title_en: 'Design & Graphics',
    icon: '🎨',
    faqs: [
      {
        id: 7,
        question_ar: 'هل يمكن تعديل التصميم بعد استلامه؟',
        question_en: 'Can the design be revised after delivery?',
        answer_ar:
          'نعم، نقدم عددًا من التعديلات المجانية (عادة 2-3 تعديلات)، وبعدها يمكن طلب تعديلات إضافية برسوم بسيطة.',
        answer_en:
          'Yes. We include a number of free revisions (typically 2–3). Additional changes can be requested for a small fee.',
      },
      {
        id: 8,
        question_ar: 'ما هي صيغة الملفات التي سأستلمها؟',
        question_en: 'Which file formats will I receive?',
        answer_ar:
          'ستحصل على ملفات بصيغ متعددة مثل JPG, PNG, PDF، وبالنسبة للتصاميم الاحترافية نوفر ملفات مفتوحة المصدر (AI, PSD).',
        answer_en:
          'You will receive multiple formats such as JPG, PNG, and PDF. For professional designs, we provide source files (AI, PSD).',
      },
    ],
  },
  {
    id: 4,
    title_ar: 'التسويق الرقمي',
    title_en: 'Digital Marketing',
    icon: '📈',
    faqs: [
      {
        id: 9,
        question_ar: 'هل تضمنون لي نتائج محددة من الحملات التسويقية؟',
        question_en: 'Do you guarantee specific results from marketing campaigns?',
        answer_ar:
          'لا يمكن ضمان أرقام محددة لأن النتائج تعتمد على السوق والجمهور، لكن نستخدم أفضل الاستراتيجيات لزيادة الوصول والمبيعات.',
        answer_en:
          'We cannot guarantee specific numbers as results depend on the market and audience, but we use best practices to increase reach and sales.',
      },
      {
        id: 10,
        question_ar: 'هل تقدمون تقارير عن الأداء؟',
        question_en: 'Do you provide performance reports?',
        answer_ar:
          'نعم، نرسل تقارير شهرية/أسبوعية فيها إحصائيات وتحليلات واضحة لأداء الحملات.',
        answer_en:
          'Yes. We send weekly/monthly reports with clear analytics and insights about campaign performance.',
      },
    ],
  }
];