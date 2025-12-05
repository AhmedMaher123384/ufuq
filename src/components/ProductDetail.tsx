import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { smartToast } from '../utils/toastConfig';
import { extractIdFromSlug, isValidSlug, createProductSlug } from '../utils/slugify';
import {
  ArrowRight,
  Gift,
  Send,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { buildImageUrl } from '../config/api';
import { mockProducts } from '../mock/products';
import { mockCategories } from '../mock/categories';
import { useCurrency } from '../contexts/CurrencyContext';
import PriceDisplay from './ui/PriceDisplay';
import ProductOptionsSelector from './ui/ProductOptionsSelector';

interface ProductOption {
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

interface Product {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  mainImage: string;
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
}

interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
}

// FAQ Card
const FAQCard: React.FC<{ faq: any; index: number }> = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  const getLocalizedFAQContent = (field: 'question' | 'answer') => {
    const currentLang = i18n.language;
    if (currentLang === 'ar') {
      return faq[`${field}_ar`] || faq[`${field}_en`] || faq[field] || '';
    } else {
      return faq[`${field}_en`] || faq[`${field}_ar`] || faq[field] || '';
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/60 rounded-xl border border-[#18b5d8]/20 overflow-hidden transition-all duration-300 hover:border-[#18b5d8]/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-right flex items-center justify-between group"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="bg-gradient-to-r from-[#18b5d8] to-[#16a8cc] rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold">
            {index + 1}
          </div>
          <h4 className="font-semibold text-white text-base group-hover:text-[#18b5d8] transition-colors">
            {getLocalizedFAQContent('question')}
          </h4>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[#18b5d8]" /> : <ChevronDown className="w-5 h-5 text-[#7a7a7a]" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4">
          <div className="bg-[#0f0f0f]/50 rounded-xl p-4 border-r-4 border-[#18b5d8]">
            <p className="text-[#e0e0e0] text-base leading-relaxed whitespace-pre-wrap">
              {getLocalizedFAQContent('answer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { t, i18n } = useTranslation(['product_detail', 'common']);
  const isRTL = i18n.language === 'ar';
  const { formatPrice } = useCurrency();
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [attachments, setAttachments] = useState<{ images: File[]; text: string }>({ images: [], text: '' });
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);
  const [selectedProductOptions, setSelectedProductOptions] = useState<any[]>([]);
  const [productOptionsPriceModifier, setProductOptionsPriceModifier] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const bookingButtonRef = useRef<HTMLButtonElement | null>(null);

  // استخراج ID
  const productId = (() => {
    const decodedSlug = slug ? decodeURIComponent(slug) : '';
    if (id && id.trim()) return id.trim();
    if (decodedSlug) {
      if (/^\d+$/.test(decodedSlug)) return decodedSlug;
      if (isValidSlug(decodedSlug)) return extractIdFromSlug(decodedSlug).toString();
    }
    return '';
  })();

  // Localization
  const getLocalizedContent = (field: 'name' | 'description', item?: any) => {
    const currentLang = i18n.language;
    const isArabic = (currentLang || '').toLowerCase().startsWith('ar');
    const target = item || product;
    if (!target) return '';
    const ar = target[`${field}_ar`];
    const en = target[`${field}_en`];
    const base = target[field];
    return isArabic ? (ar || base || en || '') : (en || base || ar || '');
  };

  const getCategoryName = () => {
    if (!category) return '';
    const currentLang = i18n.language;
    const isArabic = (currentLang || '').toLowerCase().startsWith('ar');
    return isArabic ? (category.name_ar || category.name) : (category.name_en || category.name);
  };

  useEffect(() => {
    if (productId) fetchProduct();
    else {
      setError(t('invalid_product_id'));
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const idNum = parseInt(productId!, 10);
      const data = mockProducts.find(p => p.id === idNum);
      if (!data) throw new Error();
      setProduct(data);
      if (data.categoryId) {
        const cat = mockCategories.find(c => c.id === data.categoryId);
        setCategory(cat || null);
      }
    } catch {
      setError(t('failed_to_load'));
    } finally {
      setLoading(false);
    }
  };

  // Attachments
  const handleAttachmentImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(prev => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const removeAttachmentImage = (i: number) => {
    setAttachments(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i)
    }));
  };

  // Add-ons
  const toggleAddOn = (addOn: any) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.name === addOn.name);
      return exists ? prev.filter(a => a.name !== addOn.name) : [...prev, addOn];
    });
  };

  // Options
  const handleProductOptionsChange = useCallback((options: any[], modifier: number) => {
    setSelectedProductOptions(options);
    setProductOptionsPriceModifier(modifier);
  }, []);

  // Pricing
  const addOnsPrice = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const totalPrice = addOnsPrice + productOptionsPriceModifier;

  // Auto scroll to button when opening booking form
  useEffect(() => {
    if (showBookingForm && bookingButtonRef.current) {
      bookingButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showBookingForm]);

  // Validation
  const validateRequiredOptions = () => {
    if (!product?.productOptions) return true;
    for (const opt of product.productOptions.filter(o => o.required)) {
      const sel = selectedProductOptions.find(s => s.optionId === opt.id);
      if (!sel || (typeof sel.value === 'string' && !sel.value.trim()) || (Array.isArray(sel.value) && sel.value.length === 0)) {
        const label = i18n.language === 'ar' ? opt.label.ar : opt.label.en;
        smartToast.frontend.error(t('required_option_missing', { option: label }));
        return false;
      }
    }
    return true;
  };

  // WhatsApp
  const sendWhatsAppRequest = () => {
    if (!product || !validateRequiredOptions()) return;
    setAddingToCart(true);
    try {
      const phone = '201010943754';
      const lines: string[] = [];
      lines.push(i18n.language === 'ar' ? 'طلب منتج' : 'Product Order');
      lines.push(`${i18n.language === 'ar' ? 'المنتج' : 'Product'}: ${getLocalizedContent('name')}`);

      if (selectedProductOptions.length > 0) {
        lines.push(i18n.language === 'ar' ? 'الخيارات:' : 'Options:');
        selectedProductOptions.forEach(sel => {
          const opt = product.productOptions!.find(o => o.id === sel.optionId);
          if (opt) {
            const label = i18n.language === 'ar' ? opt.label.ar : opt.label.en;
            const valueText = Array.isArray(sel.value)
              ? sel.value.map((v: string) => {
                  const ov = opt.options?.find(o => o.value === v);
                  return ov ? (i18n.language === 'ar' ? ov.label.ar : ov.label.en) : v;
                }).join(', ')
              : (() => {
                  const ov = opt.options?.find(o => o.value === sel.value);
                  return ov ? (i18n.language === 'ar' ? ov.label.ar : ov.label.en) : sel.value;
                })();
            lines.push(`• ${label}: ${valueText}`);
          }
        });
      }

      if (selectedAddOns.length > 0) {
        lines.push(i18n.language === 'ar' ? 'الإضافات:' : 'Add-ons:');
        selectedAddOns.forEach(a => {
          const name = i18n.language === 'ar' ? (a.name_ar || a.name) : (a.name_en || a.name);
          lines.push(`• ${name}`);
        });
      }

      if (attachments.text.trim()) {
        lines.push(i18n.language === 'ar' ? 'ملاحظات:' : 'Notes:');
        lines.push(attachments.text.trim());
      }

      const message = lines.join('\n');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      smartToast.frontend.success(i18n.language === 'ar' ? 'تم فتح واتساب' : 'WhatsApp opened');
    } catch {
      smartToast.frontend.error(t('error'));
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading / Error
  if (loading) {
    return (
      <div className="min-h-screen bg-[#16161B] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18b5d8] mx-auto mb-3"></div>
          <h2 className="text-lg font-bold text-white">{t('loading_product')}</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#16161B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold text-white mb-3">{t('product_not_found')}</h1>
          <button onClick={() => navigate('/')} className="text-[#18b5d8] underline text-sm">
            {t('back_home')}
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = `${getLocalizedContent('name')} | ${getCategoryName() || 'أفق الرقمية'}`;
  const pageDescription = getLocalizedContent('description');
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productSlug = createProductSlug(product.id, getLocalizedContent('name'));
  const canonical = `${siteUrl}/product/${productSlug}`;
  const productImage = buildImageUrl(product.mainImage);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        <link rel="canonical" href={canonical} />
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={productImage} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        {pageDescription && <meta name="twitter:description" content={pageDescription} />}
        <meta name="twitter:image" content={productImage} />

        {/* JSON-LD: Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: getLocalizedContent('name'),
            description: pageDescription,
            image: productImage,
            brand: { '@type': 'Brand', name: 'أفق الرقمية' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'SAR',
              price: product.price,
              availability: product.isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: canonical,
            },
          })}
        </script>
      </Helmet>

      <section className="min-h-screen bg-[#16161B] relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18b5d8]/10 via-transparent to-[#18b5d8]/10"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 mt-32">
       

        {/* اسم المنتج */}
        <h1 className="text-3xl font-bold text-white mb-16 text-center tracking-wide">{getLocalizedContent('name')}</h1>

        {/* === الصورة + الوصف جنب بعض، منسقين بمسافات ناعمة وكبيرة === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 items-start">
          {/* الصورة على اليسار */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <div className="bg-gradient-to-br from-[#1a1a1a]/40 to-[#2a2a2a]/20 p-6 rounded-3xl shadow-2xl shadow-[#18b5d8]/10 backdrop-blur-lg border border-[#18b5d8]/5 transition-all duration-300 hover:shadow-[#18b5d8]/20">
                <img
                  src={buildImageUrl(product.mainImage)}
                  alt={getLocalizedContent('name')}
                  className="w-full h-auto object-contain rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
            </div>
          </div>

          {/* الوصف على اليمين */}
          <div className="flex flex-col justify-center">
            <div className="bg-gradient-to-br from-[#1a1a1a]/30 to-[#2a2a2a]/10 p-8 rounded-3xl shadow-2xl shadow-[#18b5d8]/10 backdrop-blur-lg border border-[#18b5d8]/5 transition-all duration-300 hover:shadow-[#18b5d8]/20">
              <div className="text-[#e0e0e0] text-lg leading-loose whitespace-pre-wrap">
                {getLocalizedContent('description')}
              </div>
            </div>
          </div>
        </div>

        {/* زر احجز الآن */}
        <div className="mb-12 max-w-md mx-auto">
          <button
            ref={bookingButtonRef}
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#18b5d8] to-[#16a8cc] text-white py-5 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-[#18b5d8]/30 transition-all duration-300"
          >
            <ChevronDown className={`w-6 h-6 transition-transform ${showBookingForm ? 'rotate-180' : ''}`} />
            {(i18n.language || '').toLowerCase().startsWith('ar') ? 'اطلب الخدمة' : 'Book Now'}
          </button>
        </div>

        {/* === كونتينر الخيارات (القائمة) - عرض أصغر، محسن واحترافي === */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showBookingForm ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-2xl mx-auto rounded-2xl p-6 bg-[#0f0f0f]/90 backdrop-blur-xl border border-white/10 mb-12 shadow-xl transition-all duration-300">
            {/* Header: show localized product name only */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#18b5d8]/15 border border-[#18b5d8]/30">
                  <FileText className="w-3 h-3 text-[#18b5d8]" />
                </span>
                <div>
                  <h3 className="text-white font-medium text-xs">{getLocalizedContent('name')}</h3>
                </div>
              </div>
            </div>
            {/* السعر الإجمالي */}
            {totalPrice > 0 && (
              <div className="p-4 bg-[#18b5d8]/5 rounded-3xl border border-[#18b5d8]/10 mb-6 transition-all duration-300">
                <div className="text-xs text-[#7a7a7a]">{t('total_price')}:</div>
                <div className="text-sm font-semibold text-[#18b5d8]">{formatPrice(totalPrice)}</div>
              </div>
            )}

            {/* خيارات المنتج */}
            {product.productOptions && product.productOptions.length > 0 && (
              <div className="mb-6">
                <div className="rounded-xl border border-white/10 bg-[#0f0f0f]/60 p-2 text-xs">
                  <ProductOptionsSelector
                    options={product.productOptions}
                    language={i18n.language}
                    onSelectionChange={handleProductOptionsChange}
                  />
                </div>
              </div>
            )}

            {/* الإضافات */}
            {product.addOns && product.addOns.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#18b5d8]" />
                  {t('addons')}
                </h3>
                <div className="rounded-xl border border-white/10 bg-[#0f0f0f]/60 p-2">
                  <div className="grid gap-2">
                    {product.addOns.map((addOn, i) => {
                      const selected = selectedAddOns.some(a => a.name === addOn.name);
                      return (
                        <div
                          key={i}
                          onClick={() => toggleAddOn(addOn)}
                          className={`group p-3 rounded-lg border cursor-pointer transition-all duration-300 ${selected ? 'border-[#18b5d8] bg-[#18b5d8]/10' : 'border-white/10 hover:border-[#18b5d8]/40 hover:bg-white/5'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selected}
                                readOnly
                                className="mt-0.5 w-3 h-3 rounded accent-[#18b5d8] bg-transparent border-white/30"
                              />
                              <div>
                                <h4 className="font-medium text-white text-[11px]">{getLocalizedContent('name', addOn)}</h4>
                                {getLocalizedContent('description', addOn) && (
                                  <p className="text-[#9aa0a6] text-[10px] mt-0.5">{getLocalizedContent('description', addOn)}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-[11px] font-medium text-[#18b5d8]">+<PriceDisplay price={addOn.price} /></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* المرفقات */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-white mb-2">{i18n.language === 'ar' ? 'مرفقات (اختياري)' : 'Attachments (Optional)'}</h3>
              <textarea
                value={attachments.text}
                onChange={e => setAttachments(prev => ({ ...prev, text: e.target.value }))}
                rows={3}
                className="w-full p-4 bg-[#0f0f0f]/60 border border-white/10 rounded-xl focus:border-[#18b5d8] focus:bg-[#0f0f0f]/80 text-white text-xs transition duration-300"
                placeholder={t('notes_placeholder')}
              />
              <div className="mt-4">
                <input type="file" multiple accept="image/*" onChange={handleAttachmentImagesChange} className="hidden" id="attach-imgs" />
                <label htmlFor="attach-imgs" className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-[#18b5d8]/40 hover:bg-[#18b5d8]/10 transition duration-300 text-sm">
                  <span className="text-2xl">📷</span>
                  <span className="font-medium">{t('add_images')}</span>
                </label>
                {attachments.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {attachments.images.map((f, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(f)} alt="attach" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                        <button onClick={() => removeAttachmentImage(i)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition duration-300">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* زر واتساب داخل الكونتينر */}
            <button
              onClick={sendWhatsAppRequest}
              disabled={addingToCart || !product.isAvailable}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white py-4 rounded-3xl font-bold text-sm shadow-lg hover:shadow-[#25d366]/20 hover:brightness-105 disabled:opacity-50 transition-all duration-300"
            >
              {addingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              {i18n.language === 'ar' ? 'إرسال الطلب عبر واتساب' : 'Send Request via WhatsApp'}
            </button>
          </div>
        </div>

        {/* FAQs */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">{t('faqs')}</h3>
            <div className="space-y-5 max-w-4xl mx-auto">
              {product.faqs.map((faq, i) => (
                <FAQCard key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      </div>
    </section>
    </>
  );
};

// Related Products
const RelatedProducts: React.FC<{ currentProductId: number; categoryId: number | null }> = ({ currentProductId, categoryId }) => {
  const { t, i18n } = useTranslation(['product_detail', 'common']);
  const navigate = useNavigate();
  const [related, setRelated] = useState<Product[]>([]);

  const getLocalized = (field: string, p: Product) => {
    const lang = i18n.language;
    const ar = (p as any)[`${field}_ar`] || p[field as keyof Product];
    const en = (p as any)[`${field}_en`] || p[field as keyof Product];
    return lang === 'ar' ? ar : en;
  };

  useEffect(() => {
    if (categoryId) {
      const list = mockProducts
        .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
        .slice(0, 6);
      setRelated(list as any);
    }
  }, [categoryId, currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white text-center mb-8">{t('related_products')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {related.map(p => (
          <div key={p.id}
            onClick={() => navigate(`/product/${createProductSlug(p.id, getLocalized('name', p))}`)}
            className="bg-gradient-to-br from-[#16161B]/95 to-[#2a2a2a]/80 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-[#18b5d8]/20 transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img src={buildImageUrl(p.mainImage)} alt={getLocalized('name', p)}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <h3 className="text-base font-bold text-white line-clamp-2 mb-2">{getLocalized('name', p)}</h3>
              <div className="flex justify-between items-center">
                <PriceDisplay price={p.price} className="text-base font-bold text-[#18b5d8]" />
                <span className="text-xs bg-[#18b5d8]/20 text-[#18b5d8] px-3 py-1 rounded-full">عرض</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;