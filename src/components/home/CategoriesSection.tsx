import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createServiceSlug } from '../../utils/slugify';
import { ArrowUpRight, ArrowUpLeft, Monitor, Smartphone, TrendingUp, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildImageUrl } from '../../config/api';

interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  image: string;
}

interface Product { 
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  categoryId: number | null;
  mainImage: string;
  detailedImages?: string[];
  productType?: string;
  createdAt?: string;
}

interface CategoryProducts {
  category: Category;
  products: Product[];
}

interface CategoriesSectionProps {
  categoryProducts: CategoryProducts[];
  loading: boolean;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&display=swap');

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .animate-fadeInUp { animation: fadeInUp 0.7s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .ultra-smooth { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .gpu { transform: translateZ(0); backface-visibility: hidden; }

  /* عنصر الفئة */
  .service-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: visible;
    transition: all 0.3s ease;
  }

  .service-item:last-child {
    border-bottom: none;
  }

  /* الرقم التسلسلي */
  .service-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    margin-right: 3rem;
    min-width: 2.5rem;
    text-align: right;
  }

  .service-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: white;
    flex-grow: 1;
    margin: 0;
    line-height: 1.2;
  }

  /* زر السهم */
  .service-icon-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
    cursor: pointer;
    background: transparent;
  }

  /* عند hover - بس على Desktop */
  @media (min-width: 769px) {
    .service-item:hover .service-icon-btn {
      background: #8F93A5;
      border-color: #8F93A5;
      transform: scale(1.1);
      color: white;
    }

    .service-item:hover .service-icon-btn svg {
      color: inherit;
    }

    .service-item:hover .service-image-container {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(15deg) scale(1.05);
    }
  }

  /* الصورة في المنتصف */
  .service-image-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 10;
    pointer-events: none;
    width: 140px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .service-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: auto;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
    background: rgba(143, 147, 165, 0.08);
  }

  .service-image-placeholder {
    width: 180px;
    height: 130px;
    background: linear-gradient(45deg, #8F93A5/10, #16161B/20);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8F93A5;
    font-size: 2rem;
  }

  /* 📱 Mobile Styles */
  @media (max-width: 768px) {
    .service-item {
      padding: 1.5rem 0;
    }

    .service-number {
      font-size: 0.9rem;
      margin-right: 1rem;
      min-width: 1.5rem;
    }

    .service-title {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .service-icon-btn {
      width: 36px;
      height: 36px;
    }

    .service-icon-btn svg {
      width: 16px;
      height: 16px;
    }

    /* الصورة تظهر دايماً على الموبايل */
    .service-image-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1 !important;
      width: 100px;
      height: 70px;
      pointer-events: none;
    }

    .service-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    .service-image-placeholder {
      width: 100px;
      height: 70px;
      font-size: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categoryProducts, loading }) => {
  const { t, i18n } = useTranslation();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const icons = [Monitor, Smartphone, TrendingUp, PenTool];
  const getIcon = (i: number) => icons[i % 4] || Monitor;

  const getText = (item: any, field: string) => {
    const lang = i18n.language;
    const key = `${field}_${lang}`;
    if (item[key]?.trim()) return item[key];
    if (item[field]?.trim()) return item[field];
    return item[`${field}_${lang === 'ar' ? 'en' : 'ar'}`]?.trim() || '';
  };

  const slug = (name: string, id: number) =>
    name.replace(/\s+/g, '-').replace(/[^\w\-أ-ي]/g, '').toLowerCase() + `-${id}`;

  const createCategoryLink = (category: any) => {
    return `/service/${createServiceSlug(category.name_en || category.name)}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeInUp');
              entry.target.classList.remove('opacity-0');
            }, i * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    refs.current.forEach(el => el && observer.observe(el));
    return () => refs.current.forEach(el => el && observer.unobserve(el));
  }, [categoryProducts]);

  if (loading) {
    return (
      <section className="py-16 bg-[#16161B] font-['Cairo']" id="next-section" data-section="categories">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-12">
          <div className="h-8 bg-[#1f1f1f]/60 rounded w-48 mx-auto"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 opacity-0" style={{ animation: 'fadeInUp 0.6s forwards', animationDelay: `${i * 150}ms` }}>
              <div className="h-6 bg-[#8F93A5]/20 rounded w-36 mx-auto"></div>
              <div className="h-4 bg-[#1f1f1f]/50 rounded w-full"></div>
              <div className="h-4 bg-[#1f1f1f]/50 rounded w-5/6 mx-auto"></div>
              <div className="h-32 bg-[#1f1f1f]/40 rounded-xl mx-auto w-48"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <section className="py-16 md:py-24 bg-[#16161B] font-['Cairo'] overflow-hidden" id="next-section" data-section="categories">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="mb-16 text-center">
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
                {t('home.categories.title')}
              </span>
            </h2>
            <p className="text-base md:text-lg text-[#ffffff]/70 mt-4 max-w-xl mx-auto">
              {t('home.categories.subtitle')}
            </p>
          </div>

          {/* Services List */}
          <div className="space-y-0">
            {categoryProducts.map((item, i) => {
              const name = getText(item.category, 'name');
              const link = createCategoryLink(item.category);
              const Icon = getIcon(i);
              const ArrowIcon = i18n.language === 'ar' ? ArrowUpLeft : ArrowUpRight;

              return (
                <div
                  key={item.category.id}
                  ref={el => refs.current[i] = el}
                  className="opacity-0 gpu service-item group"
                >
                  {/* الرقم التسلسلي */}
                  <div className="service-number">{String(i + 1).padStart(2, '0')}.</div>

                  {/* اسم الخدمة */}
                  <Link to={link} className="flex-grow">
                    <h3 className="service-title">{name}</h3>
                  </Link>

                  {/* زر السهم */}
                  <Link to={link} className="service-icon-btn">
                    <ArrowIcon className="w-5 h-5" />
                  </Link>

                  {/* الصورة في المنتصف */}
                  <div className="service-image-container">
                    {item.category.image ? (
                      <img
                        src={buildImageUrl(item.category.image)}
                        alt={name}
                        className="service-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="service-image-placeholder">
                        <Icon className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesSection;