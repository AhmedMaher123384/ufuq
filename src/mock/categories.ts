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
name_ar: 'تطوير المواقع',
description: 'Professional web development for informational and service websites that builds trust, clarifies your offerings, and converts visitors into customers through modern UX and fast performance.',
description_ar: 'خدمات تطوير المواقع التعريفية والخدمية بشكل احترافي تعطي مشروعك حضور قوي وواضح على الإنترنت. اليوم معظم العملاء قبل ما يتواصلون يدخلون الموقع أول شيء عشان يعرفون من أنت وش تقدم. الموقع المرتّب والمصمّم باحتراف يعطي انطباع ثقة من أول لحظة، ويشرح خدماتك بطريقة واضحة وسهلة، ويحوّل الزائر لعميل عبر تجربة مستخدم سلسة وسرعة في التصفح. وجود موقع مضبوط صار ضرورة لأي بزنس يبغى يتوسع ويتواجد بقوة قدّام عملائه.',
image: cat1,
isActive: true,
createdAt: '2024-10-01T10:00:00Z',
},
{
id: 2,
name: 'E-commerce Website Development',
name_ar: 'تطوير مواقع التجارة الإلكترونية',
description: 'End-to-end e-commerce development that enables secure, scalable online stores—improving conversions, automating order flows, and providing customers a smooth shopping experience.',
description_ar: 'خدمات تطوير المتاجر الإلكترونية بشكل احترافي تمكّنك تبيع منتجاتك أونلاين بسهولة وأمان. المتجر الإلكتروني يشتغل لك 24/7، يستقبل طلبات، يعرض منتجاتك، ويدير المدفوعات والطلبات بشكل منظم. منصة قوية وسهلة الاستخدام ترفع مبيعاتك، تنظّم عملياتك، وتقدّم تجربة شراء مريحة للعملاء.',
image: cat2,
isActive: true,
createdAt: '2024-10-01T10:00:00Z',
},
{
id: 3,
name: 'Mobile App Development',
name_ar: 'تطوير التطبيقات',
description: 'High-quality mobile applications that increase customer engagement and brand loyalty by offering fast, native-like experiences and direct communication via push notifications.',
description_ar: 'نطوّر تطبيقات موبايل احترافية تخليك قريب من عملائك بأي وقت. التطبيق يوفّر قناة تواصل مباشرة في جوال العميل، وتقدر ترسل إشعارات تجذب العميل وترجّعه للتعامل معك مرة ثانية. التطبيق يزيد التفاعل، يعزّز ولاء العملاء، ويسهّل وصولهم لخدماتك أو منتجاتك.',
image: cat3,
isActive: true,
createdAt: '2024-10-02T10:00:00Z',
},
{
id: 4,
name: 'Digital Marketing',
name_ar: 'التسويق الرقمي',
description: 'Comprehensive digital marketing services—SEO, paid ads, social media, and content strategy—designed to increase visibility, generate qualified leads, and maximize ROI.',
description_ar: 'خدمات تسويق رقمي متكاملة تساعد مشروعك يظهر قدّام الناس اللي يدورون عنك فعليًا. نشتغل على SEO، إعلانات مدفوعة، محتوى وسوشيال ميديا علشان نرفع ظهورك، نزوّد العملاء المحتملين، ونحسّن عائد استثمار الحملات التسويقية.',
image: cat4,
isActive: true,
createdAt: '2024-10-03T10:00:00Z',
},
{
id: 5,
name: 'Graphic Design',
name_ar: 'التصميم الجرافيكي',
description: 'Professional graphic design services that build a cohesive visual identity—logos, brand assets, and marketing visuals—that improve customer perception and engagement.',
description_ar: 'خدمات تصميم جرافيكي احترافية تبني هوية بصرية متكاملة للمشروع: لوجو، عناصر الهوية، ومحتوى بصري للإعلانات والسوشيال. التصميم القوي يرفع قيمة البراند ويخلي العملاء يتذكرونك ويتفاعلوا مع عروضك.',
image: cat5,
isActive: true,
createdAt: '2024-10-03T10:00:00Z',
},
];