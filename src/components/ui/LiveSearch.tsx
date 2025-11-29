import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, FolderOpen } from 'lucide-react';
import { buildImageUrl } from '../../config/api';
import { mockCategories } from '../../mock/categories';
import { createCategorySlug, createServiceSlug } from '../../utils/slugify';
import { useTranslation } from 'react-i18next';



// إضافة نوع الفئة لنتائج البحث
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

interface LiveSearchProps {
  onClose?: () => void;
  className?: string;
}

const LiveSearch: React.FC<LiveSearchProps> = ({ onClose, className = '' }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryResults, setCategoryResults] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // تحميل الخدمات عند بدء التطبيق
  useEffect(() => {
    loadCategories();
  }, []);



  // تحميل الخدمات من البيانات المحلية
  const loadCategories = async () => {
    try {
      const availableCategories = mockCategories.filter((cat: any) => cat.name || cat.name_ar);
      setAllCategories(availableCategories as any);
      // تحديث الكاش بقيم الموك (اختياري)، بدون الاعتماد عليه في القراءة
      localStorage.setItem('searchCategories', JSON.stringify(availableCategories));
    } catch (error) {
      console.error('LiveSearch categories load error:', error);
    }
  };

  // مساعد للحصول على النص حسب اللغة الحالية
  const getLocalizedContent = (item: any, field: 'name' | 'description'): string => {
    const lang = i18n.language;
    const ar = item[`${field}_ar`];
    const en = item[`${field}_en`];
    const base = item[field];
    if (lang === 'ar') return (ar || base || en || '').toString();
    return (en || base || ar || '').toString();
  };

  // البحث المحلي 
  const performSearch = (query: string) => {
    if (!query || query.trim().length < 2) {
      setCategoryResults([]);
      return;
    }

    const searchTerm = query.trim().toLowerCase();
    
    // نتائج الخدمات فقط
    const catNameMatches = allCategories.filter((cat: any) =>
      getLocalizedContent(cat, 'name').toLowerCase().includes(searchTerm)
    );

    const catDescMatches = allCategories.filter((cat: any) =>
      !catNameMatches.includes(cat) &&
      getLocalizedContent(cat, 'description').toLowerCase().includes(searchTerm)
    );

    const combinedCategoryResults = [...catNameMatches, ...catDescMatches];
    setCategoryResults(combinedCategoryResults.slice(0, 8));
  };

  // التعامل مع تغيير النص
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value);
    setIsOpen(value.length > 0);
  };

  // إغلاق البحث
  const handleClose = () => {
    setSearchQuery('');
    setCategoryResults([]);
    setIsOpen(false);
    onClose?.();
  };



  // الانتقال إلى صفحة الفئة
  const handleCategoryClick = (category: Category) => {
    const slug = createServiceSlug(category.name);
    navigate(`/service/${slug}`);
    handleClose();
  };



  // إغلاق عند الضغط خارج المكون أو الضغط على Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
      >
        <Search size={20} />
        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div ref={searchRef} className="w-full max-w-2xl mx-4" dir={i18n.language.startsWith('ar') ? 'rtl' : 'ltr'}>
            {/* Search Input */}
            <div className="relative mb-4">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={t('search_placeholder', 'البحث عن الخدمات...')}
                className="w-full px-6 py-4 pl-14 pr-12 text-white placeholder-white/70 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 shadow-lg text-lg text-right"
                autoFocus
              />
              <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
              <button
                onClick={handleClose}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* نتائج البحث المحسنة - Updated with glassmorphism */}
            {searchQuery.length >= 2 && (
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-top-2 duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: `
                    0 20px 60px rgba(0,0,0,0.3),
                    inset 1px 1px 1px rgba(255,255,255,0.1),
                    inset 0 1px 1px rgba(255,255,255,0.05)
                  `
                }}
              >
                 {(categoryResults.length > 0) ? (
                  <>
                     {/* قسم الخدمات */}
                     {categoryResults.length > 0 && (
                       <div className="border-b border-white/10">
                         <div className="px-4 py-2 text-xs text-white/70 flex items-center justify-between">
                           <span className="font-semibold">{t('live_search.categories', 'الخدمات')}</span>
                           <FolderOpen size={16} className="text-white/50" />
                         </div>
                         <div className="max-h-40 overflow-y-auto custom-scrollbar">
                           {categoryResults.map((cat, idx) => (
                             <button
                               key={cat.id}
                               onClick={() => handleCategoryClick(cat)}
                               className="w-full p-3 hover:bg-white/10 transition-all duration-300 border-t border-white/10 text-right group/item"
                               style={{
                                 animationDelay: `${idx * 50}ms`,
                                 animation: 'slideInUp 0.4s ease-out forwards'
                               }}
                             >
                               <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 group-hover/item:scale-105 transition-transform duration-300 border border-white/20">
                                   {cat.image ? (
                                     <img
                                       src={buildImageUrl(cat.image)}
                                       alt={getLocalizedContent(cat, 'name')}
                                       className="w-full h-full object-cover"
                                     />
                                   ) : (
                                     <div className="w-full h-full flex items-center justify-center">
                                       <FolderOpen size={20} className="text-white/40" />
                                     </div>
                                   )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <h4 className="font-semibold text-white truncate text-right mb-1 group-hover/item:text-white/90 transition-colors duration-200 text-sm">
                                     {getLocalizedContent(cat, 'name')}
                                   </h4>
                                   <p className="text-xs text-white/60 truncate text-right mb-1">
                                     {getLocalizedContent(cat, 'description')}
                                   </p>
                                 </div>
                                 <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:translate-x-1">
                                   <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                     <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                     </svg>
                                   </div>
                                 </div>
                               </div>
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="p-6 text-center">
                     <h3 className="text-sm font-semibold text-white mb-1">{t('live_search.no_results', 'لا توجد نتائج')}</h3>
                     <p className="text-xs text-white/60">{t('live_search.no_products_found', 'لم يتم العثور على منتجات')}</p>
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
       )}
       
       {/* إضافة الستايلات المخصصة */}
       <style>{`
         .custom-scrollbar::-webkit-scrollbar {
           width: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
           background: rgba(255,255,255,0.05);
           border-radius: 2px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(255,255,255,0.2);
           border-radius: 2px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: rgba(255,255,255,0.3);
         }
         
         @keyframes slideInUp {
           from {
             opacity: 0;
             transform: translateY(8px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
       `}</style>
     </>
   );
};

export default LiveSearch;