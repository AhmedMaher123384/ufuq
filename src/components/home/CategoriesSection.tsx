import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createServiceSlug } from '../../utils/slugify';
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

interface CategoryProducts {
  category: Category;
  products: any[];
}

interface CategoriesSectionProps {
  categoryProducts: CategoryProducts[];
  loading: boolean;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categoryProducts, loading }) => {
  const { t, i18n } = useTranslation();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getText = useCallback((item: any, field: string) => {
    const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
    const key = `${field}_${lang}`;

    const val = item[key];
    if (typeof val === 'string' && val.trim()) return val;

    const fallback = item[field];
    if (typeof fallback === 'string' && fallback.trim()) return fallback;

    const alt = item[`${field}_${lang === 'ar' ? 'en' : 'ar'}`];
    return typeof alt === 'string' ? alt.trim() : '';
  }, [i18n.language]);

  const createCategoryLink = (category: any) => {
    const englishName =
      category.name_en?.trim() ||
      category.name?.trim() ||
      'service';

    return `/service/${createServiceSlug(englishName)}`;
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#16161B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-12 w-48 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
            <div className="h-6 w-72 bg-white/5 rounded-lg mx-auto mt-4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/10"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      className="py-24 md:py-32 bg-[#16161B]"
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span
              style={{
                background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('home.categories.title')}
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {categoryProducts.map((item) => {
            const name = getText(item.category, 'name');
            const description = getText(item.category, 'description');
            const link = createCategoryLink(item.category);
            const isHovered = hoveredId === item.category.id;

            return (
              <Link
                key={item.category.id}
                to={link}
                aria-label={name}
                className="group relative block rounded-2xl transition-all duration-500 transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredId(item.category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden h-full transition-all duration-300 group-hover:border-green-500/50 group-hover:bg-white/10 group-hover:shadow-2xl group-hover:shadow-green-500/20">
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {item.category.image ? (
                      <>
                        <img
                          src={buildImageUrl(item.category.image)}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/fallback.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/20 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                        <span className="text-white/30 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-green-400 transition-colors duration-300">
                      {name}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3 group-hover:text-white/70 transition-colors duration-300">
                      {description || t('categories.default_description')}
                    </p>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"></div>
                  
                  {/* Border glow */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-500 pointer-events-none ${isHovered ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' : ''}`}></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA BUTTON */}
        <div className="mt-16 flex justify-center">
          <div className="hero-btn-wrapper">
            <span className="hero-btn-inner-bg" />

            <a
              href="https://wa.me/966535166370"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn services-btn cta-dark"
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              جاهز تطور عملك بخدماتنا؟
              <svg className="hero-btn-arrow" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="#c0c0c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

          </div>
        </div>

        <div className="mt-20"></div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cta-dark {
          padding: 12px 26px;
          font-size: 14px;
          gap: 10px;
        }

        @media (max-width: 767px) {
          .cta-dark {
            padding: 10px 18px;
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;