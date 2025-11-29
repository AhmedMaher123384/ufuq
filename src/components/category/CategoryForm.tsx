import React, { useState } from 'react';
import { smartToast } from '../../utils/toastConfig';

interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  image?: string;
}

interface CategoryFormProps {
  category: Category | null;
  isRTL?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, isRTL = true }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [bestTime, setBestTime] = useState('');
  const [loading, setLoading] = useState(false);

  const dir = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'text-right' : 'text-left';

  const categoryName = (() => {
    if (!category) return '';
    if (isRTL && category.name_ar) return category.name_ar;
    if (!isRTL && category.name_en) return category.name_en;
    return category.name;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) {
      smartToast.frontend.error('من فضلك أكمل الحقول المطلوبة');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        categoryId: category?.id ?? null,
        categoryName,
        name,
        email,
        phone,
        title,
        details,
        budget,
        timeframe,
        contactMethod,
        bestTime,
      };
      // هنا يمكن ربط API لاحقاً، حالياً سنعرض رسالة نجاح
      await new Promise((res) => setTimeout(res, 800));
      smartToast.frontend.success('تم إرسال الطلب بنجاح');
      setName('');
      setEmail('');
      setPhone('');
      setTitle('');
      setDetails('');
      setBudget('');
      setTimeframe('');
      setContactMethod('whatsapp');
      setBestTime('');
    } catch (err) {
      smartToast.frontend.error('حدث خطأ أثناء الإرسال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form dir={dir} onSubmit={handleSubmit} className={`space-y-6 ${align}`}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          طلب خدمة{categoryName ? ` ضمن: ${categoryName}` : ''}
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">املأ البيانات التالية لنحدد احتياجك بدقة.</p>
      </div>

      {/* Section 1: معلومات التواصل */}
      <div className="bg-gradient-to-br from-[#16161B]/95 via-[#7a7a7a]/15 to-[#16161B]/90 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">معلومات التواصل</h3>
          <span className="text-xs text-gray-400">الحقول المطلوبة: الاسم، الهاتف</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك هنا"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 0590000000"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            />
          </div>
        </div>
      </div>

      {/* Section 2: تفاصيل الطلب */}
      <div className="bg-gradient-to-br from-[#16161B]/95 via-[#7a7a7a]/15 to-[#16161B]/90 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">تفاصيل الطلب</h3>
          <span className="text-xs text-gray-400">الحقول المطلوبة: التفاصيل</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">عنوان مختصر</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان مختصر للطلب"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">الميزانية المتوقعة</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            >
              <option value="">اختر نطاق الميزانية</option>
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">مرتفعة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">الإطار الزمني</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            >
              <option value="">اختر مدة التنفيذ</option>
              <option value="urgent">عاجل</option>
              <option value="two-weeks">أسبوعان</option>
              <option value="one-month">شهر</option>
              <option value="flexible">مرن</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">التفاصيل</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اشرح لنا متطلباتك بالتفصيل"
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: التفضيلات والإرسال */}
      <div className="bg-gradient-to-br from-[#16161B]/95 via-[#7a7a7a]/15 to-[#16161B]/90 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">التفضيلات والإرسال</h3>
          <span className="text-xs text-gray-400">اختر طريقة التواصل والوقت الأنسب</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">طريقة التواصل المفضلة</label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            >
              <option value="whatsapp">واتساب</option>
              <option value="call">مكالمة</option>
              <option value="email">بريد إلكتروني</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">أفضل وقت للتواصل</label>
            <input
              type="text"
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
              placeholder="مثال: صباحاً، مساءً، 4-6 مساءً"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#7a7a7a]/20 to-[#4a4a4a]/20 text-white border border-[#7a7a7a]/40 focus:ring-2 focus:ring-[#7a7a7a] focus:border-[#7a7a7a]"
            />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7a7a7a] to-[#4a4a4a] text-white border border-white/10 shadow hover:opacity-90 transition"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
            {categoryName && (
              <span className="text-xs text-gray-400">ستتم معالجة الطلب ضمن: {categoryName}</span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;