import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildImageUrl } from '../config/api';
import { mockBlogPosts } from '../mock/blogMock';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  categories: string[];
  createdAt: string;
}

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [posts] = useState<BlogPost[]>(mockBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  const mainCategories = ['all', 'تصميم', 'تطوير', 'تسويق رقمي', 'تجارة إلكترونية'];

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.categories.includes(selectedCategory);
    const matchesSearch = !searchTerm || 
      post.title.includes(searchTerm) || 
      post.excerpt.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      className={`min-h-screen bg-[#16161b] pt-24 pb-32 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-5 sm:px-8 max-w-7xl">

        {/* العنوان */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black">
            <span
              style={{
                background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              المدونة
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-500 font-light">
            مقالات تقنية حديثة ومفيدة
          </p>
        </div>

        {/* السيرش + الكاتيجوريز في سطر واحد */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-[#1f1f24] border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 text-base sm:text-lg"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {mainCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white shadow-md'
                      : 'bg-[#1f1f24] text-gray-400 border border-gray-800 hover:text-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'جميع المقالات' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* الكروت الصغيرة والمريحة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group block bg-[#1f1f24] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-400 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 80}ms`,
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)',
              }}
            >
              <div className="h-40 sm:h-48 bg-gray-900 overflow-hidden">
                <img
                  src={buildImageUrl(post.featuredImage) || '/images/default-blog.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.slice(0, 2).map(cat => (
                    <span key={cat} className="text-xs px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-300 transition">
                  {post.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* لا توجد نتائج */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-2xl text-gray-600 font-light">لا توجد مقالات تطابق بحثك</p>
            <p className="text-gray-500 mt-2">جرب كلمة أخرى أو اختر فئة مختلفة</p>
          </div>
        )}
      </div>

      <style >{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default Blog;