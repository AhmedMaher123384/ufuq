import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { smartToast } from '../../utils/toastConfig';
import { Menu, X, Search, Package, Settings, Phone, Mail, MapPin, Clock, ChevronDown, Home, Grid3X3, Star, Award, Truck, Shield, Sparkles, Bell, ChevronLeft, BookOpen, Crown } from 'lucide-react';
import logo from '../../assets/logo.png';
// import AuthModal from '../modals/AuthModal';
// import CartDropdown from '../ui/CartDropdown';
import LiveSearch from '../ui/LiveSearch';
import LanguageSelector from '../ui/LanguageSelector';
import { createCategorySlug } from '../../utils/slugify';
import { apiCall, API_ENDPOINTS, buildImageUrl } from '../../config/api';
import { mockCategories } from '../../mock/categories';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

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

function Navbar() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cachedCategories');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const isLogoHoveredRef = useRef(false);
  useEffect(() => { isLogoHoveredRef.current = isLogoHovered; }, [isLogoHovered]);

  const isMenuOpenRef = useRef(false);
  useEffect(() => { isMenuOpenRef.current = isMenuOpen; }, [isMenuOpen]);

  // Ref for the mobile bottom sheet panel
  const bottomSheetRef = useRef<HTMLDivElement | null>(null);

  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get first letter of each name for mobile display
  const getInitials = (name: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Control navbar visibility based on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (isMenuOpenRef.current) {
        lastScrollYRef.current = currentScrollY;
        return;
      }
      if (currentScrollY < 10) {
        setScrolled(false);
        setShowNavbar(true);
      } else {
        setScrolled(true);
        if (isLogoHoveredRef.current) {
          setShowNavbar(true);
        } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setShowNavbar(false);
        } else if (currentScrollY < lastScrollYRef.current) {
          setShowNavbar(true);
        }
      }
      lastScrollYRef.current = currentScrollY;
    };

    const throttledControlNavbar = throttle(controlNavbar, 50);
    window.addEventListener('scroll', throttledControlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', throttledControlNavbar);
  }, []);

  // Handle logo hover to show navbar
  useEffect(() => {
    if (isLogoHovered && scrolled) {
      setShowNavbar(true);
    }
  }, [isLogoHovered, scrolled]);

  // Handle window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close user menu and cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setTimeout(() => {
          if (!isCartHovered) {
            setIsCartDropdownOpen(false);
          }
        }, 400);
      }
    };

    if (isUserMenuOpen || isCartDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isCartDropdownOpen, isCartHovered]);

  // Close mobile menu when clicking outside or on overlay
  useEffect(() => {
    const handleMobileMenuClose = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && target.classList.contains('mobile-menu-overlay')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleMobileMenuClose);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleMobileMenuClose);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // إعادة تهيئة تتبّع السحب بعد تبديل اللغة
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    setScrolled(window.scrollY >= 10);
    setShowNavbar(true);
    setIsLogoHovered(false);
    isLogoHoveredRef.current = false;
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  }, [i18n.language]);

  // Hide navbar when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [isMenuOpen]);

  // Attach drag-to-close interactions to the mobile bottom sheet without using a callback ref
  useEffect(() => {
    const el = bottomSheetRef.current;
    if (!el) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isMenuOpen) return;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startY || !isMenuOpen) return;
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 8) {
        isDragging = true;
        const translateY = Math.min(diff * 0.7, 300);
        el.style.transform = `translateY(${translateY}px) scale(${1 - translateY / 2000})`;
        el.style.opacity = `${1 - translateY / 800}`;
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        const diff = currentY - startY;
        if (diff > 100) {
          el.style.transform = 'translateY(100%) scale(0.97)';
          el.style.opacity = '0';
          setTimeout(() => setIsMenuOpen(false), 250);
        } else {
          el.style.transform = 'translateY(0) scale(1)';
          el.style.opacity = '1';
        }
        isDragging = false;
        startY = 0;
        currentY = 0;
      }
    };

    // Desktop experimental support
    const handleMouseDown = (e: MouseEvent) => {
      if (!isMenuOpen) return;
      startY = e.clientY;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!startY || !isMenuOpen) return;
      currentY = e.clientY;
      const diff = currentY - startY;
      if (diff > 8) {
        isDragging = true;
        const translateY = Math.min(diff * 0.7, 300);
        el.style.transform = `translateY(${translateY}px) scale(${1 - translateY / 2000})`;
        el.style.opacity = `${1 - translateY / 800}`;
      }
    };
    const handleMouseUp = () => handleTouchEnd();

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMenuOpen]);

  // Throttle function
  const throttle = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: number | null = null;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('👤 User loaded from localStorage:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
    fetchCategories();

    const handleCartUpdate = () => {
      console.log('🔄 [Navbar] Cart update event received');
      fetchCartCount();
    };

    const handleCartCountChange = () => {
      console.log('🔄 [Navbar] Cart count change event received');
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const cartItems = JSON.parse(localCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
            console.log('📊 [Navbar] Cart count updated instantly:', totalItems);
            const userData = localStorage.getItem('user');
            if (userData) {
              console.log('👤 [Navbar] Logged in user - syncing with server in background');
              setTimeout(() => fetchCartCount(), 100);
            }
            return;
          }
        } catch (parseError) {
          console.error('❌ [Navbar] Error parsing local cart:', parseError);
        }
      }
      const userData = localStorage.getItem('user');
      if (userData) {
        console.log('👤 [Navbar] No local cart - fetching from server');
        fetchCartCount();
      } else {
        setCartItemsCount(0);
      }
    };

    const handleWishlistUpdate = () => {
      console.log('🔄 [Navbar] Wishlist update event received');
      fetchWishlistCount();
    };

    const handleCategoriesUpdate = () => fetchCategories();

    const cartEvents = [
      'cartUpdated',
      'productAddedToCart',
      'forceCartUpdate'
    ];
    const cartCountEvents = [
      'cartCountChanged'
    ];
    const wishlistEvents = [
      'wishlistUpdated',
      'productAddedToWishlist',
      'productRemovedFromWishlist',
      'wishlistCleared'
    ];

    cartEvents.forEach(event => {
      window.addEventListener(event, handleCartUpdate);
    });
    cartCountEvents.forEach(event => {
      window.addEventListener(event, handleCartCountChange);
    });
    wishlistEvents.forEach(event => {
      window.addEventListener(event, handleWishlistUpdate);
    });
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartUpdated' || e.key === 'lastCartUpdate' || e.key === 'forceCartRefresh') {
        console.log('🔄 [Navbar] Storage cart update detected');
        handleCartUpdate();
      }
      if (e.key === 'wishlistUpdated' || e.key === 'lastWishlistUpdate') {
        console.log('🔄 [Navbar] Storage wishlist update detected');
        handleWishlistUpdate();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      const savedCartCount = localStorage.getItem(`cartCount_${user.id}`);
      const savedWishlistCount = localStorage.getItem(`wishlistCount_${user.id}`);
      if (savedCartCount) {
        setCartItemsCount(parseInt(savedCartCount));
      }
      if (savedWishlistCount) {
        setWishlistItemsCount(parseInt(savedWishlistCount));
      }
    } else {
      console.log('👤 [Navbar] Loading wishlist for guest user');
      const savedWishlist = localStorage.getItem('wishlist');
      console.log('💾 [Navbar] Guest wishlist from localStorage:', savedWishlist);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('📦 [Navbar] Parsed guest wishlist:', parsedWishlist);
          if (Array.isArray(parsedWishlist)) {
            console.log('✅ [Navbar] Setting guest wishlist count:', parsedWishlist.length);
            setWishlistItemsCount(parsedWishlist.length);
          } else {
            console.log('❌ [Navbar] Guest wishlist is not an array');
            setWishlistItemsCount(0);
          }
        } catch (error) {
          console.error('❌ [Navbar] Error parsing guest wishlist:', error);
          setWishlistItemsCount(0);
        }
      } else {
        console.log('📭 [Navbar] No guest wishlist found, setting count to 0');
        setWishlistItemsCount(0);
      }
    }

    return () => {
      cartEvents.forEach(event => {
        window.removeEventListener(event, handleCartUpdate);
      });
      cartCountEvents.forEach(event => {
        window.removeEventListener(event, handleCartCountChange);
      });
      wishlistEvents.forEach(event => {
        window.removeEventListener(event, handleWishlistUpdate);
      });
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const cartItems = JSON.parse(localCart);
            if (Array.isArray(cartItems)) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              localStorage.setItem('lastCartCount', totalItems.toString());
              console.log('📊 [Navbar] Cart count from localStorage:', totalItems);
              return;
            }
          } catch (parseError) {
            console.error('❌ [Navbar] Error parsing local cart:', parseError);
          }
        }
        setCartItemsCount(0);
        localStorage.setItem('lastCartCount', '0');
        console.log('📊 [Navbar] No user and no local cart, setting count to 0');
        return;
      }

      const user = JSON.parse(userData);
      if (!user?.id) {
        console.warn('⚠️ [Navbar] Invalid user data, falling back to localStorage');
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const cartItems = JSON.parse(localCart);
            if (Array.isArray(cartItems)) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              localStorage.setItem('lastCartCount', totalItems.toString());
              return;
            }
          } catch (parseError) {
            console.error('❌ [Navbar] Error parsing local cart fallback:', parseError);
          }
        }
        setCartItemsCount(0);
        localStorage.setItem('lastCartCount', '0');
        return;
      }

      console.log('🔄 [Navbar] Fetching cart count for user:', user.id);
      try {
        const data = await apiCall(API_ENDPOINTS.USER_CART(user.id));
        console.log('📦 [Navbar] Raw cart data:', data);
        let totalItems = 0;
        if (Array.isArray(data)) {
          totalItems = data.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        } else if (data && typeof data === 'object' && Array.isArray(data.cart)) {
          totalItems = data.cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        } else if (data && typeof data === 'object' && typeof data.totalItems === 'number') {
          totalItems = data.totalItems;
        }
        console.log('📊 [Navbar] Cart count calculated from server:', totalItems);
        setCartItemsCount(totalItems);
        localStorage.setItem('lastCartCount', totalItems.toString());
        localStorage.setItem(`cartCount_${user.id}`, totalItems.toString());
        console.log('💾 [Navbar] Cart count saved to localStorage:', totalItems);
      } catch (apiError) {
        console.error('❌ [Navbar] API error, falling back to localStorage:', apiError);
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const cartItems = JSON.parse(localCart);
            if (Array.isArray(cartItems)) {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
              setCartItemsCount(totalItems);
              localStorage.setItem('lastCartCount', totalItems.toString());
              console.log('📊 [Navbar] Cart count from localStorage fallback:', totalItems);
              return;
            }
          } catch (parseError) {
            console.error('❌ [Navbar] Error parsing local cart in API fallback:', parseError);
          }
        }
        const lastCount = localStorage.getItem('lastCartCount');
        if (lastCount) {
          const count = parseInt(lastCount, 10) || 0;
          setCartItemsCount(count);
          console.log('📊 [Navbar] Using last saved cart count:', count);
        } else {
          setCartItemsCount(0);
          localStorage.setItem('lastCartCount', '0');
          console.log('📊 [Navbar] No fallback available, setting count to 0');
        }
      }
    } catch (error) {
      console.error('❌ [Navbar] Error fetching cart count:', error);
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const cartItems = JSON.parse(localCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartItemsCount(totalItems);
            return;
          }
        } catch (parseError) {
          console.error('❌ [Navbar] Error parsing local cart fallback:', parseError);
        }
      }
      setCartItemsCount(0);
      localStorage.setItem('lastCartCount', '0');
    }
  };

  const fetchWishlistCount = async () => {
    try {
      console.log('🔄 [Navbar] fetchWishlistCount called');
      const savedWishlist = localStorage.getItem('wishlist');
      console.log('💾 [Navbar] Raw wishlist from localStorage:', savedWishlist);
      let wishlistCount = 0;
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('📦 [Navbar] Parsed wishlist:', parsedWishlist);
          if (Array.isArray(parsedWishlist)) {
            wishlistCount = parsedWishlist.length;
            console.log('✅ [Navbar] Calculated wishlist count:', wishlistCount);
          } else {
            console.log('❌ [Navbar] Wishlist is not an array');
            wishlistCount = 0;
          }
        } catch (parseError) {
          console.error('❌ [Navbar] Error parsing wishlist from localStorage:', parseError);
          wishlistCount = 0;
        }
      } else {
        console.log('📭 [Navbar] No wishlist found in localStorage');
      }
      console.log('📊 [Navbar] Final wishlist count:', wishlistCount);
      setWishlistItemsCount(wishlistCount);
      localStorage.setItem('lastWishlistCount', wishlistCount.toString());
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.id) {
            localStorage.setItem(`wishlistCount_${user.id}`, wishlistCount.toString());
          }
        } catch (error) {
          console.error('❌ [Navbar] Error parsing user data:', error);
        }
      }
      console.log('💾 [Navbar] Wishlist count saved to localStorage:', wishlistCount);
    } catch (error) {
      console.error('❌ [Navbar] Error fetching wishlist count:', error);
      setWishlistItemsCount(0);
      localStorage.setItem('lastWishlistCount', '0');
    }
  };

  const fetchCategories = async () => {
    try {
      const mappedCategories = mockCategories.map((c) => ({
        id: c.id,
        name: c.name,
        name_ar: (c as any).name_ar,
        name_en: (c as any).name_en,
        description: c.description,
        description_ar: (c as any).description_ar,
        description_en: (c as any).description_en,
        image: c.image
      }));
      setCategories(mappedCategories);
      localStorage.setItem('cachedCategories', JSON.stringify(mappedCategories));
    } catch (error) {
      console.error('Error fetching categories (fallback to mock):', error);
      const mappedCategories = mockCategories.map((c) => ({ id: c.id, name: c.name, name_ar: (c as any).name_ar, name_en: (c as any).name_en, description: c.description, description_ar: (c as any).description_ar, description_en: (c as any).description_en, image: c.image }));
      setCategories(mappedCategories);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    const mergeLocalCartWithUserCart = async () => {
      try {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const localItems = JSON.parse(localCart);
          if (localItems.length > 0) {
            console.log('🔄 [Navbar] Merging local cart with user cart:', localItems.length, 'items');
            for (const item of localItems) {
              try {
                await apiCall(API_ENDPOINTS.USER_CART(userData.id), {
                  method: 'POST',
                  body: JSON.stringify({
                    productId: item.productId,
                    quantity: item.quantity,
                    selectedOptions: item.selectedOptions || {},
                    optionsPricing: item.optionsPricing || {},
                    attachments: item.attachments || {},
                    productName: item.product?.name || 'منتج',
                    price: item.product?.price || 0,
                    image: item.product?.mainImage || ''
                  })
                });
                console.log('✅ [Navbar] Merged item:', item.productId);
              } catch (error) {
                console.error('❌ [Navbar] Error merging item:', item.productId, error);
              }
            }
            try {
              const serverCart = await apiCall(API_ENDPOINTS.USER_CART(userData.id));
              localStorage.setItem('cart', JSON.stringify(serverCart));
              console.log('✅ [Navbar] Cart merged successfully, new cart size:', serverCart.length);
              window.dispatchEvent(new CustomEvent('cartUpdated'));
              smartToast.frontend.success('تم دمج سلة التسوق بنجاح! 🛒');
            } catch (error) {
              console.error('❌ [Navbar] Error fetching merged cart:', error);
            }
          } else {
            console.log('📭 [Navbar] Local cart is empty, no merge needed');
          }
        } else {
          console.log('📭 [Navbar] No local cart found');
        }
      } catch (error) {
        console.error('❌ [Navbar] Error in cart merge:', error);
      }
    };
    mergeLocalCartWithUserCart();
    smartToast.frontend.success(`مرحباً بك ${userData.firstName}! 🎉`);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Logo - Removed per user request */}
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          showNavbar && !isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
        onMouseEnter={() => {
          if (scrolled && !isMenuOpen) {
            setIsLogoHovered(true);
          }
        }}
        onMouseLeave={() => {
          setTimeout(() => setIsLogoHovered(false), 500);
        }}
      >
        {/* Navbar Container with Rounded Corners */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <div 
            className={`relative mx-auto max-w-[90rem] transition-all duration-500 ease-out rounded-2xl ${
              scrolled 
                ? 'bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20' 
                : 'bg-transparent border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
              {/* Mobile Menu Button & Cart */}
              <div className="lg:hidden flex items-center space-x-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm touch-manipulation relative overflow-hidden group"
                  aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                >
                  <div className="relative z-10">
                    {isMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
                  </div>
                  <div className="absolute inset-0 bg-white/5 scale-0 group-active:scale-100 transition-transform duration-150 rounded-lg"></div>
                </button>
                {/* Mobile Cart Button removed per mock-data requirement */}
              </div>
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="cursor-pointer">
                  <img src={logo} alt="Logo" className="h-14 sm:h-16 w-auto" />
                </Link>
              </div>
              {/* Desktop Navigation Links - Exact order: Home, Services, first 3 categories, Contact */}
              <div className="hidden lg:flex items-center space-x-1">
                {/* Home */}
                <Link
                  key="nav-home"
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative px-4 py-2 text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-medium group ${
                    isActive('/') ? 'text-[#18b5d8]' : ''
                  }`}
                >
                  {t('nav.home')}
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#18b5d8] to-[#0891b2] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
                {/* Services */}
                <Link
                  key="nav-services"
                  to="/services"
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative px-4 py-2 text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-medium group ${
                    isActive('/services') ? 'text-[#18b5d8]' : ''
                  }`}
                >
                  {t('nav.categories')}
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#18b5d8] to-[#0891b2] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
                {/* First 3 Categories */}
                {categories && categories.length > 0 && (
                  categories.slice(0, 3).map((c) => (
                    <Link
                      key={`cat-${c.id}`}
                      to={`/service/${createCategorySlug(c.id, c.name)}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`relative px-3 py-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm`}
                    >
                      {(c as any).name_ar || c.name}
                    </Link>
                  ))
                )}
                {/* Contact */}
                <Link
                  key="nav-contact"
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative px-4 py-2 text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-medium group ${
                    isActive('/contact') ? 'text-[#18b5d8]' : ''
                  }`}
                >
                  {t('nav.contact')}
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#18b5d8] to-[#0891b2] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
              </div>
              {/* Action Buttons */}
              <div className="hidden lg:flex items-center space-x-3">
                {/* Search Button */}
                <LiveSearch />
                {/* Language Selector */}
                <LanguageSelector />
                {/* Cart / Wishlist / Auth removed per mock-data requirement */}
              </div>
            </div>
          </div>
        </div>
      </nav>

  {/* === MOBILE MENU — Emerald Depth (Bottom Sheet) — أروش، أنقى، أنضف === */}
{isMobile && (
  <div
    className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
      isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
    }`}
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
    onClick={() => {
      // إغلاق أنيق: scale-down + fade
      const panel = document.querySelector('.mobile-bottom-sheet') as HTMLElement;
      if (panel) {
        panel.style.transform = 'translateY(80%) scale(0.97)';
        panel.style.opacity = '0';
        setTimeout(() => setIsMenuOpen(false), 250);
      } else {
        setIsMenuOpen(false);
      }
    }}
  >
    <div
      className="mobile-bottom-sheet fixed bottom-0 left-0 right-0 bg-[#16161b] rounded-t-3xl overflow-hidden"
      style={{
        maxHeight: '92vh',
        transform: isMenuOpen ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.97)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s',
        opacity: isMenuOpen ? 1 : 0,
        willChange: 'transform, opacity',
        touchAction: 'none',
        boxShadow: '0 -12px 40px rgba(0,0,0,0.35)',
      }}
      ref={bottomSheetRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Handle Bar — أنحف، أنظف */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-8 h-1 bg-[#3a3a42] rounded-full"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-6" style={{ maxHeight: '82vh' }}>
        {/* Logo — مركز، نظيف */}
        <div className="flex justify-center mb-7">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="Logo" className="h-10 w-auto opacity-95" />
          </Link>
        </div>

        {/* Search & Settings */}
        <div className="mb-7">
          <div className="flex items-center mb-3">
            <div className="w-0.5 h-3 bg-[#10b981] rounded-full mr-3"></div>
            <h3 className="text-[#7c7c84] text-[11px] font-semibold uppercase tracking-widest">
              {t('nav.search_and_settings')}
            </h3>
          </div>
          <div className="space-y-3.5">
            <LiveSearch />
            <LanguageSelector />
          </div>
        </div>

        {/* Navigation — أروش، أنضف */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-0.5 h-3 bg-[#10b981] rounded-full mr-3"></div>
            <h3 className="text-[#7c7c84] text-[11px] font-semibold uppercase tracking-widest">
              {t('nav.pages')}
            </h3>
          </div>

          <div className="space-y-1.5">
            {[
              { name: t('nav.home'), href: '/', icon: Home, color: '#10b981' },
              { name: t('nav.categories'), href: '/services', icon: Package, color: '#f59e0b' },
              ...((categories && categories.length > 0)
                ? categories.slice(0, 3).map((c) => ({
                    name: c.name,
                    href: `/service/${createCategorySlug(c.id, c.name)}`,
                    icon: Grid3X3,
                    color: '#3b82f6'
                  }))
                : []),
              { name: t('nav.contact'), href: '/contact', icon: Phone, color: '#ef4444' }
            ].map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3.5 py-3 rounded-xl transition-all duration-250 group ${
                  isActive(link.href)
                    ? 'bg-[#10b981] bg-opacity-5 text-white'
                    : 'text-[#b0b0b8] hover:bg-[#1a1a1f]'
                }`}
                style={{
                  animation: isMenuOpen ? `fadeInUp 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 60}ms forwards` : 'none',
                  opacity: 0,
                  transform: 'translateY(8px)',
                }}
              >
                {/* Icon Container — أخضر عند النشط */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-250 group-hover:scale-105"
                  style={{
                    backgroundColor: isActive(link.href)
                      ? `${link.color}15`
                      : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <link.icon
                    size={16}
                    className="text-[#a0a0a8]"
                    style={{ color: isActive(link.href) ? link.color : undefined }}
                  />
                </div>

                <span className="font-medium text-[15px] flex-1 mr-2">{link.name}</span>

                {/* Active Indicator — خط أيسر (لـ RTL) */}
                {isActive(link.href) && (
                  <div
                    className="absolute left-0 top-1/2 w-0.5 h-5 rounded-full -translate-y-1/2"
                    style={{ backgroundColor: '#10b981' }}
                  ></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style >{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  </div>
)}

      {/* AuthModal removed per mock-data requirement */}
    </>
  );
}

export default Navbar;