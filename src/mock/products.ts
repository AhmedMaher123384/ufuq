import img1 from '../assets/1.png';
import img2 from '../assets/2.png';

// إضافة نوع خيارات المنتج ليتوافق مع المودال والـ UI
export interface ProductOption {
  id: string;
  type: 'dropdown' | 'radio' | 'checkbox' | 'text' | 'number' | 'color';
  name: { ar: string; en: string };
  label: { ar: string; en: string };
  required: boolean;
  options?: Array<{
    value: string;
    label: { ar: string; en: string };
    priceModifier: number;
    colorCode?: string;
  }>;
  placeholder?: { ar: string; en: string };
  validation?: { min?: number; max?: number; pattern?: string };
  order: number;
}

export interface MockProduct {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  shortDescription?: string;
  shortDescription_ar?: string;
  shortDescription_en?: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  subcategoryId?: number | null;
  productType?: 'product' | 'theme';
  mainImage: string;
  detailedImages?: string[];
  createdAt?: string;
  isActive?: boolean;
  faqs?: Array<{ 
    question: string; 
    question_ar?: string; 
    question_en?: string; 
    answer: string; 
    answer_ar?: string; 
    answer_en?: string; 
  }>;
  addOns?: Array<{ 
    name: string; 
    name_ar?: string; 
    name_en?: string; 
    price: number; 
    description?: string; 
    description_ar?: string; 
    description_en?: string; 
  }>;
  productOptions?: ProductOption[];
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  hasRequiredOptions?: boolean;
}

export const mockProducts: MockProduct[] = [
  {
    id: 101,
    name: 'Logo Design',
    name_ar: 'تصميم شعار',
    description: 'Professional logo design',
    description_ar: 'تصميم شعار احترافي يُعتمد على خبرة وابتكار.  احترافي يُعتمد على خبرة وابتكار. احترافي يُعتمد على خبرة وابتكار. احترافي يُعتمد على خبرة وابتكار. احترافي يُعتمد على خبرة وابتكار. احترافي يُعتمد على خبرة وابتكار. احترافي يُعتمد على خبرة وابتكار.',
    shortDescription: 'Logo tailored to your brand',
    shortDescription_ar: 'شعار مصمم خصيصاً لهويتك',
    price: 150,
    originalPrice: 200,
    isAvailable: true,
    isActive: true,
    categoryId: 1,
    productType: 'product',
    mainImage: img1,
    createdAt: '2024-10-10T09:00:00Z',
    faqs: [
      {
        question: 'What is included in the logo package?',
        question_ar: 'ما الذي يشمله باقة الشعار؟',
        answer: 'Three initial concepts and two revision rounds.',
        answer_ar: 'ثلاثة تصورات أولية وجولتان من التعديلات.'
      },
      {
        question: 'How long does it take?',
        question_ar: 'كم يستغرق الوقت؟',
        answer: 'Standard delivery within 5 business days.',
        answer_ar: 'التسليم القياسي خلال 5 أيام عمل.'
      }
    ],
    addOns: [
      {
        name: 'Business Card Design',
        name_ar: 'تصميم كارت شخصي',
        price: 75,
        description: 'Matching business card design',
        description_ar: 'تصميم كارت يتماشى مع الشعار'
      },
      {
        name: 'Social Media Kit',
        name_ar: 'حزمة وسائل التواصل',
        price: 120,
        description: 'Profile and cover images for social platforms',
        description_ar: 'صور بروفايل وغلاف لمنصات السوشيال'
      }
    ],
    productOptions: [
      {
        id: 'logo_style',
        type: 'dropdown',
        name: { ar: 'نمط الشعار', en: 'Logo Style' },
        label: { ar: 'اختر نمط الشعار', en: 'Choose logo style' },
        required: true,
        options: [
          { value: 'minimal', label: { ar: 'مينيمل', en: 'Minimal' }, priceModifier: 0 },
          { value: 'modern', label: { ar: 'مودرن', en: 'Modern' }, priceModifier: 50 },
          { value: 'vintage', label: { ar: 'فينتيدج', en: 'Vintage' }, priceModifier: 30 }
        ],
        order: 1
      },
      {
        id: 'color_palette',
        type: 'color',
        name: { ar: 'لوحة الألوان', en: 'Color Palette' },
        label: { ar: 'اختر اللون الرئيسي', en: 'Choose primary color' },
        required: false,
        options: [
          { value: 'blue', label: { ar: 'أزرق', en: 'Blue' }, priceModifier: 0, colorCode: '#18b5d8' },
          { value: 'black', label: { ar: 'أسود', en: 'Black' }, priceModifier: 0, colorCode: '#000000' },
          { value: 'white', label: { ar: 'أبيض', en: 'White' }, priceModifier: 0, colorCode: '#ffffff' }
        ],
        order: 2
      },
      {
        id: 'delivery_time',
        type: 'radio',
        name: { ar: 'وقت التسليم', en: 'Delivery Time' },
        label: { ar: 'اختر سرعة التسليم', en: 'Select speed' },
        required: true,
        options: [
          { value: 'standard_5d', label: { ar: 'قياسي (5 أيام)', en: 'Standard (5 days)' }, priceModifier: 0 },
          { value: 'express_48h', label: { ar: 'سريع (48 ساعة)', en: 'Express (48h)' }, priceModifier: 100 }
        ],
        order: 3
      },
      {
        id: 'extra_revisions',
        type: 'number',
        name: { ar: 'تعديلات إضافية', en: 'Extra Revisions' },
        label: { ar: 'عدد التعديلات الإضافية', en: 'Number of extra revisions' },
        required: false,
        placeholder: { ar: '0 إلى 5', en: '0 to 5' },
        validation: { min: 0, max: 5 },
        order: 4
      }
    ],
    seoTitle: 'تصميم شعار احترافي | Logo Design Service',
    seoDescription: 'احصل على شعار احترافي يعبر عن هويتك مع خيارات وملحقات مرنة.',
    metaTitle: 'تصميم شعار احترافي',
    metaDescription: 'خدمة تصميم شعار مع خيارات متعددة وملحقات.'
  },
  {
    id: 102,
    name: 'Social Ads Pack',
    name_ar: 'باقة إعلانات سوشيال',
    description: 'Ads campaign pack',
    description_ar: 'باقة حملات إعلانية',
    price: 300,
    isAvailable: true,
    categoryId: 2,
    mainImage: img2,
    detailedImages: [img2],
    createdAt: '2024-10-11T10:00:00Z',
  },
  
];