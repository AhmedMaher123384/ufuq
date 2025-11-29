export interface MockTestimonial {
  id: number;
  name_ar: string;
  name_en: string;
  position_ar?: string;
  position_en?: string;
  testimonial_ar: string;
  testimonial_en: string;
  image: string;
  createdAt: string;
}

export const mockTestimonials: MockTestimonial[] = [
  {
    id: 1,
    name_ar: 'عبدالله العتيبي',
    name_en: 'Abdullah Al-Otaibi',
    position_ar: 'صاحب متجر إلكتروني صغير في الرياض',
    position_en: 'Small online store owner in Riyadh',
    testimonial_ar:
      'الحمد لله، الشباب ساعدوني أفتح متجري بسرعة وبساطة. الموقع يشتغل زين والدفع آمن، والزبائن بدأوا يطلبون. الله يعطيهم العافية.',
    testimonial_en:
      'The team helped me launch my store quickly and easily. The site works well, payments are secure, and orders started coming in. Great job!',
    image: 'https://arabsstock.com/wp-content/uploads/2023/05/32415.jpg',
    createdAt: '2025-10-20',
  },
  {
    id: 2,
    name_ar: 'فاطمة الدوسري',
    name_en: 'Fatimah Al-Dosari',
    position_ar: 'صاحبة مشروع هدايا يدوية في جدة',
    position_en: 'Handmade gifts business owner in Jeddah',
    testimonial_ar:
      'يا سلام على الموقع! الحين أقدر أتابع طلباتي من الجوال وأنا في البيت، وأرسل الفاتورة للزبون بسهولة. شكرًا لكم.',
    testimonial_en:
      "Amazing website! I can now track orders from my phone at home and send invoices easily. Thank you.",
    image:
      'https://media.istockphoto.com/id/1359069080/photo/indoor-portrait-of-cheerful-saudi-woman-in-mid-20s.jpg?s=612x612&w=0&k=20&c=3r4Y8b0zqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq=',
    createdAt: '2025-10-05',
  },
  {
    id: 3,
    name_ar: 'خالد الشمري',
    name_en: 'Khalid Al-Shammari',
    position_ar: 'صاحب محل عطور في الدمام',
    position_en: 'Perfume shop owner in Dammam',
    testimonial_ar:
      "الموقع يفتح بسرعة حتى على النت الضعيف، والزبائن يقولون: 'أخيرًا موقع ما يعلّق!'. الله يوفقكم.",
    testimonial_en:
      'The site loads fast even on weak internet. Customers say: “Finally, a site that doesn’t freeze!” Keep it up.',
    image:
      'https://c8.alamy.com/comp/2E235X1/full-length-profile-shot-of-a-saudi-arab-man-wearing-a-thobe-and-pushing-a-hand-truck-with-a-tires-isolated-on-white-background-2E235X1.jpg',
    createdAt: '2025-09-18',
  },
  {
    id: 4,
    name_ar: 'نورة الجابر',
    name_en: 'Noura Al-Jaber',
    position_ar: 'صاحبة متجر ملابس في الخبر',
    position_en: 'Clothing store owner in Khobar',
    testimonial_ar:
      'ربطتوا المتجر مع الشحن والمخزون، الحين أنا مرتاحة وكل شيء يمشي لوحده. شكرًا على الجهد.',
    testimonial_en:
      'You integrated shipping and inventory with my store. Now everything runs smoothly and I’m relaxed. Thank you for the effort.',
    image:
      'https://media.istockphoto.com/id/1339419020/photo/indoor-portrait-of-woman-in-traditional-black-abaya-and-hijab-smiling-at.jpg?s=612x612&w=0&k=20&c=example',
    createdAt: '2025-09-01',
  },
  {
    id: 5,
    name_ar: 'يوسف الماجد',
    name_en: 'Yousef Al-Majed',
    position_ar: 'صاحب كوفي شوب في الرياض',
    position_en: 'Coffee shop owner in Riyadh',
    testimonial_ar:
      'سوينا تطبيق بسيط للطلبات، الحين الزبائن يطلبون من الجوال والطلبات توصلني على طول. شغل مرتب.',
    testimonial_en:
      'We built a simple ordering app. Customers now order from their phones and orders reach me instantly. Clean work.',
    image:
      'https://www.istockphoto.com/photo/portrait-of-successful-muslim-businessman-in-traditional-outfit-gently-smiling-gm1339419020-417653116',
    createdAt: '2025-08-15',
  },
  {
    id: 6,
    name_ar: 'ليلى القحطاني',
    name_en: 'Laila Al-Qahtani',
    position_ar: 'صاحبة محل حلويات في مكة',
    position_en: 'Sweets shop owner in Makkah',
    testimonial_ar:
      "التصميم حلو وبسيط، الزبائن يقولون: 'الموقع سهل ومريح'. شكرًا على التعاون.",
    testimonial_en:
      'Beautiful and simple design. Customers say: “The site is easy and comfortable.” Thanks for the cooperation.',
    image:
      'https://media.istockphoto.com/id/1359069080/photo/portrait-of-smiling-arabian-girl-using-mobile-phone-at-home.jpg?s=612x612&w=0&k=20&c=example',
    createdAt: '2025-07-28',
  },
  {
    id: 7,
    name_ar: 'عمر الغامدي',
    name_en: 'Omar Al-Ghamdi',
    position_ar: 'صاحب مشروع تمور في المدينة',
    position_en: 'Dates business owner in Al-Madinah',
    testimonial_ar:
      'من فكرة بسيطة لمتجر كامل في أقل من شهر، والحين الطلبات توصل من كل مكان. الله يبارك لكم.',
    testimonial_en:
      'From a simple idea to a complete store in under a month. Orders now come from everywhere. God bless you.',
    image:
      'https://c8.alamy.com/comp/RFJ5179W/vector-saudi-arab-man-wearing-thobe-holding-lantern-in-the-night-for-the-muslim-holy-month-of-ramadan-RFJ5179W.jpg',
    createdAt: '2025-07-10',
  },
  {
    id: 8,
    name_ar: 'هدى الدخيل',
    name_en: 'Huda Al-Dukhail',
    position_ar: 'صاحبة متجر إكسسوارات في جدة',
    position_en: 'Accessories store owner in Jeddah',
    testimonial_ar:
      'الحين أشوف إحصائيات المبيعات بسهولة، وأعرف أي منتج مطلوب. شيء مفيد جدًا لمشروعي الصغير.',
    testimonial_en:
      'I can now view sales analytics easily and know which products are in demand. Very helpful for my small business.',
    image:
      'https://media.gettyimages.com/id/1339419020/photo/young-saudi-professional-describing-ideas-for-new-business.jpg?s=612x612&w=0',
    createdAt: '2025-06-22',
  },
  {
    id: 9,
    name_ar: 'سعد الفوزان',
    name_en: 'Saad Al-Fawzan',
    position_ar: 'صاحب ورشة تصليح جوالات في الرياض',
    position_en: 'Mobile repair workshop owner in Riyadh',
    testimonial_ar:
      'التطبيق يشتغل حتى لو النت ضعيف، والحجوزات توصلني على طول. وفر عليّ وقت كبير.',
    testimonial_en:
      'The app works even on weak internet and bookings reach me instantly. Saved me a lot of time.',
    image:
      'https://img.freepik.com/premium-photo/saudi-man-smile-wearing-white-thobe-white-ghutra-working-computer-modern-office-realistic-sce_242344640.jpg',
    createdAt: '2025-06-05',
  },
  {
    id: 10,
    name_ar: 'مريم الدوسري',
    name_en: 'Maryam Al-Dosari',
    position_ar: 'صاحبة مشروع طبخ منزلي في الطائف',
    position_en: 'Home-cooking business owner in Taif',
    testimonial_ar:
      'سوينا صفحة بسيطة للطلبات، والحين أستقبل طلبات يوميًا من الجيران والأصدقاء. شكرًا جزيلًا.',
    testimonial_en:
      'We built a simple ordering page. I now receive daily orders from neighbors and friends. Thanks a lot.',
    image:
      'https://media.istockphoto.com/id/1359069080/photo/head-and-shoulders-view-of-saudi-woman-with-long-brown-hair-standing-in.jpg?s=612x612&w=0&k=20&c=example',
    createdAt: '2025-05-18',
  },
  {
    id: 11,
    name_ar: 'فهد الجبر',
    name_en: 'Fahd Al-Jabr',
    position_ar: 'صاحب محل أثاث في بريدة',
    position_en: 'Furniture shop owner in Buraidah',
    testimonial_ar:
      'نقلتوا موقعنا القديم لنظام جديد بدون ما يتوقف، والزبائن ما حسّوا بأي تغيير. شغل نظيف.',
    testimonial_en:
      'You migrated our old site to a new system without downtime. Customers didn’t feel any change. Clean work.',
    image:
      'https://c8.alamy.com/comp/RMC7A9TF/saudi-arabia-man-wearing-thobe-and-ghutra-RMC7A9TF.jpg',
    createdAt: '2025-04-30',
  },
  {
    id: 12,
    name_ar: 'ريم الخالدي',
    name_en: 'Reem Al-Khaldi',
    position_ar: 'صاحبة متجر عبايات في الرياض',
    position_en: 'Abayas store owner in Riyadh',
    testimonial_ar:
      'المتجر يدعم الدفع عند الاستلام والبطاقة، والزبون يختار اللي يريحه. المبيعات زادت الحمد لله.',
    testimonial_en:
      'The store supports cash on delivery and card payments, and customers choose what suits them. Sales increased, thankfully.',
    image:
      'https://media.istockphoto.com/id/1339419020/photo/saudi-businesswoman-wearing-black-abaya-and-hijab-standing-in-the-office.jpg?s=612x612&w=0&k=20&c=example',
    createdAt: '2025-04-12',
  },
];