import React, { useState, useEffect, useRef, useMemo } from 'react';
declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { smartToast } from './utils/toastConfig';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Package, Gift, Sparkles, ArrowLeft, Plus, Minus, Star, Users, Shield, Crown, Truck, Medal, Award, Tag, Zap, Code, Smartphone, Globe, Palette, CheckCircle, ArrowRight, Monitor, Database, Cloud, Phone, Mail, MapPin, Quote, User } from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaUser } from 'react-icons/fa';
import { apiCall, API_ENDPOINTS, buildImageUrl } from './config/api';
import WhatsAppButton from './components/ui/WhatsAppButton';
import ScrollProgressIndicator from './components/ui/ScrollProgressIndicator';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import LoadingScreen from './components/ui/LoadingScreen';
import { useLoading } from './contexts/LoadingContext';
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import AboutUsSection from './components/home/AboutUsSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import ProjectJourneyAchievements from './components/home/ProjectJourneyAchievements';
import ClientsSection from './components/home/ClientsSection';
import FAQSection from './components/home/FAQSection';
import ContactSection from './components/home/ContactSection';
import { createCategorySlug, createProductSlug } from './utils/slugify';
import { isMobileDevice } from './utils/deviceDetection';
import Navbar from './components/layout/Navbar';
import { mockProducts } from './mock/products';
import { mockCategories } from './mock/categories';
import malakImg from './assets/malak.webp';
import heroImg from './assets/hero.webp';
import footerImg from './assets/footer.webp';
import logoImg from './assets/logo.png';

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
  subcategoryId?: number | null;
  mainImage: string;
  detailedImages?: string[];
  productType?: string;
  createdAt?: string;
}

interface Theme {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  mainImage: string;
  detailedImages?: string[];
  createdAt?: string;
}

interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  categoryType?: 'regular' | 'theme';
}

interface CategoryProducts {
  category: Category;
  products: Product[];
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  showInFooter: boolean;
  createdAt: string;
}

interface Testimonial {
  id: number;
  name: string;
  testimonial: string;
  image?: string;
  createdAt: string;
}

