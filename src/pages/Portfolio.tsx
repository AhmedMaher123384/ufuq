import React, { useState, useEffect } from 'react';
import { ExternalLink, Tag, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildImageUrl } from '../config/api';
import portfolio from '../assets/portfolio.webp';
import { mockPortfolios, mockPortfolioCategories } from '../mock/portfolioMock';

const PRIMARY = '#8F93A5';
const SECONDARY = '#6c7081';

const Portfolio: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [portfolios] = useState(mockPortfolios);
  const [categories] = useState(mockPortfolioCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const filteredPortfolios = portfolios.filter(p => 
    selectedCategory === null || p.categoryId === selectedCategory
  );

  return (
    <div 
      className={`min-h-screen bg-[#16161b] pt-20 transition-all duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Hero Section – هادي وأنيق */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-8">
          <span
            style={{
              background: `linear-gradient(90deg, ${PRIMARY} 0%, ${SECONDARY} 50%, ${PRIMARY} 100%)`,
              backgroundSize: '200% auto',
              animation: 'shimmer 4s linear infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } as React.CSSProperties}
          >
            معرض الأعمال
          </span>
        </h1>
       

     
      </div>

      {/* الفلاتر */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-8 py-4 rounded-full font-medium transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white shadow-lg'
                : 'bg-[#1f1f24] text-gray-400 border border-gray-800 hover:border-gray-600'
            }`}
          >
            جميع المشاريع
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-8 py-4 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white shadow-lg'
                  : 'bg-[#1f1f24] text-gray-400 border border-gray-800 hover:border-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* المشاريع – ظهور ناعم فقط */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="space-y-32">
          {filteredPortfolios.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={project.id}
                className={`flex flex-col md:flex-row items-center gap-16 ${
                  isEven ? '' : 'md:flex-row-reverse'
                } transition-all duration-1000 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* الصورة */}
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-2xl group">
                    {project.projectUrl ? (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={buildImageUrl(project.mainImage)}
                          alt={project.title}
                          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ExternalLink className="w-12 h-12 text-white" />
                        </div>
                      </a>
                    ) : (
                      <img
                        src={buildImageUrl(project.mainImage)}
                        alt={project.title}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    )}
                    {project.category && (
                      <span 
                        className="absolute top-6 left-6 px-5 py-2 rounded-full text-sm font-medium text-white shadow2"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})` }}
                      >
                        <Tag className="w-4 h-4 inline mr-2" />
                        {project.category.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* المحتوى */}
                <div className="w-full md:w-1/2 text-center md:text-right">
                  <h3 className="text-4xl font-bold text-white mb-6">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shimmer Animation */}
      <style >{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;