import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged, User, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { formSubmissionService, FormSubmission } from '../services/formSubmissionService';
import { smartToast } from '../utils/toastConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiMail, FiUser, FiCalendar, FiTag, FiTrendingUp, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye, FiSearch, FiFilter, FiRefreshCw, FiFileText, FiInbox, FiGlobe, FiSmartphone } from 'react-icons/fi';

interface DashboardProps {
  isRTL?: boolean; 
}

const Dashboard: React.FC<DashboardProps> = ({ isRTL = false }) => {
  const [user] = useState<User | null>(null); // Remove auth requirement
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [sortMode, setSortMode] = useState<'smart' | 'date_desc' | 'date_asc' | 'priority_desc' | 'name_asc' | 'status'>('date_desc');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Simple local authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dashboard_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load analytics after authentication
  useEffect(() => {
    if (!isAuthenticated) return;
    loadAnalytics();
  }, [isAuthenticated]);

  // Load submissions after authentication and when filters change
  useEffect(() => {
    if (!isAuthenticated) return;
    loadSubmissions();
  }, [statusFilter, searchTerm, sortMode, isAuthenticated]);

  const loadSubmissions = async () => {
    try {
      const data = await formSubmissionService.getSubmissions();
      let filtered = data;
      if (statusFilter !== 'all') {
        filtered = filtered.filter((s) => s.status === statusFilter);
      }
      const term = (searchTerm || '').trim().toLowerCase();
      if (term) {
        filtered = filtered.filter((s) => {
          const fields = [
            s.fullName,
            s.phone,
            s.categoryName,
            s.categoryNameAr,
            s.siteType,
            s.appType,
            s.ecommercePlatform,
            s.existingUrl,
          ];
          return fields.some((v) => (v || '').toLowerCase().includes(term));
        });
      }
      // Sorting
      const priorityScore: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      const statusScore: Record<string, number> = { new: 4, in_progress: 3, completed: 2, cancelled: 1 };
      const getTime = (s: FormSubmission) => new Date(s.submissionDate?.toDate?.() || s.submissionDate).getTime();
      filtered = [...filtered].sort((a, b) => {
        const da = getTime(a);
        const db = getTime(b);
        switch (sortMode) {
          case 'date_desc':
            return db - da;
          case 'date_asc':
            return da - db;
          case 'priority_desc':
            return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0) || db - da;
          case 'name_asc':
            return (a.fullName || '').localeCompare(b.fullName || '');
          case 'status':
            return (statusScore[b.status] || 0) - (statusScore[a.status] || 0) || db - da;
          case 'smart':
          default: {
            const pDiff = (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
            if (pDiff) return pDiff;
            const sDiff = (statusScore[b.status] || 0) - (statusScore[a.status] || 0);
            if (sDiff) return sDiff;
            return db - da;
          }
        }
      });
      setSubmissions(filtered);
    } catch (error) {
      smartToast.dashboard.error('فشل في تحميل الطلبات');
      console.error('Error loading submissions:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await formSubmissionService.deleteSubmission(id);
      setConfirmDeleteId(null);
      smartToast.dashboard.success(isRTL ? 'تم حذف الطلب' : 'Order deleted');
      await loadSubmissions();
    } catch (error) {
      smartToast.dashboard.error(isRTL ? 'فشل حذف الطلب' : 'Failed to delete order');
      console.error('Error deleting submission:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await formSubmissionService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      smartToast.dashboard.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      smartToast.dashboard.error('فشل تسجيل الخروج');
    }
    try {
      localStorage.removeItem('dashboard_auth');
    } catch {}
    setIsAuthenticated(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const ok = loginEmail.trim().toLowerCase() === 'ufuq@ufuq.com' && loginPassword === 'ufuqufuq';
      if (ok) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem('dashboard_auth', 'true');
        } catch {}
        smartToast.dashboard.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
        // Optionally trigger initial loads immediately
        loadAnalytics();
        loadSubmissions();
      } else {
        smartToast.dashboard.error(isRTL ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: FormSubmission['status']) => {
    try {
      await formSubmissionService.updateSubmissionStatus(id, status);
      smartToast.dashboard.success('تم تحديث الحالة بنجاح');
      loadSubmissions();
    } catch (error) {
      smartToast.dashboard.error('فشل في تحديث الحالة');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityAccent = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-rose-500';
      case 'high': return 'bg-amber-400';
      case 'medium': return 'bg-teal-400';
      case 'low': return 'bg-emerald-400';
      default: return 'bg-gray-400';
    }
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-900 font-['Cairo']" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-emerald-900/20 backdrop-blur-xl border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
            >
              Welcome to the Creative Hub
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 text-lg font-medium"
            >
              {isRTL ? 'مرحباً بك في عالم الإبداع' : 'Ufuq Digital Dashboard'}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-emerald-900/20 backdrop-blur-xl p-6 rounded-2xl border border-emerald-800/30 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-1 text-center">
              {isRTL ? 'تسجيل الدخول' : 'Login'}
            </h2>
            <p className="text-white/70 text-sm mb-6 text-center">
              {isRTL ? 'ادخل البريد وكلمة المرور للوصول إلى الداشبورد' : 'Enter email and password to access the dashboard'}
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all duration-300 disabled:opacity-60"
              >
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </motion.button>
              {/* Helper note removed to avoid exposing credentials */}
            </form>
          </motion.div>
        ) : (
        <>
        {/* Analytics Section */}
        {analytics && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-emerald-700/20 to-emerald-600/30 backdrop-blur-xl p-4 rounded-2xl border border-emerald-800/30 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <FiUsers className="text-2xl text-emerald-400" />
                <div className="text-xl font-bold text-emerald-300">{analytics.totalSubmissions}</div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
              </h3>
              <p className="text-emerald-300 text-xs">{isRTL ? 'طلب نشط' : 'Active Orders'}</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-emerald-700/20 to-emerald-600/30 backdrop-blur-xl p-4 rounded-2xl border border-emerald-800/30 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <FiCheckCircle className="text-2xl text-emerald-400" />
                <div className="text-xl font-bold text-emerald-300">{analytics.submissionsByStatus.new}</div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isRTL ? 'طلبات جديدة' : 'New Orders'}
              </h3>
              <p className="text-emerald-300 text-xs">{isRTL ? 'ينتظر الرد' : 'Awaiting Response'}</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-emerald-700/20 to-emerald-600/30 backdrop-blur-xl p-4 rounded-2xl border border-emerald-800/30 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <FiClock className="text-2xl text-emerald-400" />
                <div className="text-xl font-bold text-emerald-300">{analytics.submissionsByStatus.in_progress}</div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isRTL ? 'قيد التنفيذ' : 'In Progress'}
              </h3>
              <p className="text-emerald-300 text-xs">{isRTL ? 'جاري العمل' : 'Work in Progress'}</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-emerald-700/20 to-emerald-600/30 backdrop-blur-xl p-4 rounded-2xl border border-emerald-800/30 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <FiTrendingUp className="text-2xl text-emerald-400" />
                <div className="text-xl font-bold text-emerald-300">{analytics.submissionsByStatus.completed}</div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isRTL ? 'مكتملة' : 'Completed'}
              </h3>
              <p className="text-emerald-300 text-xs">{isRTL ? 'تم التسليم' : 'Delivered'}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-900/20 backdrop-blur-xl p-5 rounded-xl border border-emerald-800/30 shadow-xl shadow-emerald-500/10 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2 flex items-center gap-2">
                <FiFilter className="text-emerald-400" />
                {isRTL ? 'تصنيف الطلبات' : 'Filter Orders'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 backdrop-blur-xl"
              >
                <option value="all" className="bg-slate-800">{isRTL ? 'جميع الطلبات' : 'All Orders'}</option>
                <option value="new" className="bg-slate-800">{isRTL ? 'طلبات جديدة' : 'New Orders'}</option>
                <option value="in_progress" className="bg-slate-800">{isRTL ? 'قيد التنفيذ' : 'In Progress'}</option>
                <option value="completed" className="bg-slate-800">{isRTL ? 'مكتملة' : 'Completed'}</option>
                <option value="cancelled" className="bg-slate-800">{isRTL ? 'ملغية' : 'Cancelled'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2 flex items-center gap-2">
                <FiSearch className="text-emerald-400" />
                {isRTL ? 'ابحث عن عميل' : 'Search Client'}
              </label>
              <input
                type="text"
                placeholder={isRTL ? 'اكتب اسم العميل أو رقم الهاتف...' : 'Type client name or phone...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 backdrop-blur-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2 flex items-center gap-2">
                <FiInbox className="text-emerald-400" />
                {isRTL ? 'ترتيب الطلبات' : 'Sort Orders'}
              </label>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
                className="w-full bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 backdrop-blur-xl"
              >
                <option value="smart" className="bg-slate-800">{isRTL ? 'ترتيب ذكي' : 'Smart'}</option>
                <option value="priority_desc" className="bg-slate-800">{isRTL ? 'حسب الأولوية' : 'Priority'}</option>
                <option value="date_desc" className="bg-slate-800">{isRTL ? 'الأحدث أولاً' : 'Newest'}</option>
                <option value="date_asc" className="bg-slate-800">{isRTL ? 'الأقدم أولاً' : 'Oldest'}</option>
                <option value="name_asc" className="bg-slate-800">{isRTL ? 'الاسم (أ-ي)' : 'Name (A-Z)'}</option>
                <option value="status" className="bg-slate-800">{isRTL ? 'حسب الحالة' : 'Status'}</option>
              </select>
            </div>
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadSubmissions}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all duration-300"
              >
                <FiRefreshCw className="text-base" />
                {isRTL ? 'تحديث' : 'Refresh'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Customer Orders - Modern Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5 max-w-5xl mx-auto"
        >
          <div className="text-center mb-6">
            <motion.h3 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isRTL ? 'طلبات العملاء' : 'Customer Orders'}
            </motion.h3>
            <p className="text-white/70 text-sm">
              {isRTL ? 'إدارة ومتابعة جميع طلبات العملاء' : 'Manage and track all customer orders'}
            </p>
          </div>

          <AnimatePresence>
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.005, y: -2 }}
                className="relative bg-emerald-950/30 backdrop-blur-xl p-5 rounded-2xl border border-emerald-800/30 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
              >
                {/* Priority Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${getPriorityAccent(submission.priority || 'medium')}`}></div>
                {/* Centered Order ID badge */}
                {submission.id && (
                  <div className="mb-3 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white/90">
                      <FiTag className="text-emerald-400 text-xs" />
                      <span className="text-[11px] opacity-80">{isRTL ? 'معرّف الطلب' : 'Order ID'}</span>
                      <span className="font-mono text-[12px]">#{submission.id.slice(-6)}</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Client & Form Data */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
                        <FiUser className="text-white text-base" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white mb-1">
                          {submission.fullName}
                        </h4>
                        <p className="text-white/70 text-xs flex items-center gap-2 leading-tight">
                          <FiPhone className="text-emerald-400 text-xs" />
                          {submission.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800/30">
                        <p className="text-white/60 text-xs mb-1">{isRTL ? 'الفئة' : 'Category'}</p>
                        <p className="text-white font-medium text-xs">{isRTL ? submission.categoryNameAr : submission.categoryName}</p>
                      </div>
                      
                      {/* Form-specific data preview */}
                      {submission.formType === 'website' && submission.siteType && (
                        <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800/30">
                          <p className="text-white/60 text-xs mb-1">{isRTL ? 'نوع الموقع' : 'Website Type'}</p>
                          <p className="text-white font-medium text-xs">
                            {submission.siteType}
                            {submission.ecommercePlatform ? (
                              <span className="text-white/70"> {isRTL ? ' — المنصة: ' : ' — Platform: '} {submission.ecommercePlatform}</span>
                            ) : null}
                          </p>
                        </div>
                      )}
                      
                      {submission.formType === 'app' && submission.appType && (
                        <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800/30">
                          <p className="text-white/60 text-xs mb-1">{isRTL ? 'نوع التطبيق' : 'App Type'}</p>
                          <p className="text-white font-medium text-xs">{submission.appType}</p>
                        </div>
                      )}
                      
                      {submission.formType === 'general' && submission.requestDetails && (
                        <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800/30">
                          <p className="text-white/60 text-xs mb-1">{isRTL ? 'التفاصيل' : 'Details'}</p>
                          <p className="text-white font-medium text-xs line-clamp-2">{submission.requestDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800/30">
                      <div className="flex items-center justify-between">
                        <h5 className="text-white font-medium text-xs">{isRTL ? 'الحالة' : 'Status'}</h5>
                        <select
                          value={submission.status}
                          onChange={(e) => updateSubmissionStatus(submission.id!, e.target.value as FormSubmission['status'])}
                          className={`text-xs font-medium border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-300 ${
                            submission.status === 'new' ? 'bg-sky-500/15 border-sky-400/40 text-sky-300' :
                            submission.status === 'in_progress' ? 'bg-amber-500/15 border-amber-400/40 text-amber-300' :
                            submission.status === 'completed' ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300' :
                            'bg-gray-500/15 border-gray-400/40 text-gray-300'
                          }`}
                        >
                          <option value="new">{isRTL ? 'جديد' : 'New'}</option>
                          <option value="in_progress">{isRTL ? 'قيد التنفيذ' : 'In Progress'}</option>
                          <option value="completed">{isRTL ? 'مكتمل' : 'Completed'}</option>
                          <option value="cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800/30">
                      <p className="text-white/60 text-xs mb-1">{isRTL ? 'التاريخ' : 'Date'}</p>
                      <p className="text-white font-medium text-xs">
                        {new Date(submission.submissionDate?.toDate?.() || submission.submissionDate).toLocaleDateString('ar-EG', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                      <p className="text-white/70 text-xs leading-tight">
                        {new Date(submission.submissionDate?.toDate?.() || submission.submissionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewDetails(submission)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 shadow transition-all duration-300"
                    >
                      <FiEye className="text-sm" />
                      {isRTL ? 'عرض' : 'View'}
                    </motion.button>
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfirmDeleteId(submission.id!)}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 shadow transition-all duration-300 border border-red-500/40"
                      >
                        {isRTL ? 'حذف' : 'Delete'}
                      </motion.button>
                      <AnimatePresence>
                        {confirmDeleteId === submission.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-64 bg-neutral-900 border border-red-500/40 rounded-xl shadow-2xl p-3 z-10"
                          >
                            <p className="text-white text-sm mb-3 text-center">
                              {isRTL ? 'تأكيد الحذف؟' : 'Confirm delete?'}
                            </p>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleDelete(submission.id!)}
                                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-2 rounded-lg font-semibold text-sm border border-red-500/50"
                              >
                                {isRTL ? 'امسح' : 'Delete'}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-semibold text-sm border border-white/30"
                              >
                                {isRTL ? 'إلغاء' : 'Cancel'}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {submissions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiUsers className="text-white/50 text-4xl" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                {isRTL ? 'لا توجد طلبات' : 'No Orders Found'}
              </h4>
              <p className="text-white/70 text-lg">
                {isRTL ? 'لم يتم العثور على طلبات تطابق معايير البحث' : 'No orders match your search criteria'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Beautiful Order Details Modal */}
        <AnimatePresence>
          {selectedSubmission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedSubmission(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-gradient-to-br from-neutral-950 to-emerald-950 backdrop-blur-xl p-8 rounded-3xl border border-emerald-800/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-xl font-bold text-white flex items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-white text-sm" />
                    </div>
                    {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                  </motion.h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedSubmission(null)}
                    className="text-white/50 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    ×
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client Information */}
                  <motion.div 
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="bg-emerald-950/30 rounded-md p-3 border border-emerald-800/30">
                      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                        <FiUser className="text-emerald-400 text-xs" />
                        {isRTL ? 'معلومات العميل' : 'Client Information'}
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'الاسم الكامل' : 'Full Name'}</p>
                          <p className="text-white font-medium text-xs">{selectedSubmission.fullName}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</p>
                          <p className="text-white font-medium text-xs flex items-center gap-1">
                            <FiPhone className="text-emerald-400 text-xs" />
                            {selectedSubmission.phone}
                          </p>
                        </div>
                        {selectedSubmission.documentType && (
                          <div>
                            <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'نوع المستند' : 'Document Type'}</p>
                            <p className="text-white font-medium text-xs flex items-center gap-1">
                              <FiMail className="text-emerald-400 text-xs" />
                              {selectedSubmission.documentType}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-emerald-950/30 rounded-md p-3 border border-emerald-800/30">
                      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                        <FiTag className="text-emerald-400 text-xs" />
                        {isRTL ? 'تفاصيل الخدمة' : 'Service Details'}
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'الفئة' : 'Category'}</p>
                          <p className="text-white font-medium text-xs">
                            {isRTL ? selectedSubmission.categoryNameAr : selectedSubmission.categoryName}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'نوع الخدمة' : 'Service Type'}</p>
                          <p className="text-white font-medium text-xs">
                            {selectedSubmission.formType === 'website' ? (isRTL ? 'موقع إلكتروني' : 'Website') :
                             selectedSubmission.formType === 'app' ? (isRTL ? 'تطبيق جوال' : 'Mobile App') :
                             (isRTL ? 'اتصال عام' : 'General Contact')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Form Data */}
                  <motion.div 
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >

                    {/* Website Data */}
                    {selectedSubmission.formType === 'website' && selectedSubmission.siteType && (
                      <div className="bg-emerald-950/30 rounded-md p-3 border border-emerald-800/30">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                          <FiGlobe className="text-emerald-400 text-xs" />
                          {isRTL ? 'بيانات الموقع' : 'Website Data'}
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'نوع الموقع' : 'Website Type'}</p>
                            <p className="text-white font-medium text-xs">{selectedSubmission.siteType}</p>
                          </div>
                          {selectedSubmission.ecommercePlatform && (
                            <div>
                              <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'المنصة' : 'Platform'}</p>
                              <p className="text-white font-medium text-xs">{selectedSubmission.ecommercePlatform}</p>
                            </div>
                          )}
                          {selectedSubmission.existingUrl && (
                            <div>
                              <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'الرابط' : 'URL'}</p>
                              <a 
                                href={selectedSubmission.existingUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-400 font-medium text-xs hover:text-emerald-300 underline break-all"
                              >
                                {selectedSubmission.existingUrl.length > 25 
                                  ? selectedSubmission.existingUrl.substring(0, 25) + '...' 
                                  : selectedSubmission.existingUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* App Data */}
                    {selectedSubmission.formType === 'app' && selectedSubmission.appType && (
                      <div className="bg-emerald-950/30 rounded-md p-3 border border-emerald-800/30">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                          <FiSmartphone className="text-emerald-400 text-xs" />
                          {isRTL ? 'بيانات التطبيق' : 'App Data'}
                        </h3>
                        <div>
                          <p className="text-white/60 text-xs mb-0.5">{isRTL ? 'نوع التطبيق' : 'App Type'}</p>
                          <p className="text-white font-medium text-xs">{selectedSubmission.appType}</p>
                        </div>
                      </div>
                    )}

                    {/* General Form Data */}
                    {selectedSubmission.formType === 'general' && selectedSubmission.requestDetails && (
                      <div className="bg-emerald-950/30 rounded-md p-3 border border-emerald-800/30">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                          <FiFileText className="text-emerald-400 text-xs" />
                          {isRTL ? 'تفاصيل الطلب' : 'Request Details'}
                        </h3>
                        <div className="bg-emerald-950/30 rounded-md p-2 border border-emerald-800/30">
                          <p className="text-white/90 text-xs leading-relaxed line-clamp-3">
                            {selectedSubmission.requestDetails}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedSubmission.extraInfo && (
                      <div className="bg-emerald-950/30 rounded-md p-3 border border-emerald-800/30">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                          <FiAlertCircle className="text-emerald-400 text-xs" />
                          {isRTL ? 'معلومات إضافية' : 'Additional Info'}
                        </h3>
                        <div className="bg-emerald-950/30 rounded p-2 border border-emerald-800/30">
                          <p className="text-white/90 text-xs leading-relaxed line-clamp-3">
                            {selectedSubmission.extraInfo}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 mt-6 pt-6 border-t border-emerald-800/30"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newStatus = selectedSubmission.status === 'new' ? 'in_progress' :
                                       selectedSubmission.status === 'in_progress' ? 'completed' : 'new';
                      updateSubmissionStatus(selectedSubmission.id!, newStatus);
                      setSelectedSubmission({...selectedSubmission, status: newStatus});
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 shadow-lg transition-all duration-300"
                  >
                    <FiCheckCircle className="text-sm" />
                    {(() => {
                      const nextLabel = selectedSubmission.status === 'new'
                        ? (isRTL ? 'قيد التنفيذ' : 'In Progress')
                        : selectedSubmission.status === 'in_progress'
                          ? (isRTL ? 'مكتمل' : 'Completed')
                          : (isRTL ? 'جديد' : 'New');
                      return isRTL ? `تحديث الحالة إلى ${nextLabel}` : `Update status to ${nextLabel}`;
                    })()}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubmission(null)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 border border-white/30 transition-all duration-300"
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;