interface Client {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  createdAt: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { isLoading, setIsLoading } = useLoading();

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState<number>(0);
  const [currentClientIndex, setCurrentClientIndex] = useState<number>(0);
  const [isTestimonialTransitioning, setIsTestimonialTransitioning] = useState<boolean>(false);
  const [isClientTransitioning, setIsClientTransitioning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const testimonialIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const testimonialsTrackRef = useRef<HTMLDivElement | null>(null);

  const slides = [
    {
      title: 'منتجات احترافية متميزة',
      subtitle: 'نقدم لك أفضل الخدمات بجودة عالية وأسعار منافسة'
    },
    { 
      title: 'فريق عمل محترف',
      subtitle: 'خبراء متخصصون في جميع المجالات لخدمتك'
    },
    {
      title: 'ضمان الجودة والتميز',
      subtitle: 'نضمن لك الحصول على أفضل النتائج'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // التحقق من نوع الجهاز
        const isMobile = isMobileDevice();
        
        // إذا كان الجهاز محمول، إخفاء شاشة التحميل فوراً
        if (isMobile) {
          setIsLoading(false);
        }
        
        // تحميل البيانات
        await Promise.all([
          fetchCategoryProducts(),
          fetchStaticPages(),
          fetchTestimonials(),
          fetchClients()
        ]);
        loadWishlistFromStorage();
        
        // تحميل الصور المهمة مسبقاً (فقط للأجهزة الكبيرة)
        if (!isMobile) {
          const preloadImages = () => {
            return new Promise<void>((resolve) => {
              let loadedCount = 0;
              const imagesToPreload = [
                '/favi.ico',
                // يمكن إضافة صور أخرى مهمة هنا
              ];
              
              if (imagesToPreload.length === 0) {
                resolve();
                return;
              }
              
              imagesToPreload.forEach((src) => {
                const img = new Image();
                img.onload = img.onerror = () => {
                  loadedCount++;
                  if (loadedCount === imagesToPreload.length) {
                    resolve();
                  }
                };
                img.src = src;
              });
            });
          };
          
          await preloadImages();
          
          // إخفاء شاشة التحميل بعد تحميل جميع البيانات والصور (فقط للأجهزة الكبيرة)
          setTimeout(() => {
            setIsLoading(false);
          }, 300); // تأخير قصير للانتقال السلس
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [setIsLoading]);

  useEffect(() => {
  console.log("Home Mounted");
}, []);
  // سيتم نقل useEffect للأنيميشن التلقائي بعد تعريف الدوال

  // سلايدر الشهادات: تنقل دائري مع أسهم
  const scrollByOneCard = (dir: 1 | -1) => {
    const ref = testimonialsTrackRef.current;
    if (!ref || testimonials.length === 0) {
      console.log('❌ [Testimonials] Ref not found or no testimonials:', { ref: !!ref, testimonialsLength: testimonials.length });
      return;
    }
    
    console.log('🔄 [Testimonials] Scrolling direction:', dir === 1 ? 'right' : 'left');
    
    const firstCard = ref.querySelector('[data-testimonial-card]') as HTMLElement | null;
    if (!firstCard) {
      console.log('❌ [Testimonials] No testimonial card found');
      return;
    }
    
    const cardW = firstCard.offsetWidth || 400; // استخدام العرض الافتراضي
    const gap = 24; // gap-6 بين الكروت
    const amount = (cardW + gap) * dir;
    
    const currentScroll = ref.scrollLeft;
    const maxScroll = ref.scrollWidth - ref.clientWidth;
    
    console.log('📊 [Testimonials] Scroll info:', {
      cardWidth: cardW,
      gap,
      amount,
      currentScroll,
      maxScroll,
      scrollWidth: ref.scrollWidth,
      clientWidth: ref.clientWidth
    });
    
    if (dir === 1) {
      // التحرك يميناً
      if (currentScroll >= maxScroll - 10) {
        // وصلنا للنهاية، نعود للبداية
        console.log('🔄 [Testimonials] Reached end, going to start');
        ref.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        console.log('➡️ [Testimonials] Scrolling right by:', amount);
        ref.scrollBy({ left: amount, behavior: 'smooth' });
      }
    } else {
      // التحرك شمالاً
      if (currentScroll <= 10) {
        // وصلنا للبداية، نذهب للنهاية
        console.log('🔄 [Testimonials] Reached start, going to end');
        ref.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        console.log('⬅️ [Testimonials] Scrolling left by:', amount);
        ref.scrollBy({ left: amount, behavior: 'smooth' });
      }
    }
  };

  const handleNextTestimonial = () => {
    console.log('🎯 [Testimonials] Next button clicked');
    scrollByOneCard(1);
  };
  
  const handlePrevTestimonial = () => {
    console.log('🎯 [Testimonials] Previous button clicked');
    scrollByOneCard(-1);
  };

  useEffect(() => {
    if (clients.length > 1) {
      clientIntervalRef.current = setInterval(() => {
        setIsClientTransitioning(true);
        setTimeout(() => {
          setCurrentClientIndex((prev) => (prev + 1) % clients.length);
          setIsClientTransitioning(false);
        }, 300);
      }, 3000);

      return () => {
        if (clientIntervalRef.current) {
          clearInterval(clientIntervalRef.current);
        }
      };
    }
  }, [clients.length]);

  // تم استبدال هذا بـ useEffect الجديد أعلاه

  const loadWishlistFromStorage = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const categories: Category[] = mockCategories.map((c) => ({
        id: c.id,
        name: c.name,
        name_ar: (c as any).name_ar,
        name_en: (c as any).name_en,
        description: c.description,
        description_ar: (c as any).description_ar,
        description_en: (c as any).description_en,
        image: c.image,
      }));
      const products: Product[] = mockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        name_ar: (p as any).name_ar,
        name_en: (p as any).name_en,
        description: p.description,
        description_ar: (p as any).description_ar,
        description_en: (p as any).description_en,
        price: p.price,
        originalPrice: p.originalPrice,
        isAvailable: p.isAvailable,
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        mainImage: p.mainImage,
        detailedImages: p.detailedImages,
        createdAt: p.createdAt,
      }));
      
      const isThemesCategory = (category: Category | any): boolean => {
        const base = category.name || '';
        const ar = category.name_ar || '';
        const en = category.name_en || '';
        return (ar.trim() === 'ثيمات') || (en?.toLowerCase().trim() === 'themes') || (base?.toLowerCase().trim() === 'themes');
      };
      
      const isThemeProduct = (product: Product | any): boolean => {
        const base = product.name || '';
        const ar = product.name_ar || '';
        const en = product.name_en || '';
        return base?.toLowerCase().includes('theme') || base?.includes('ثيم') || en?.toLowerCase().includes('theme') || ar?.includes('ثيم');
      };
      
