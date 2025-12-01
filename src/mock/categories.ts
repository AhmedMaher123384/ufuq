import cat1 from '../assets/1.png';
import cat2 from '../assets/2.png';
import cat3 from '../assets/3.png';
import cat4 from '../assets/4.png';
import cat5 from '../assets/5.png';

export interface MockCategory {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  isActive?: boolean;
  createdAt?: string;
}

export const mockCategories: MockCategory[] = [
{
id: 1,
name: 'Web Development',
name_ar: 'تطوير المواقع الإلكترونية',
description: "At ufuq Digital   we develop professional, fast websites specifically designed for your project's needs.\n\nWe focus on an excellent user experience (UX), modern design, and high performance that helps you attract customers and achieve tangible results.\n\n**The service includes:**\n\n• Designing modern and responsive interfaces.\n• Professional, scalable programming.\n• Speed optimization and SEO setup.\n• Integrating the website with external systems.\n• Continuous support and maintenance.\n\n**Ofok Alraqmeya...** A professional website that boosts your digital presence and enhances your project's growth.",
  description_ar: "في أفق الرقمية نطوّر مواقع إلكترونية احترافية وسريعة ومصممة خصيصًا لاحتياجات مشروعك.\n\nنركز على تجربة مستخدم ممتازة، تصميم عصري، وأداء عالي يساعدك على جذب العملاء وتحقيق نتائج فعلية.\n\nتشمل الخدمة:\n\n• تصميم واجهات حديثة ومتجاوبة.\n• برمجة احترافية قابلة للتطوير.\n• تحسين السرعة وتهيئة SEO.\n• ربط الموقع بالأنظمة الخارجية.\n• دعم وصيانة مستمرة.\n\nأفق الرقمية… موقع احترافي يرفع حضورك الرقمي ويعزز نمو مشروعك.",image: cat1,
isActive: true,
createdAt: '2024-10-01T10:00:00Z',
},
{
id: 2,
name: 'E-commerce Website Development',
name_ar: 'تطوير المتاجر الإلكترونية',
description: "At ufuq Digital   we offer a comprehensive e-commerce development service that helps you start selling online robustly and increase your sales effectively.\n\nWe build a fast, secure, and responsive store, whether through custom programming or platforms like Salla and Shopify, with a professional design and a seamless shopping experience for customers.\n\n**The service includes:**\n\n• Designing a fully integrated and responsive store for all devices.\n• Custom programming or complete setup on Salla/Shopify.\n• Professional and user-friendly admin control panel.\n• Integration of payment and shipping methods.\n• Setting up the order and inventory system.\n• Speed optimization and user experience improvement.\n• Store optimization for search engines (SEO).\n• Technical support and continuous maintenance.\n\n**Ofok Alraqmeya...** Your store is ready to sell and operates efficiently from day one.",
  description_ar: "نقدّم في أفق الرقمية خدمة إنشاء وتطوير متاجر إلكترونية متكاملة تساعدك على بدء البيع أونلاين بثبات وزيادة مبيعاتك بشكل فعلي.\n\nنقوم ببناء متجر سريع، آمن، ومتجاوب، سواء ببرمجة خاصة أو عبر منصات مثل سلة وشوبيفاي، مع تصميم احترافي وتجربة شراء سلسة للعملاء.\n\nتشمل الخدمة:\n\n• تصميم متجر متكامل ومتجاوب مع جميع الأجهزة.\n• برمجة مخصصة أو إعداد كامل على سلة/شوبفاي.\n• لوحة تحكم احترافية سهلة الاستخدام.\n• ربط وسائل الدفع والشحن.\n• إعداد نظام الطلبات والمخزون.\n• تحسين السرعة وتجربة المستخدم.\n• تهيئة المتجر لمحركات البحث (SEO).\n• دعم فني وصيانة مستمرة.\n\nأفق الرقمية… متجرك جاهز للبيع ويعمل بكفاءة منذ اليوم الأول."
  ,image: cat2,
isActive: true,
createdAt: '2024-10-01T10:00:00Z',
},
{
id: 3,
name: 'Mobile App Development',
name_ar: 'تطوير التطبيقات',
description: "At ufuq Digital  we develop professional iOS and Android applications with expert programming and modern design that suits the nature of your business and reflects your project's identity.\n\nWe focus on building a fast, stable, and user-friendly application that contributes to increasing sales and providing a seamless experience for your customers.\n\n**The service includes:**\n\n• Analyzing the idea and translating it into a clear user experience.\n• Designing modern UI/UX interfaces that are consistent with your visual identity.\n• Professional application programming that is scalable and expandable.\n• Integrating the application with systems and e-commerce stores.\n• Advanced notification system and performance optimization.\n• Comprehensive testing and application quality assurance.\n\n**Ofok Alraqmeya...** We transform your idea into a functioning application that grows with your project.",
  description_ar: "في أفق الرقمية نطوّر تطبيقات iOS وAndroid ببرمجة احترافية وتصميم حديث يلائم طبيعة نشاطك التجاري ويعكس هوية مشروعك.\n\nنركز على بناء تطبيق سريع، ثابت، وسهل الاستخدام، يساهم في زيادة المبيعات وتقديم تجربة سلسة لعملائك.\n\nتشمل الخدمة:\n\n• تحليل الفكرة وتحويلها إلى تجربة مستخدم واضحة.\n• تصميم واجهات UI/UX عصرية ومتوافقة مع الهوية البصرية.\n• برمجة تطبيقات احترافية قابلة للتطوير والتوسع.\n• ربط التطبيق مع الأنظمة والمتاجر الإلكترونية.\n• نظام إشعارات متقدم وتحسين الأداء.\n• اختبار شامل وضمان جودة التطبيق.\n\nأفق الرقمية… نحول فكرتك إلى تطبيق يعمل ويكبر مع مشروعك.",
  image: cat3,
isActive: true,
createdAt: '2024-10-02T10:00:00Z',
},
{
id: 4,
name: 'Digital Marketing',
name_ar: 'التسويق الرقمي',

description: "At ufuq Digital we offer integrated digital marketing solutions designed to help you attract customers, increase sales, and boost your brand's presence across all digital platforms.\n\nWe rely on well-studied strategies and effective paid advertising to reach the right audience at the lowest cost and highest return on investment (ROI).\n\n**The service includes:**\n\n• Management of advertising campaigns on Facebook, Instagram, TikTok, Snapchat, and Google.\n• Development of marketing strategies and content plans.\n• Continuous performance analysis and results optimization.\n• Social media page management and professional content creation.\n• Writing compelling advertisements and designing high-quality posts.\n• Building a targeted audience and improving the conversion rate.\n\n**Ofok Alraqmeya...** We deliver your message to the right audience and transform your digital presence into tangible results.",
  description_ar: "في أفق الرقمية نقدّم حلول تسويق إلكتروني متكاملة تساعدك على جذب العملاء، زيادة المبيعات، ورفع حضور علامتك التجارية على جميع المنصات الرقمية.\n\nنعتمد على استراتيجيات مدروسة وإعلانات ممولة فعّالة للوصول للجمهور المناسب بأقل تكلفة وأعلى عائد.\n\nتشمل الخدمة:\n\n• إدارة الحملات الإعلانية على فيسبوك، إنستجرام، تيك توك، سناب شات وجوجل.\n• إعداد الاستراتيجيات التسويقية وخطط المحتوى.\n• تحليل الأداء وتحسين النتائج باستمرار.\n• إدارة صفحات السوشيال ميديا وصناعة محتوى احترافي.\n• كتابة إعلانات جذابة وتصميم منشورات عالية الجودة.\n• بناء جمهور مستهدف وتحسين معدل التحويل.\n\nأفق الرقمية… نوصّل رسالتك للجمهور الصح ونحوّل تواجدك الرقمي إلى نتائج ملموسة.",image: cat4,
isActive: true,
createdAt: '2024-10-03T10:00:00Z',
},
{
id: 5,
name: 'Graphic Design',
name_ar: 'التصميم الجرافيكي',
  description: "At ufuq Digital we create a strong visual identity that distinguishes your brand and gives your project a professional presence across all platforms.\n\nWe design everything you need, including logos, colors, fonts, and integrated design patterns that reflect your project’s personality and capture customer attention.\n\nWe also provide high-quality graphic design services, including brochures, posters, social media posts, presentations, and all visuals that help you maintain a consistent and attractive appearance.\n\n**The service includes:**\n\n• Comprehensive visual identity design (Logo – Colors – Fonts – Design Pattern).\n• Designing brand identity assets (Business cards, letterheads, covers, company profiles).\n• Designing advertisements and social media posts.\n• Designing digital interfaces consistent with the brand identity.\n• A visual identity guideline ensuring unified usage.\n\n**Ofok Alraqmeya...** A strong identity is built, and a professional image inspires your audience.",
  description_ar: "في أفق الرقمية نبتكر لك هوية بصرية قوية تميز علامتك التجارية وتمنح مشروعك حضورًا احترافيًا على جميع المنصات.\n\nنصمّم كل ما تحتاجه من شعار، ألوان، خطوط، وأنماط تصميمية متكاملة تعكس شخصية مشروعك وتلفت انتباه العملاء.\n\nكما نقدّم خدمات تصميم جرافيكي عالية الجودة تشمل البروشورات، البوسترات، منشورات السوشيال ميديا، العروض التعريفية، وكل ما يساعدك على الظهور بشكل متناسق وجذاب.\n\nتشمل الخدمة:\n\n• تصميم هوية بصرية كاملة (شعار – ألوان – خطوط – نمط تصميم).\n• تصميم ملفات الهوية (بطاقات، ورق رسمي، أغلفة، بروفايل شركة).\n• تصميم إعلانات ومنشورات السوشيال ميديا.\n• تصميم واجهات رقمية متناسقة مع الهوية.\n• دليل هوية بصرية يضمن توحيد الاستخدام.\n\nأفق الرقمية… هوية قوية تُبنى، وصورة احترافية تُلهم جمهورك."
, image: cat5,
isActive: true,
createdAt: '2024-10-03T10:00:00Z',
},
];