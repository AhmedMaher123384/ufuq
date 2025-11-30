import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import './i18n/config';
import Navbar from './components/layout/Navbar';
import GlobalFooter from './components/layout/GlobalFooter';
import CustomCursor from './components/ui/CustomCursor';
import WhatsAppButton from './components/ui/WhatsAppButton';
import App from './App';
import ProductDetail from './components/ProductDetail';
import ProductsByCategory from './components/ProductsByCategory';
import ServiceForm from './components/forms/ServiceForm';
import AllProducts from './components/AllProducts';
import AllCategories from './components/AllCategories';
import Checkout from './components/Checkout';
import ThankYou from './components/ThankYou';
import About from './pages/About';
import Contact from './pages/Contact';
import CategoryPage from './components/CategoryPage';
import PrivacyPolicy from './components/home/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ScrollToTop from './components/ui/ScrollToTop';
import Dashboard from './components/Dashboard';

import Testimonials from './pages/Testimonials';
import Clients from './pages/Clients';
import Portfolio from './pages/Portfolio';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import './index.css';

// تعريف Props لـ ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');
  
  // التحقق من وجود التوكن وبيانات المستخدم
  const hasValidAuth = isAuthenticated && adminToken && adminUser;
  
  if (!hasValidAuth) {
    // مسح البيانات المتبقية في حالة عدم اكتمال المصادقة
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
  
  return hasValidAuth ? <>{children}</> : <Navigate to="/login" />;
};

// مكون للتحكم في النافبار والفوتر والـ padding
const LayoutWrapper: React.FC = () => {
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();
  const [showCartNotification, setShowCartNotification] = React.useState(false);
  const [notificationProduct, setNotificationProduct] = React.useState<any>(null);
  const [notificationQuantity, setNotificationQuantity] = React.useState(1);
  const hideNavbarPaths = ['/login', '/admin', '/dashboard', '/checkout', '/thank-you'];
  const hideFooterPaths = ['/login', '/admin', '/dashboard', '/checkout', '/thank-you'];
  const hideWhatsAppPaths = ['/dashboard'];

  // إيقاف شاشة التحميل بعد التحميل الأولي للصفحة
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // التحقق إذا المسار الحالي هو /login أو /checkout أو بيبدأ بـ /admin أو أثناء التحميل
  const shouldHideNavbar = isLoading || hideNavbarPaths.some(path => 
    path === '/login' || path === '/checkout' ? location.pathname === path : location.pathname.startsWith(path)
  );

  // التحقق إذا المسار الحالي يجب إخفاء الفوتر فيه أو أثناء التحميل
  const shouldHideFooter = isLoading || hideFooterPaths.some(path => 
    path === '/login' || path === '/checkout' ? location.pathname === path : location.pathname.startsWith(path)
  );

  // إخفاء زر الواتساب في الداشبورد
  const shouldHideWhatsApp = hideWhatsAppPaths.some(path => location.pathname.startsWith(path));

  // Listen for cart notifications
  React.useEffect(() => {
    const handleCartNotification = (event: any) => {
      const { product, quantity } = event.detail || {};
      if (product) {
        setNotificationProduct(product);
        setNotificationQuantity(quantity || 1);
        setShowCartNotification(true);
      }
    };

    window.addEventListener('showCartNotification', handleCartNotification);
    return () => {
      window.removeEventListener('showCartNotification', handleCartNotification);
    };
  }, []);

  // إضافة padding علوي للمحتوى لتجنب التداخل مع الـ navbar
  const contentClass = 'pt-0';

  return (
    <>
      <CustomCursor />
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideWhatsApp && <WhatsAppButton />}
      
      <div className={contentClass}>
        <Routes> 
          {/* E-commerce Routes */}
          <Route path="/" element={<App />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/services" element={<AllCategories />} />
          
          {/* SEO-friendly product routes */}
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
         
          {/* SEO-friendly category routes */}
          <Route path="/service/:slug" element={<CategoryPage />} />
          <Route path="/service/:id" element={<CategoryPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
        
        
          {/* Services Management Routes (Legacy) */}
          <Route path="/admin/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/admin/service/add" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
          <Route path="/admin/service/edit/:id" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
          
       
          {/* Other Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          
          {/* Policy Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          

          
          {/* Testimonials Routes */}
          <Route path="/testimonials" element={<Testimonials />} />
          
          {/* Clients Routes */}
          <Route path="/clients" element={<Clients />} />
          
          {/* Portfolio Routes */}
          <Route path="/portfolio" element={<Portfolio />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          
         {/* Static Pages Route */}
        </Routes>
      </div>
      {!shouldHideFooter && <GlobalFooter />}
    </>
  );
};

// إنشاء root مرة واحدة فقط لتجنب تحذير React
const rootElement = document.getElementById('root')!;
// استخدم تخزينًا عالميًا للحفاظ على نفس الـ root أثناء إعادة التحميل (HMR)
declare global {
  interface Window {
    __reactRoot?: ReactDOM.Root;
  }
}
const root: ReactDOM.Root = window.__reactRoot ?? ReactDOM.createRoot(rootElement);
window.__reactRoot = root;

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <LoadingProvider>
          <CurrencyProvider>
            <ScrollToTop />
            <LayoutWrapper />
          </CurrencyProvider>
        </LoadingProvider>

        <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        style={{ 
          zIndex: 999999,
          top: '80px',
          fontSize: '16px'
        }}
        toastStyle={{
          minHeight: '60px',
          fontSize: '16px'
        }}
        />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);