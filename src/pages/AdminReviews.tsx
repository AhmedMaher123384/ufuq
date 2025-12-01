import React, { useEffect, useMemo, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { smartToast } from '../utils/toastConfig';
import { mockCategories } from '../mock/categories';

interface Review {
  id: string;
  name: string;
  opinion: string;
  createdAt: string;
  rating?: number;
  link?: string;
}

const REVIEWS_KEY_PREFIX = 'reviews_category_';

const AdminReviews: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [reviewsByCat, setReviewsByCat] = useState<Record<number, Review[]>>({});
  const [editing, setEditing] = useState<{ catId: number; reviewId: string; name: string; opinion: string; rating?: number; link?: string } | null>(null);
  const [adding, setAdding] = useState<{ catId: number | null; name: string; opinion: string; rating: number; link: string }>({
    catId: null,
    name: '',
    opinion: '',
    rating: 0,
    link: '',
  });

  const getCategoryName = (cat: any) => {
    const lang = i18n.language;
    const field = `name_${lang}`;
    if (cat[field] && cat[field].trim()) return cat[field];
    if (cat.name && (typeof cat.name !== 'string' || cat.name.trim())) return cat.name;
    const other = lang === 'ar' ? 'en' : 'ar';
    const otherField = `name_${other}`;
    return cat[otherField] || cat.name || '';
  };

  const normalizeUrl = (url: string) => {
    const trimmed = (url || '').trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  useEffect(() => {
    const map: Record<number, Review[]> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith(REVIEWS_KEY_PREFIX)) {
        const idStr = key.replace(REVIEWS_KEY_PREFIX, '');
        const catId = parseInt(idStr, 10);
        try {
          const raw = localStorage.getItem(key) || '[]';
          const arr = JSON.parse(raw);
          map[catId] = Array.isArray(arr) ? arr : [];
        } catch {
          map[catId] = [];
        }
      }
    }
    setReviewsByCat(map);
  }, []);

  const categoriesById = useMemo(() => {
    const dict: Record<number, any> = {};
    mockCategories.forEach((c: any) => { dict[c.id] = c; });
    return dict;
  }, []);

  const handleDelete = (catId: number, reviewId: string) => {
    const current = reviewsByCat[catId] || [];
    const updated = current.filter(r => r.id !== reviewId);
    const updatedMap = { ...reviewsByCat, [catId]: updated };
    setReviewsByCat(updatedMap);
    localStorage.setItem(`${REVIEWS_KEY_PREFIX}${catId}`, JSON.stringify(updated));
    smartToast.frontend.success(isRTL ? 'تم حذف التعليق' : 'Comment deleted');
  };

  const startEdit = (catId: number, review: Review) => {
    setEditing({ catId, reviewId: review.id, name: review.name, opinion: review.opinion, rating: review.rating ?? 0, link: review.link || '' });
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = () => {
    if (!editing) return;
    const { catId, reviewId, name, opinion, rating, link } = editing;
    const linkNormalized = (link && link.trim()) ? normalizeUrl(link) : undefined;
    const current = reviewsByCat[catId] || [];
    const updated = current.map((r) => (r.id === reviewId ? { ...r, name, opinion, rating, link: linkNormalized } : r));
    const updatedMap = { ...reviewsByCat, [catId]: updated };
    setReviewsByCat(updatedMap);
    localStorage.setItem(`${REVIEWS_KEY_PREFIX}${catId}`, JSON.stringify(updated));
    smartToast.frontend.success(isRTL ? 'تم تعديل التعليق' : 'Comment updated');
    setEditing(null);
  };

  const handleAddReview = () => {
    const { catId, name, opinion, rating, link } = adding;
    if (!catId) {
      smartToast.frontend.error(isRTL ? 'من فضلك اختر تصنيف' : 'Please select a category');
      return;
    }
    if (!name.trim() || !opinion.trim()) {
      smartToast.frontend.error(isRTL ? 'الاسم والرأي مطلوبان' : 'Name and opinion are required');
      return;
    }
    const id = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
      ? (globalThis.crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const newItem: Review = {
      id,
      name: name.trim(),
      opinion: opinion.trim(),
      createdAt: new Date().toISOString(),
      rating: rating || 0,
    };
    if (link && link.trim()) newItem.link = normalizeUrl(link);
    const current = reviewsByCat[catId] || [];
    const updated = [newItem, ...current];
    setReviewsByCat({ ...reviewsByCat, [catId]: updated });
    localStorage.setItem(`${REVIEWS_KEY_PREFIX}${catId}`, JSON.stringify(updated));
    smartToast.frontend.success(isRTL ? 'تم إضافة المراجعة' : 'Review added');
    setAdding({ catId, name: '', opinion: '', rating: 0, link: '' });
  };

  const hasAny = Object.values(reviewsByCat).some(arr => (arr || []).length > 0);

  return (
    <section className="min-h-screen bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-900 font-['Cairo']" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] leading-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border border-emerald-500/40 shadow-sm"
          >
            {isRTL ? 'Back to Dashboard ' : 'Back to Dashboard'}
          </Link>
        </div>
        <div className="bg-emerald-900/20 backdrop-blur-xl rounded-2xl border border-emerald-800/30 shadow-xl p-6 sm:p-8 text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {isRTL ? 'Reviews Management' : 'Reviews Management'}
          </h1>
          <div className="mt-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'التصنيف' : 'Category'}</label>
                <select
                  value={adding.catId ?? ''}
                  onChange={(e) => setAdding((prev) => ({ ...prev, catId: e.target.value ? parseInt(e.target.value, 10) : null }))}
                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">{isRTL ? 'اختر تصنيفًا' : 'Select category'}</option>
                  {mockCategories.map((c: any) => (
                    <option key={c.id} value={c.id}>{getCategoryName(c)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'الاسم' : 'Name'}</label>
                <input
                  type="text"
                  value={adding.name}
                  onChange={(e) => setAdding((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder={isRTL ? 'اسم المراجع' : 'Reviewer name'}
                />
              </div>
              <div>
                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'الرابط' : 'Link'}</label>
                <input
                  type="text"
                  value={adding.link}
                  onChange={(e) => setAdding((prev) => ({ ...prev, link: e.target.value }))}
                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder={isRTL ? 'رابط (اختياري)' : 'Link (optional)'}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'الرأي' : 'Opinion'}</label>
                <textarea
                  value={adding.opinion}
                  onChange={(e) => setAdding((prev) => ({ ...prev, opinion: e.target.value }))}
                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[80px]"
                  placeholder={isRTL ? 'اكتب رأيك' : 'Write opinion'}
                />
              </div>
              <div>
                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'التقييم' : 'Rating'}</label>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAdding((prev) => ({ ...prev, rating: val }))}
                        className="p-1"
                        aria-label={`${val} ${isRTL ? 'نجوم' : 'stars'}`}
                      >
                        <Star
                          className={`w-5 h-5 ${((adding.rating ?? 0) >= val) ? 'text-yellow-400' : 'text-white/30'}`}
                          fill={((adding.rating ?? 0) >= val) ? 'currentColor' : 'none'}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                <button
                  onClick={handleAddReview}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm border border-emerald-500/40"
                >
                  {isRTL ? 'إضافة المراجعة' : 'Add Review'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {!hasAny ? (
          <div className="bg-emerald-900/20 backdrop-blur-xl rounded-2xl border border-emerald-800/30 shadow-xl p-6 text-center">
            <p className="text-white/80">{isRTL ? 'لا توجد تعليقات بعد.' : 'No reviews yet.'}</p>
          </div>
        ) : (
          Object.entries(reviewsByCat).map(([catIdStr, items]) => {
            const catId = parseInt(catIdStr, 10);
            const cat = categoriesById[catId];
            if (!items || items.length === 0) return null;
            return (
              <div key={catId} className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    <span className="text-emerald-300">{isRTL ? 'تصنيف:' : 'Category:'} </span>
                    {cat ? getCategoryName(cat) : catId}
                  </h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {items.map((r) => {
                    const isEditing = !!editing && editing.catId === catId && editing.reviewId === r.id;
                    return (
                      <div key={r.id} className="bg-emerald-950/30 rounded-xl border border-emerald-800/30 p-3 sm:p-4 backdrop-blur-xl">
                        {!isEditing ? (
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-semibold">{r.name}</span>
                                <span className="text-white/50 text-xs">{new Date(r.createdAt).toLocaleString(i18n.language)}</span>
                              </div>
                              {typeof r.rating === 'number' && r.rating > 0 && (
                                <div className="mt-1 flex items-center gap-0.5" aria-label={`${isRTL ? 'تقييم' : 'Rating'} ${r.rating}`}>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < (r.rating || 0) ? 'text-yellow-400' : 'text-white/20'}`}
                                      fill={i < (r.rating || 0) ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                              )}
                              <p className="text-white/80 mt-2">{r.opinion}</p>
                              {r.link && (
                                <a
                                  href={normalizeUrl(r.link)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-all duration-300 text-xs border border-emerald-800/30 mt-2"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {isRTL ? 'فتح الرابط' : 'Open link'}
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => startEdit(catId, r)}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all duration-300 font-bold text-xs sm:text-sm border border-emerald-800/30"
                              >
                                {isRTL ? 'تعديل' : 'Edit'}
                              </button>
                              <button
                                onClick={() => handleDelete(catId, r.id)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/80 to-red-500/80 text-white px-3 py-2 rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-bold text-xs sm:text-sm border border-emerald-800/30"
                              >
                                {isRTL ? 'حذف' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/70 text-xs">{new Date(r.createdAt).toLocaleString(i18n.language)}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'الاسم' : 'Name'}</label>
                                <input
                                  type="text"
                                  value={editing?.name || ''}
                                  onChange={(e) => setEditing((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                  placeholder={isRTL ? 'اسم المراجع' : 'Reviewer name'}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'الرأي' : 'Opinion'}</label>
                                <textarea
                                  value={editing?.opinion || ''}
                                  onChange={(e) => setEditing((prev) => prev ? { ...prev, opinion: e.target.value } : prev)}
                                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[80px]"
                                  placeholder={isRTL ? 'اكتب رأيك' : 'Write opinion'}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'التقييم' : 'Rating'}</label>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => {
                                    const val = i + 1;
                                    return (
                                      <button
                                        key={val}
                                        type="button"
                                        onClick={() => setEditing((prev) => prev ? { ...prev, rating: val } : prev)}
                                        className="p-1"
                                        aria-label={`${val} ${isRTL ? 'نجوم' : 'stars'}`}
                                      >
                                        <Star
                                          className={`w-5 h-5 ${((editing?.rating ?? 0) >= val) ? 'text-yellow-400' : 'text-white/30'}`}
                                          fill={((editing?.rating ?? 0) >= val) ? 'currentColor' : 'none'}
                                        />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-white/80 mb-1">{isRTL ? 'الرابط' : 'Link'}</label>
                                <input
                                  type="text"
                                  value={editing?.link || ''}
                                  onChange={(e) => setEditing((prev) => prev ? { ...prev, link: e.target.value } : prev)}
                                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                  placeholder={isRTL ? 'رابط (اختياري)' : 'Link (optional)'}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm border border-emerald-500/40"
                              >
                                {isRTL ? 'حفظ' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm border border-emerald-800/30"
                              >
                                {isRTL ? 'إلغاء' : 'Cancel'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AdminReviews;