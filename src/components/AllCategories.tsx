import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { smartToast } from '../utils/toastConfig';
import { Search, Grid, List, FolderOpen, X } from 'lucide-react';
import GlobalFooter from './layout/GlobalFooter'; // (ممكن تحذفه لو مش موجود في الصفحة الأولى)
import { createCategorySlug, createServiceSlug } from '../utils/slugify';
import { buildImageUrl } from '../config/api';
import { mockCategories } from '../mock/categories';

interface Category {
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

const AllCategories: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedAllCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedAllCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  const getLocalizedContent = (category: Category, field: 'name' | 'description') => {
    const currentLang = i18n.language;
    const arField = `${field}_ar` as keyof Category;
    const enField = `${field}_en` as keyof Category;
    
    if (currentLang === 'ar') {
      return (category[arField] as string) || category[field] || (category[enField] as string);
    } else {
      return (category[enField] as string) || category[field] || (category[arField] as string);
    }
  };

  useEffect(() => {
    // Clear localStorage to force fresh ordering
    localStorage.removeItem('cachedAllCategories');
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchTerm, sortBy]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = mockCategories;
      const filteredCategories = data.filter((category: Category) => {
        const nameLower = getLocalizedContent(category, 'name').toLowerCase();
        return !['ثيمات', 'themes'].includes(nameLower);
      });
      
      // Separate programming services from others
      const programmingServices = ['Web Development', 'E-commerce Website Development', 'Mobile App Development'];
      const programmingCategories = filteredCategories.filter(cat => 
        programmingServices.includes(cat.name) || programmingServices.includes(cat.name_en || '')
      );
      const otherCategories = filteredCategories.filter(cat => 
        !programmingServices.includes(cat.name) && !programmingServices.includes(cat.name_en || '')
      );
      
      // Combine: programming services first, then others
      const organizedCategories = [...programmingCategories, ...otherCategories];
      
      setCategories(organizedCategories);
      localStorage.setItem('cachedAllCategories', JSON.stringify(organizedCategories));
    } catch (error) {
      console.error('Error loading mock categories:', error);
      smartToast.frontend.error(t('categories.error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    let filtered = [...categories];
    if (searchTerm) {
      filtered = filtered.filter(category =>
        getLocalizedContent(category, 'name').toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocalizedContent(category, 'description').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => getLocalizedContent(a, 'name').localeCompare(getLocalizedContent(b, 'name')));
        break;
      case 'name-desc':
        filtered.sort((a, b) => getLocalizedContent(b, 'name').localeCompare(getLocalizedContent(a, 'name')));
        break;
      case 'id':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'id-desc':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      default:
        // Default sort by ID (oldest first)
        filtered.sort((a, b) => a.id - b.id);
        break;
    }
    setFilteredCategories(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);

  const CategoryCard: React.FC<{ category: Category; viewMode: 'grid' | 'list' }> = ({ category, viewMode }) => {
    const categorySlug = createServiceSlug(category.name);

    if (viewMode === 'list') {
      return (
        <Link
          to={`/service/${categorySlug}`}
          className="block bg-gradient-to-br from-[#16161B]/95 via-[#8F93A5]/5 to-[#16161B]/90 
                     rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl 
                     hover:shadow-[0_20px_50px_-10px_rgba(143,147,165,0.2)] 
                     transition-all duration-500 hover:scale-[1.02] group overflow-hidden"
          aria-label={t('common.categories.explore_category', { name: getLocalizedContent(category, 'name') })}
        >
          <div className="flex items-center p-6 gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#8F93A5]/5 to-[#16161B]/10 
                             blur-xl rounded-2xl group-hover:blur-md transition-all duration-500"></div>
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10">
                <img
                  src={buildImageUrl(category.image)}
                  alt={getLocalizedContent(category, 'name')}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/placeholder-category.svg';
                  }}
                />
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#8F93A5]/20 rounded-full 
                               flex items-center justify-center backdrop-blur-sm">
                  <FolderOpen className="w-4 h-4 text-[#8F93A5]" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-white mb-2 
                            group-hover:text-[#8F93A5] transition-colors duration-300">
                {getLocalizedContent(category, 'name')}
              </h3>
              <p className="text-[#ffffff]/85 text-base leading-relaxed line-clamp-2 whitespace-pre-line">
                {getLocalizedContent(category, 'description') || t('categories.default_description')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8F93A5]/10 to-[#16161B]/20 
                             backdrop-blur-sm border border-white/10 
                             flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#8F93A5]">
                  <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link
        to={`/service/${categorySlug}`}
        className="block bg-gradient-to-br from-[#16161B]/95 via-[#8F93A5]/5 to-[#16161B]/90 
                   rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl 
                   hover:shadow-[0_20px_50px_-10px_rgba(143,147,165,0.2)] 
                   transition-all duration-500 hover:scale-105 group overflow-hidden"
        aria-label={t('categories.explore_category', { name: getLocalizedContent(category, 'name') })}
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#8F93A5]/5 to-[#16161B]/10 
                         blur-xl rounded-2xl sm:rounded-3xl group-hover:blur-md transition-all duration-500"></div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
            <img
              src={buildImageUrl(category.image)}
              alt={getLocalizedContent(category, 'name')}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/placeholder-category.svg';
              }}
            />
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-[#8F93A5]/20 rounded-full 
                           flex items-center justify-center backdrop-blur-sm">
              <FolderOpen className="w-3 h-3 sm:w-5 sm:h-5 text-[#8F93A5]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#16161B]/80 via-transparent to-transparent 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="relative p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 
                          group-hover:text-[#8F93A5] transition-colors duration-300">
              {getLocalizedContent(category, 'name')}
            </h3>
            <p className="text-[#ffffff]/85 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-5 mb-3 sm:mb-4 whitespace-pre-line">
              {getLocalizedContent(category, 'description') || t('categories.default_description')}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[#8F93A5] text-xs sm:text-sm font-medium">{t('categories.explore_products')}</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-[#8F93A5]/10 to-[#16161B]/20 
                             backdrop-blur-sm border border-white/10 
                             flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#8F93A5]">
                  <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="min-h-screen bg-[#16161B] font-['Cairo'] relative overflow-hidden" dir="rtl">
      {/* ✅ خلفية مُنظّفة — نفس الصفحة الأولى */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, #8F93A5 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, #6c7081 0%, transparent 20%)
          `,
          backgroundSize: '800px 800px',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-[80px]">
        
        {/* العنوان — موحد مع الصفحة الأولى */}
        <div className="text-center mb-16 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span style={{
              background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {t('categories.all_categories')}{' '}
            </span>
            <span className="text-[#8F93A5]/80">{t('categories.available')}</span>
          </h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#8F93A5] to-transparent 
                         mx-auto mt-4 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-px bg-white/5 rounded-full"></div>
        </div>

        

        

        {/* Loading / Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 border-2 border-[#8F93A5]/20 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-t-2 border-[#8F93A5] rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-[#8F93A5]/80 mt-4">{t('categories.loading')}</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6' 
              : 'space-y-6'}
            w-full
          `}>
            {filteredCategories.map(category => (
              <CategoryCard key={category.id} category={category} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute -inset-4 bg-[#8F93A5]/10 blur-xl rounded-full"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-[#8F93A5]/80" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchTerm ? t('categories.no_search_results') : t('categories.no_categories')}
            </h3>
            <p className="text-[#8F93A5]/70">
              {searchTerm 
                ? t('categories.try_different_search') 
                : t('categories.no_categories_available')}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 
                          bg-gradient-to-r from-[#8F93A5]/10 to-[#8F93A5]/5 
                          text-[#8F93A5] rounded-xl border border-[#8F93A5]/20 
                          hover:bg-[#8F93A5]/20 transition-all"
              >
                <X className="w-4 h-4" />
                {t('categories.clear_search')}
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .ultra-smooth {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AllCategories;