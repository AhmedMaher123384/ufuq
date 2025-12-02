'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, ChevronDown, Send, CheckCircle, Plus, X, Star, User, ExternalLink, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useForm,
  Controller,
  Control,
  FieldValues,
  Path,
  FieldErrors,
  ControllerRenderProps,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import WhatsAppButton from './ui/WhatsAppButton';
import { slugify } from '../utils/slugify';
import { mockCategories } from '../mock/categories';
import { formSubmissionService } from '../services/formSubmissionService';
import { smartToast } from '../utils/toastConfig';
import type { Category, FormSubmissionData } from '../types/category';

// ====================== Zod Schemas — مُصلحة بالكامل (بدون أخطاء) ======================
// Helper: international phone validation (7–15 digits, allows +, spaces, dashes, parentheses)
const phoneSchema = z
  .string()
  .trim()
  .refine((val) => {
    if (!val) return false;
    const digits = val.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }, {
    message: 'رقم غير صحيح',
  });

// Helper: URL-like validation (with or without protocol)
const isUrlLike = (val: string) => {
  const v = (val || '').trim();
  if (!v) return false;
  const withProtocol = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\:\d+)?(\/.*)?$/i;
  const withoutProtocol = /^([\w-]+\.)+[\w-]{2,}(\:\d+)?(\/.*)?$/i;
  return withProtocol.test(v) || withoutProtocol.test(v);
};
const websiteSchema = z.object({
  fullName: z.string().min(3, 'الاسم قصير جدًا').trim(),
  phone: phoneSchema,
  documentType: z.string().min(1, 'يرجى اختيار نوع الوثيقة'),
  siteType: z.enum(
    ['موقع تعريفي', 'متجر إلكتروني', 'تعديل على موقع قائم بالفعل', 'موقع مقدّم خدمات'] as const,
    { message: 'يرجى اختيار نوع الموقع' }
  ),
  ecommercePlatform: z.string().optional(),
  existingUrl: z
    .string()
    .optional()
    .refine((v) => !v || isUrlLike(v), { message: 'الرابط غير صحيح' }),
  serviceType: z.string().optional(),
  extraInfo: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.siteType === 'متجر إلكتروني' && !data.ecommercePlatform) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'يرجى اختيار المنصة',
      path: ['ecommercePlatform'],
    });
  }
  // جعل رابط الموقع الحالي اختياريًا دائمًا
  if (data.siteType === 'موقع مقدّم خدمات' && !data.serviceType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'يرجى تحديد نوع الخدمة',
      path: ['serviceType'],
    });
  }
});

const appSchema = z.object({
  fullName: z.string().min(3, 'الاسم قصير جدًا').trim(),
  phone: phoneSchema,
  documentType: z.string().min(1, 'يرجى اختيار نوع الوثيقة'),
  appType: z.enum(
    ['تطبيق خدمات', 'تطبيق متجر'] as const,
    { message: 'يرجى اختيار نوع التطبيق' }
  ),
  extraInfo: z.string().optional(),
});

const generalSchema = z.object({
  fullName: z.string().min(3, 'الاسم قصير جدًا').trim(),
  phone: phoneSchema,
  requestDetails: z.string().min(10, 'اكتب تفاصيل أكثر').trim(),
  extraInfo: z.string().optional(),
});

type WebsiteFormData = z.infer<typeof websiteSchema>;
type AppFormData = z.infer<typeof appSchema>;
type GeneralFormData = z.infer<typeof generalSchema>;

// ====================== Reviews (Local Storage) ======================
interface Review {
  id: string;
  name: string;
  opinion: string;
  createdAt: string;
  rating?: number;
  link?: string;
}

const REVIEWS_KEY_PREFIX = 'reviews_category_';

// ====================== ProgressBar ======================
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <motion.div 
    className="h-1 bg-white/10 rounded-full overflow-hidden mb-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <motion.div
      className="h-full bg-gradient-to-r from-[#A0A5C0] to-[#7A7E95] rounded-full"
      initial={{ width: "0%" }}
      animate={{ width: `${Math.min(100, progress)}%` }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  </motion.div>
);

const getProgress = (data: any, mandatoryFields: string[]) => {
  const filled = mandatoryFields.filter(field => {
    const val = data[field];
    return val != null && val !== '' && !(Array.isArray(val) && val.length === 0);
  }).length;
  return (filled / mandatoryFields.length) * 100;
};

// ====================== WebsiteForm ======================
const WebsiteForm = ({ category, onSubmitted }: { category: Category; onSubmitted?: (id: string) => void }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  const data = watch();
  const progress = getProgress(data, ['fullName', 'phone', 'documentType', 'siteType']);

  const siteType = watch('siteType');

  const onSubmit = async (data: WebsiteFormData) => {
    setIsSubmitting(true);
    try {
      const newId = await formSubmissionService.submitForm({
        formType: 'website',
        categoryId: category.id,
        categoryName: category.name,
        categoryNameAr: category.name_ar,
        fullName: data.fullName,
        phone: data.phone,
        documentType: data.documentType,
        siteType: data.siteType,
        ecommercePlatform: data.ecommercePlatform,
        existingUrl: data.existingUrl,
        serviceType: data.serviceType,
        extraInfo: data.extraInfo,
      });
      onSubmitted?.(newId);
    } catch (error) {
      smartToast.frontend.error('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProgressBar progress={progress} />
      <SuccessMessage visible={showSuccess} />

      <Section title="التواصل (إجباري)">
        <FormInput 
          control={control} 
          name="fullName" 
          label="الاسم الكامل" 
          error={errors.fullName} 
          inputRef={fullNameRef}
          autoComplete="name"
        />
        <FormInput 
          control={control} 
          name="phone" 
          label="رقم التليفون" 
          type="tel" 
          error={errors.phone} 
          autoComplete="tel"
        />
      </Section>

      <Section title="نوع الوثيقة">
        <FormRadioGroup 
          control={control} 
          name="documentType" 
          options={["سجل تجاري", "وثيقة عمل حر", "لا يوجد"]} 
          error={errors.documentType} 
        />
      </Section>

      <Section title="نوع الموقع الإلكتروني">
        <FormRadioGroup 
          control={control} 
          name="siteType" 
          options={[
            "موقع تعريفي",
            "متجر إلكتروني",
            "تعديل على موقع قائم بالفعل",
            "موقع مقدّم خدمات"
          ]} 
          error={errors.siteType} 
        />

        <AnimatePresence mode="wait">
          {siteType === "متجر إلكتروني" && (
            <ConditionalSection>
              <p className="text-[#A0A5C0] mb-3 text-sm font-medium">اختر المنصة المفضلة</p>
              <FormRadioGroup 
                control={control} 
                name="ecommercePlatform" 
                options={["برمجة خاصة", "منصة سلة", "منصة شوبيفاي", "ووردبريس"]}
                error={errors.ecommercePlatform} 
              />
            </ConditionalSection>
          )}

          {siteType === "تعديل على موقع قائم بالفعل" && (
            <ConditionalSection>
              <FormInput 
                control={control} 
                name="existingUrl" 
                label="رابط الموقع الحالي" 
                placeholder="https://example.com" 
                error={errors.existingUrl} 
                autoComplete="url"
              />
            </ConditionalSection>
          )}

          {siteType === "موقع مقدّم خدمات" && (
            <ConditionalSection>
              <FormInput 
                control={control} 
                name="serviceType" 
                label="ما نوع الخدمة التي سيقدمها الموقع؟" 
                placeholder="مثال: حجز مواعيد، استشارات، تدريب..." 
                error={errors.serviceType} 
              />
            </ConditionalSection>
          )}
        </AnimatePresence>
      </Section>

      <Section title="معلومات إضافية (اختياري)">
        <FormTextarea control={control} name="extraInfo" placeholder="أي تفاصيل تساعدنا في فهم نجاحك..." />
      </Section>

      <SubmitButton loading={isSubmitting} text="إرسال الطلب الآن" />
    </form>
  );
};

// ====================== AppForm ======================
const AppForm = ({ category, onSubmitted }: { category: Category; onSubmitted?: (id: string) => void }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  const data = watch();
  const progress = getProgress(data, ['fullName', 'phone', 'documentType', 'appType']);

  const onSubmit = async (data: AppFormData) => {
    setIsSubmitting(true);
    try {
      const newId = await formSubmissionService.submitForm({
        formType: 'app',
        categoryId: category.id,
        categoryName: category.name,
        categoryNameAr: category.name_ar,
        fullName: data.fullName,
        phone: data.phone,
        documentType: data.documentType,
        appType: data.appType,
        extraInfo: data.extraInfo,
      });
      onSubmitted?.(newId);
    } catch (error) {
      smartToast.frontend.error('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProgressBar progress={progress} />
      <SuccessMessage visible={showSuccess} />
      
      <Section title="التواصل (إجباري)">
        <FormInput 
          control={control} 
          name="fullName" 
          label="الاسم الكامل" 
          error={errors.fullName} 
          inputRef={fullNameRef}
          autoComplete="name"
        />
        <FormInput 
          control={control} 
          name="phone" 
          label="رقم التليفون" 
          type="tel" 
          error={errors.phone} 
          autoComplete="tel"
        />
      </Section>
      
      <Section title="نوع الوثيقة">
        <FormRadioGroup 
          control={control} 
          name="documentType" 
          options={["سجل تجاري", "وثيقة عمل حر", "لا يوجد"]} 
          error={errors.documentType} 
        />
      </Section>
      
      <Section title="نوع التطبيق">
        <FormRadioGroup 
          control={control} 
          name="appType" 
          options={["تطبيق خدمات", "تطبيق متجر"]} 
          error={errors.appType} 
        />
      </Section>
      
      <Section title="معلومات إضافية (اختياري)">
        <FormTextarea control={control} name="extraInfo" placeholder="فكرة التطبيق، المميزات، الجمهور..." />
      </Section>
      
      <SubmitButton loading={isSubmitting} text="إرسال طلب التطبيق" />
    </form>
  );
};

// ====================== GeneralContactForm ======================
const GeneralContactForm = ({ category, onSubmitted }: { category: Category; onSubmitted?: (id: string) => void }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  const data = watch();
  const progress = getProgress(data, ['fullName', 'phone', 'requestDetails']);

  const onSubmit = async (data: GeneralFormData) => {
    setIsSubmitting(true);
    try {
      const newId = await formSubmissionService.submitForm({
        formType: 'general',
        categoryId: category.id,
        categoryName: category.name,
        categoryNameAr: category.name_ar,
        fullName: data.fullName,
        phone: data.phone,
        requestDetails: data.requestDetails,
        extraInfo: data.extraInfo,
      });
      onSubmitted?.(newId);
    } catch (error) {
      smartToast.frontend.error('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProgressBar progress={progress} />
      <SuccessMessage visible={showSuccess} />
      
      <Section title="التواصل (إجباري)">
        <FormInput 
          control={control} 
          name="fullName" 
          label="الاسم الكامل" 
          error={errors.fullName} 
          inputRef={fullNameRef}
          autoComplete="name"
        />
        <FormInput 
          control={control} 
          name="phone" 
          label="رقم التليفون" 
          type="tel" 
          error={errors.phone} 
          autoComplete="tel"
        />
      </Section>
      
      <Section title="ما الذي تريده؟">
        <FormInput 
          control={control} 
          name="requestDetails" 
          label="اكتب طلبك بالتفصيل" 
          error={errors.requestDetails} 
        />
      </Section>
      
      <Section title="معلومات إضافية (اختياري)">
        <FormTextarea control={control} name="extraInfo" placeholder="أي شيء آخر تريد إضافته؟" />
      </Section>
      
      <SubmitButton loading={isSubmitting} text="إرسال الآن" />
    </form>
  );
};

// ====================== UI Components (بدون تغيير) ======================
const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  error,
  inputRef,
  autoComplete,
}: {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: FieldErrors<T>[Path<T>];
  inputRef?: React.RefObject<HTMLInputElement>;
  autoComplete?: string;
}) => (
  <div className="space-y-1">
    {label && <label className="text-white/80 text-sm font-medium block">{label}</label>}
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <input
        {...field}
        ref={inputRef}
        value={field.value || ''}
        type={type}
        placeholder={placeholder || label}
        autoComplete={autoComplete}
        className={`w-full px-4 py-2.5 bg-[#16161B] border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#A0A5C0] focus:outline-none focus:ring-1 focus:ring-[#A0A5C0]/30 transition-colors text-sm ${type === 'tel' ? 'text-right' : ''}`}
      />
    )}
  />
    {error?.message && <p className="text-red-400 text-xs mt-0.5">{String(error.message)}</p>}
  </div>
);

const FormTextarea = <T extends FieldValues>({
  control,
  name,
  placeholder,
}: {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <textarea
        {...field}
        rows={4}
        placeholder={placeholder || "اكتب أي تفاصيل إضافية..."}
        className="w-full px-4 py-2.5 bg-[#16161B] border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#A0A5C0] focus:outline-none focus:ring-1 focus:ring-[#A0A5C0]/30 transition-colors text-sm resize-none"
      />
    )}
  />
);

const FormRadioGroup = <T extends FieldValues>({
  control,
  name,
  options,
  error,
}: {
  control: Control<T>;
  name: Path<T>;
  options: readonly string[];
  error?: FieldErrors<T>[Path<T>];
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="space-y-2.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              value={opt}
              checked={field.value === opt}
              onChange={() => field.onChange(opt)}
              className="w-4 h-4 text-[#A0A5C0] focus:ring-[#A0A5C0] focus:ring-1 focus:ring-offset-0"
            />
            <span className="text-sm text-white/90 group-hover:text-white transition-colors">{opt}</span>
          </label>
        ))}
        {error?.message && (
          <p className="text-red-400 text-xs mt-1">{String(error.message)}</p>
        )}
      </div>
    )}
  />
);

const ConditionalSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, height: 0, marginTop: 0 }}
    animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
    exit={{ opacity: 0, height: 0, marginTop: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="overflow-hidden"
  >
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10">
      {children}
    </div>
  </motion.div>
);

const SuccessMessage = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/40 rounded-xl p-5 text-center backdrop-blur-sm"
        role="alert"
        aria-live="polite"
      >
        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-white mb-1">تم إرسال طلبك بنجاح!</h3>
        <p className="text-base text-green-300">هنتواصل معاك خلال دقايق على الواتساب</p>
      </motion.div>
    )}
  </AnimatePresence>
);

const SubmitButton = ({ loading, text }: { loading: boolean; text: string }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white text-base font-bold rounded-lg hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
  >
    {loading ? (
      <>جاري الإرسال... <RefreshCw className="w-4 h-4 animate-spin" /></>
    ) : (
      <>{text} <Send className="w-4 h-4" /></>
    )}
  </button>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-base font-bold text-[#A0A5C0] border-b border-[#8F93A5]/20 pb-1.5">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

// ====================== CategoryPage — الصورة على اليسار في الديسكتوب ✅ ======================
const CategoryPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { categoryId, slug } = useParams<{ categoryId?: string; slug?: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouId, setThankYouId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addOpinion, setAddOpinion] = useState('');
  const [addLink, setAddLink] = useState('');
  const [addRating, setAddRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let foundCategory: Category | null = null;

    if (slug) {
      const decoded = decodeURIComponent(slug);
      foundCategory = mockCategories.find(c => slugify(c.name || '') === decoded) || null;
    } else if (categoryId && !isNaN(parseInt(categoryId, 10))) {
      const catId = parseInt(categoryId, 10);
      foundCategory = mockCategories.find(c => c.id === catId) || null;
    }

    setCategory(foundCategory);
  }, [categoryId, slug]);

  // Load reviews on category change
  useEffect(() => {
    if (!category) return;
    const key = `${REVIEWS_KEY_PREFIX}${category.id}`;
    try {
      const raw = localStorage.getItem(key) || '[]';
      const arr = JSON.parse(raw);
      setReviews(Array.isArray(arr) ? arr : []);
    } catch {
      setReviews([]);
    }
  }, [category]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024 && formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setShowMobileCTA(false);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (window.innerWidth < 1024) {
        const target = e.target as HTMLElement;
        // لا تخفي CTA لو كان الضغط على زر إغلاق الفورم
        const clickedClose = target.closest('[data-close-form="true"]');
        if (clickedClose) return;
        if (formRef.current?.contains(target)) {
          setShowMobileCTA(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // عند إغلاق الفورم على الموبايل، أظهر زر CTA تلقائيًا
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && !isFormExpanded) {
      setShowMobileCTA(true);
    }
  }, [isFormExpanded]);

  const renderDynamicForm = () => {
    if (!category) return null;
    const handleSubmitted = (id: string) => {
      setThankYouId(id);
      setShowThankYou(true);
      setIsFormExpanded(false);
      // بعد الإرسال: إعادة إظهار زر النداء على الموبايل لو كان مختفي
      setShowMobileCTA(true);
    };
    if ([1, 2].includes(category.id)) return <WebsiteForm category={category} onSubmitted={handleSubmitted} />;
    if (category.id === 3) return <AppForm category={category} onSubmitted={handleSubmitted} />;
    if ([4, 5].includes(category.id)) return <GeneralContactForm category={category} onSubmitted={handleSubmitted} />;
    return <GeneralContactForm category={category} onSubmitted={handleSubmitted} />;
  };

  const submitReview = async () => {
    const name = addName.trim();
    const opinion = addOpinion.trim();
    const link = addLink.trim();
    const rating = addRating;
    if (name.length < 2) {
      smartToast.frontend.error(isRTL ? 'الاسم قصير جدًا' : 'Name is too short');
      return;
    }
    if (opinion.length < 3) {
      smartToast.frontend.error(isRTL ? 'اكتب تقييمًا مناسبًا' : 'Write a meaningful review');
      return;
    }
    if (rating < 1 || rating > 5) {
      smartToast.frontend.error(isRTL ? 'اختر عدد النجوم' : 'Choose star rating');
      return;
    }
    if (link && !isUrlLike(link)) {
      smartToast.frontend.error(isRTL ? 'الرابط غير صحيح' : 'Invalid link');
      return;
    }
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newReview: Review = {
      id,
      name,
      opinion,
      createdAt: new Date().toISOString(),
      rating,
      ...(link ? { link } : {}),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      if (category) {
        localStorage.setItem(`${REVIEWS_KEY_PREFIX}${category.id}`, JSON.stringify(updated));
      }
      smartToast.frontend.success(isRTL ? 'تم إضافة تقييمك بنجاح' : 'Your rating has been added successfully');
      setAddName('');
      setAddOpinion('');
      setAddLink('');
      setAddRating(0);
      setShowReviewModal(false);
    } catch {
      smartToast.frontend.error('تعذر حفظ تقييمك محليًا');
    }
  };

  const toggleExpandReview = (id: string) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (!category) {
    return (
      <section className="min-h-screen bg-[#16161B] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-14 h-14 text-[#8F93A5] animate-spin mx-auto mb-5" />
          <p className="text-xl text-white/70 font-bold">جاري تحميل الخدمة...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#16161B] font-['Cairo'] relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 10% 20%, #8F93A5 0%, transparent 20%), radial-gradient(circle at 90% 80%, #6c7081 0%, transparent 20%)`,
        backgroundSize: '800px 800px',
      }}></div>

      <div className="max-w-6xl mx-auto px-4 pt-[90px] lg:pt-[140px] pb-20">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            <span style={{
              background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {isRTL
                ? (category.name_ar || category.name || 'تصنيف خدمة')
                : (category.name_en || category.name || 'Service Category')}
            </span>
          </h1>
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#8F93A5] to-transparent mx-auto rounded-full"></div>
        </div>

        {/* ✅ Desktop: الصورة على اليسار، النص على اليمين */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center mb-14">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#8F93A5]/20 to-[#7A7E95]/20 blur-xl rounded-2xl opacity-70"></div>
              <img 
                src={category.image || "/placeholder.svg"} 
                alt={isRTL ? (category.name_ar || category.name) : (category.name_en || category.name)} 
                className="relative rounded-2xl shadow-2xl max-w-full border border-white/10 w-full max-w-[480px] hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">
              {isRTL
                ? (category.description_ar || 'خدمة احترافية بأفضل الأسعار وأسرع تنفيذ')
                : (category.description || 'Professional service at the best prices and fast delivery')}
            </p>
            <p className="text-base text-[#8F93A5]/80">{isRTL ?'املأ النموذج وسيتواصل معك فريقنا خلال دقائق' : 'Fill out the form and our team will contact you within minutes'}</p>
          </div>
        </div>

        {/* Mobile: image → text */}
        <div className="lg:hidden space-y-6 mb-12">
          <div className="flex justify-center">
            <img 
              src={category.image || "/placeholder.svg"} 
              alt={isRTL ? (category.name_ar || category.name) : (category.name_en || category.name)} 
              className="rounded-xl shadow-lg max-w-full border border-white/10 w-full max-h-56 object-cover"
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">
              {isRTL
                ? (category.description_ar || 'خدمة احترافية بأفضل الأسعار وأسرع تنفيذ')
                : (category.description || 'Professional service at the best prices and fast delivery')}
            </p>
            <p className="text-base text-[#8F93A5]/80">
              {isRTL 
                ? 'املأ النموذج وسيتواصل معك فريقنا خلال دقائق' 
                : 'Fill out the form and our team will contact you within minutes'}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex justify-center mt-10 mb-16">
          <button
            onClick={() => {
              setIsFormExpanded(true);
              setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
            }}
            className="group px-6 py-2.5 bg-gradient-to-r from-[#A0A5C0]/80 to-[#7A7E95]/80 text-white text-base font-bold rounded-lg shadow hover:shadow-md transition-all duration-200 border border-white/10 backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
                {isRTL ? 'اطلب الخدمة الآن' : 'order the service now'}
              <Send className="w-4 h-4" />
            </span>
          </button>
        </div> 

        <AnimatePresence initial={false}>
          {isFormExpanded && (
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }} 
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-white">ابدأ طلبك الآن</h2>
                  <button 
                    data-close-form="true"
                    onClick={() => {
                      setIsFormExpanded(false);
                      setShowMobileCTA(true);
                    }} 
                    className="text-[#8F93A5] hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 rotate-180" />
                  </button>
                </div>
                {renderDynamicForm()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile CTA — inline above reviews */}
        {!isFormExpanded && (
          <div className="lg:hidden flex justify-center mt-6 mb-8">
            <button
              onClick={() => {
                setIsFormExpanded(true);
                setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
              }}
              className="group px-6 py-2.5 bg-gradient-to-r from-[#A0A5C0]/80 to-[#7A7E95]/80 text-white text-base font-bold rounded-lg shadow hover:shadow-md transition-all duration-200 border border-white/10 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                {isRTL ? 'اطلب الخدمة الآن' : 'order the service now'}
                <Send className="w-4 h-4" />
              </span>
            </button>
          </div>
        )}

        {/* قسم الآراء والتعليقات — تصميم زجاجي متناسق مع الصفحة */}
        <div className="mt-32 sm:mt-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] p-5 sm:p-6 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">{isRTL ? 'آراء العملاء' : 'Customer Reviews'}</h2>
              <button
                onClick={() => setShowReviewModal(true)}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white shadow-sm hover:shadow-md hover:opacity-95 transition"
                aria-haspopup="dialog"
                aria-expanded={showReviewModal}
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                {isRTL ? 'أضف تقييمك' : 'Add Your Rating'}
              </button>
            </div>
            <p className="text-sm text-[#A0A5C0] mb-4">{isRTL ? 'تعليقات حقيقية من عملائنا لمساعدتك على اتخاذ القرار.' : 'Real client feedback to help you decide.'}</p>

            {reviews.length === 0 ? (
              <p className="text-[#A0A5C0]">{isRTL ? 'لا توجد تعليقات بعد. كن أول من يترك رأيه.' : 'No reviews yet. Be the first to leave yours.'}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-2 sm:gap-3">
                {reviews.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileHover={{ y: -1 }}
                    className="group flex flex-col h-full rounded-xl border border-white/12 p-3 sm:p-3 bg-white/[0.06] hover:bg-white/[0.09] transition ring-1 ring-white/5 hover:ring-white/10 shadow-sm hover:shadow-md relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-500/30 via-teal-400/25 to-emerald-500/30" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#8F93A5] to-[#6c7081] flex items-center justify-center text-white shrink-0 ring-1 ring-white/15 shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold tracking-tight text-[12px] sm:text-[13px]">{r.name}</span>
                            <span className="text-white/50 text-xs">{formatDate(r.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                        {typeof r.rating === 'number' && r.rating > 0 && (
                          <div className="flex items-center gap-0.5" aria-label={isRTL ? `تقييم ${r.rating} نجوم` : `Rating ${r.rating} stars`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < (r.rating || 0) ? 'text-amber-400 drop-shadow-sm' : 'text-white/20'}`}
                                fill={i < (r.rating || 0) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        )}
                        {r.link && (
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors ring-1 ring-white/5 hover:ring-white/10 shadow-sm"
                            aria-label={isRTL ? 'فتح الرابط' : 'Open link'}
                          >
                            <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                            <span className="text-[11px] sm:text-xs font-semibold tracking-wide">{isRTL ? 'رابط' : 'Link'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-white/80 leading-relaxed mt-0.5 text-[12px] sm:text-[13px] break-words ${expandedReviews[r.id] ? 'review-clamp--none' : 'review-clamp'}`}
                      >
                        {r.opinion}
                      </motion.p>
                    </div>
                    
                    {r.opinion.length > 120 && (
                      <button
                        onClick={() => toggleExpandReview(r.id)}
                        className="text-[#A0A5C0] hover:text-white text-xs sm:text-sm mt-2 inline-flex items-center gap-1 underline decoration-white/20"
                        aria-expanded={!!expandedReviews[r.id]}
                      >
                        <span>{expandedReviews[r.id] ? (isRTL ? 'إخفاء' : 'Hide') : (isRTL ? 'عرض المزيد' : 'Show more')}</span>
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${expandedReviews[r.id] ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                    
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* مودال إضافة تعليق — Bottom Sheet على الموبايل */}
        <AnimatePresence>
          {showReviewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full sm:max-w-md bg-[#1f1f1f] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{isRTL ? 'أضف تقييمك' : 'Add Your Rating'}</h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-[#8F93A5] hover:text-white transition"
                    aria-label={isRTL ? 'إغلاق' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder={isRTL ? 'اسمك' : 'Your name'}
                    className="w-full px-4 py-2.5 bg-[#16161B] border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#A0A5C0] focus:outline-none focus:ring-1 focus:ring-[#A0A5C0]/30 transition-colors text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">{isRTL ? 'اختر التقييم:' : 'Choose rating:'}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const val = i + 1;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAddRating(val)}
                            className="p-1"
                            aria-label={isRTL ? `${val} نجوم` : `${val} stars`}
                          >
                            <Star
                              className={`w-5 h-5 ${addRating >= val ? 'text-yellow-400' : 'text-white/30'}`}
                              fill={addRating >= val ? 'currentColor' : 'none'}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={addLink}
                    onChange={(e) => setAddLink(e.target.value)}
                    placeholder={isRTL ? 'رابط (اختياري)' : 'Link (optional)'}
                    className="w-full px-4 py-2.5 bg-[#16161B] border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#A0A5C0] focus:outline-none focus:ring-1 focus:ring-[#A0A5C0]/30 transition-colors text-sm"
                  />
                  <textarea
                    rows={4}
                    value={addOpinion}
                    onChange={(e) => setAddOpinion(e.target.value)}
                    placeholder={isRTL ? 'اكتب تقييمك باختصار' : 'Write your review briefly'}
                    className="w-full px-4 py-2.5 bg-[#16161B] border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#A0A5C0] focus:outline-none focus:ring-1 focus:ring-[#A0A5C0]/30 transition-colors text-sm resize-none"
                  />
                  <button
                    onClick={submitReview}
                    className="w-full py-2.5 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white font-bold rounded-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isRTL ? 'إرسال تقييمك' : 'Submit your rating'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      

      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#25D366]/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-20 animate-ping"></div>
          <WhatsAppButton />
        </div>
      </div>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-xl p-6 text-center"
              role="dialog"
              aria-modal="true"
            >
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-1">شكراً لك!</h3>
              <p className="text-[#A0A5C0] mb-4">تم تسجيل طلبك بنجاح.</p>
              {thankYouId && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white mb-4">
                  <span className="text-sm">رقم الطلب:</span>
                  <span className="font-mono text-sm font-bold">#{thankYouId.slice(-6)}</span>
                </div>
              )}
              <button
                onClick={async () => {
                  if (!thankYouId) {
                    smartToast.frontend.error('لا يوجد رقم طلب');
                    return;
                  }
                  try {
                    await navigator.clipboard.writeText(thankYouId);
                    smartToast.frontend.success('تم نسخ رقم الطلب');
                  } catch (err) {
                    smartToast.frontend.error('تعذر نسخ رقم الطلب');
                  }
                }}
                className="w-full py-2.5 mb-2 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/15 transition flex items-center justify-center gap-2"
                aria-label="نسخ رقم الطلب"
              >
                <Copy className="w-4 h-4" />
                نسخ رقم الطلب
              </button>
              <button
                onClick={() => {
                  // إغلاق النافذة والشريط أعلى الصفحة وإظهار زر الإضافة
                  setShowThankYou(false);
                  setIsFormExpanded(false);
                  setShowMobileCTA(true);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white font-bold rounded-lg hover:opacity-95 transition"
              >
                إغلاق 
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 
          0% { background-position: -200% 0; } 
          100% { background-position: 200% 0; } 
        }
      `}} />
    </section>
  );
};

export default CategoryPage;