import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildImageUrl } from '../config/api';
import { mockBlogPosts } from '../mock/blogMock';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  categories: string[];
  createdAt: string;
}

const BlogPost: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = mockBlogPosts.find(p => p.slug === slug);
      if (found) setPost(found);
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#16161b] flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">المقال غير موجود</h2>
          <Link to="/blog" className="text-gray-400 hover:text-white">← العودة للمدونة</Link>
        </div>
      </div>
    );
  }

  const imageUrl = post.featuredImage ? buildImageUrl(post.featuredImage) : '/images/default-blog.jpg';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = post ? `${siteUrl}/blog/${post.slug}` : `${siteUrl}/blog`;

  return (
    <>
      <Helmet>
        <title>{post.title} | المدونة</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={canonical} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={imageUrl} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={imageUrl} />

        {/* JSON-LD: BlogPosting */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
            headline: post.title,
            image: imageUrl,
            datePublished: post.createdAt,
            author: { '@type': 'Person', name: post.author },
            publisher: {
              '@type': 'Organization',
              name: 'أفق الرقمية',
              logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
            },
            description: post.excerpt || post.title,
          })}
        </script>
      </Helmet>

      <article 
        className={`min-h-screen bg-[#16161b] pt-20 pb-32 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-5 sm:px-8 max-w-4xl">

          {/* العنوان صغير وأنيق جدًا */}
          <header className="text-center mb-12">
            <h1 className="text-m sm:text-m md:text-m font-bold leading-snug">
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
                {post.title}
              </span>
            </h1>
          </header>

          {/* الصورة البارزة */}
          {post.featuredImage && (
            <div className="mb-12 -mx-5 sm:mx-0">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-32 sm:h-20 md:h-48 object-cover rounded-2xl shadow-xl"
                loading="lazy"
              />
            </div>
          )}

          {/* معلومات المقال */}
          <div className="flex flex-wrap justify-center items-center gap-5 text-sm text-gray-500 mb-10 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-gray-400">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.categories.map(cat => (
                <span key={cat} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-xs flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* الملخص */}
          {post.excerpt && (
            <div className="bg-[#1f1f24] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-12 text-gray-300 leading-relaxed">
              <p className="text-gray-400 font-medium mb-3">ملخص المقال:</p>
              <p className="text-base sm:text-lg">{post.excerpt}</p>
            </div>
          )}

          {/* المحتوى */}
          <div 
            className="prose prose-invert prose-lg max-w-none text-gray-300 leading-8 space-y-7 text-justify"
            dangerouslySetInnerHTML={{ __html: post.content || 'المحتوى غير متوفر حاليًا.' }}
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s ease-out 0.4s'
            }}
          />

          {/* الأزرار في الأسفل */}
          <div className="mt-20 pt-10 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <Share2 className="w-5 h-5" />
              مشاركة المقال
            </button>

            <Link
              to="/blog"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group text-sm sm:text-base"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
              العودة إلى المدونة
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .prose h2 { font-size: 1.75rem; margin: 2rem 0 1rem; color: #fff; }
          .prose h3 { font-size: 1.5rem; margin: 1.8rem 0 0.8rem; color: #e0e0e0; }
          .prose p  { margin-bottom: 1.4rem; }
          .prose ul, .prose ol { padding-right: 1.5rem; margin-bottom: 1.5rem; }
        `}</style>
      </article>
    </>
  );
};

export default BlogPost;