      const regularCategories: Category[] = categories.filter((category: Category) => !isThemesCategory(category));
      const themeProducts: Theme[] = products
        .filter((product: Product) => isThemeProduct(product))
        .map((p: Product) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          isAvailable: p.isAvailable,
          categoryId: p.categoryId,
          mainImage: p.mainImage,
          detailedImages: p.detailedImages,
          createdAt: p.createdAt,
        }));
      const regularProducts: Product[] = products.filter((product: Product) => !isThemeProduct(product));
      
      const categoryProductsData: CategoryProducts[] = regularCategories.map((category: Category) => ({
        category,
        products: regularProducts.filter((product: Product) => product.categoryId === category.id),
      }));
      setCategoryProducts(categoryProductsData);
      setThemes(themeProducts);
    } catch (error) {
      console.error('Error fetching category products (local fallback):', error);
      setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
      smartToast.frontend.error('فشل في تحميل البيانات');
      setCategoryProducts([]);
      setThemes([]);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchStaticPages = async () => {
    try {
      const cached = localStorage.getItem('staticPages');
      if (cached) {
        setStaticPages(JSON.parse(cached));
        return;
      }
      const pages: StaticPage[] = [
        { id: 'about', title: t('footer.about_us'), slug: 'about', content: '', showInFooter: true, createdAt: new Date().toISOString() },
        { id: 'privacy-policy', title: t('footer.privacy_policy'), slug: 'privacy-policy', content: '', showInFooter: true, createdAt: new Date().toISOString() },
        { id: 'terms-and-conditions', title: t('footer.terms_conditions'), slug: 'terms-and-conditions', content: '', showInFooter: true, createdAt: new Date().toISOString() },
      ];
      setStaticPages(pages);
      localStorage.setItem('staticPages', JSON.stringify(pages));
    } catch (error) {
      console.error('Error fetching static pages (local fallback):', error);
      setStaticPages([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const cached = localStorage.getItem('cachedTestimonials');
      if (cached) {
        setTestimonials(JSON.parse(cached));
        return;
      }
      const tData: Testimonial[] = [
        { id: 1, name: 'عميل 1', testimonial: 'خدمة ممتازة!', image: malakImg, createdAt: new Date().toISOString() },
        { id: 2, name: 'عميل 2', testimonial: 'نتائج رائعة!', image: heroImg, createdAt: new Date().toISOString() },
      ];
      setTestimonials(tData);
      localStorage.setItem('cachedTestimonials', JSON.stringify(tData));
    } catch (error) {
      console.error('❌ [App] Error fetching testimonials (local fallback):', error);
      setTestimonials([]);
    }
  };

  const fetchClients = async () => {
    try {
      const cached = localStorage.getItem('cachedClients');
      if (cached) {
        setClients(JSON.parse(cached));
        return;
      }
      const cData: Client[] = [
        { id: 1, name: 'عميل 1', logo: logoImg, website: 'https://UfuqDigital.com', createdAt: new Date().toISOString() },
        { id: 2, name: 'عميل 2', logo: footerImg, website: '', createdAt: new Date().toISOString() },
      ];
      setClients(cData);
      localStorage.setItem('cachedClients', JSON.stringify(cData));
    } catch (error) {
      console.error('❌ [App] Error fetching clients (local fallback):', error);
      setClients([]);
    }
  };

  const handleQuantityIncrease = (productId: number, maxStock: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 1;
      if (currentQuantity < maxStock) {
        return { ...prev, [productId]: currentQuantity + 1 };
      }
      return prev;
    });
  };

  const handleQuantityDecrease = (productId: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 1;
      if (currentQuantity > 1) {
        return { ...prev, [productId]: currentQuantity - 1 };
      }
      return prev;
    });
  };

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      const quantity = quantities[productId] || 1;
      const product = categoryProducts
        .flatMap(cp => cp.products)
        .find(p => p.id === productId);
      
      if (!product) {
        smartToast.frontend.error('المنتج غير موجود');
        return;
      }
      
      const productPrice = product.price;
      const productImage = product.mainImage;
      
      if (!product.isAvailable) {
        smartToast.frontend.error('الكمية المطلوبة غير متوفرة في المخزون');
        return;
      }
      
      console.log('🛒 [App] Adding to cart:', { productId, productName, quantity, productPrice, productImage });
      
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      smartToast.frontend.error('فشل في إضافة المنتج للسلة');
    }
  };

  

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const allProducts = useMemo(() => {
    return categoryProducts.flatMap(cp => cp.products);
  }, [categoryProducts]);

  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 8);
  }, [allProducts]);

 

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800">{t('common.errors.general')}</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchCategoryProducts}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {t('common.errors.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
<div className={`min-h-screen w-full bg-[#16161B] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} dir={isRTL ? 'rtl' : 'ltr'}>      
      {/* Navbar moved to main layout to avoid duplication */}
      
      {/* Main Content */}
      <div id="main-content" className="pt-0">
        {/* Hero Section */}
        <section data-section="hero">
          <HeroSection />
        </section>

        {/* Why Choose Us Section */}
        <section data-section="services">
          <AboutUsSection />
        </section>
 

        {/* Categories Section */}
        <section data-section="categories">
          <CategoriesSection 
            loading={loading}
            categoryProducts={categoryProducts}
          />
        </section>
        {/* Project Journey & Achievements */}
        <section data-section="journey-achievements">
          <ProjectJourneyAchievements />
        </section>
         <section data-section="testimonials">
          <TestimonialsSection />
        </section>
         {/* Clients Section */}
     
       

    
     
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
      
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />
   
    </div>
  );
}

export default App;