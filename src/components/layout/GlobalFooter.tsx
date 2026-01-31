import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaFacebookF, FaSnapchatGhost, FaCcVisa, FaCcMastercard, FaCcApplePay, FaStripe } from 'react-icons/fa';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { mockCategories } from '../../mock/categories';
import { createCategorySlug } from '../../utils/slugify';
import { useTranslation } from 'react-i18next';
import logo from "../../assets/logo.png";
import salla from "../../assets/sallalogo.webp";
import shopify from "../../assets/Shopifylogo.png";
import wordpress from "../../assets/wordpresslogo.png";

const GlobalFooter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const categoriesLinks = mockCategories.map((c) => ({
    to: `/service/${createCategorySlug(c.id, c.name)}`,
    label: isRTL ? (c.name_ar || c.name) : c.name,
  }));

  const quickLinks = [
    { name: t('footer.home'), to: "/" },
    { name: t('footer.our_work'), to: "/portfolio" },
    { name: t('footer.blog'), to: "/blog" },
    { name: t('footer.contact_us'), to: "/contact" },
    { name: t('footer.products'), to: "/services" },
    { name: t('footer.privacy_policy'), to: "/privacy-policy" },
    { name: t('footer.terms_conditions'), to: "/terms-and-conditions" },
    { name: t('footer.refund_dispute_policy'), to: "/refund-and-dispute-policy" },
  ];

  return (
    <>
      <footer ref={footerRef} className="relative bg-gradient-to-b from-[#16161b] via-[#1a1a20] to-[#16161b] overflow-hidden opacity-0 translate-y-6">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#8F93A5] rounded-full blur-[90px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#6c7081] rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 py-8 md:py-10">
          {/* العرض اللي كنت عايزه من الأول */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

            {/* Newsletter - صغير وفي الأول */}
            {location.pathname === '/' && (
              <div className="max-w-md mx-auto text-center mb-8">
                <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8F93A5] via-[#a8abbe] to-[#8F93A5] bg-[length:200%_auto] animate-gradient mb-3">
                  {t('footer.stay_connected')}
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder={t('footer.email_placeholder')}
                    className="flex-1 px-3 py-2 bg-[#25252f] border border-[#2a2a35] rounded-xl text-white/60 placeholder-white/40 text-xs focus:border-[#8F93A5] focus:bg-[#2a2a35] outline-none transition-all duration-300 text-right"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] text-white font-medium rounded-xl hover:scale-105 transition-all text-xs">
                    {t('footer.subscribe_now')}
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-right">

              {/* Logo + Social */}
              <div className="space-y-4">
                <a href="/" className="inline-block">
                  <img src={logo} alt="UfuqDigital" className="w-32 md:w-40 h-auto hover:scale-105 transition-transform duration-300 mx-auto md:mx-0" />
                </a>
                <div className="flex justify-end gap-3 flex-row-reverse">
                  {[
                    { href: "https://www.instagram.com/ufuqdigital/?utm_source=qr&igsh=MTk5ZTlkZXl4ZGNmOA%3D%3D#", icon: FaInstagram },
                    { href: "https://www.snapchat.com/@ufuqdigital?share_id=IrYR7CBgmec&locale=en-US", icon: FaSnapchatGhost },
                    { href: "https://www.facebook.com/UfuqDigitalcom", icon: FaFacebookF },
                    { href: "https://wa.me/966543098895", icon: FaWhatsapp },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                       className="w-9 h-9 bg-[#25252f] border border-[#2a2a35] rounded-xl flex items-center justify-center hover:border-[#8F93A5] hover:bg-[#2a2a35] hover:scale-110 transition-all duration-300">
                      <s.icon className="w-4 h-4 text-[#8F93A5]" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-base md:text-lg font-bold text-[#8F93A5] mb-3">{isRTL ?'خدماتنا' : 'Services'}</h4>
                <div className="space-y-1.5">
                  {categoriesLinks.map((link, i) => (
                    <Link key={i} to={link.to} className="block text-white/60 hover:text-[#8F93A5] text-xs md:text-sm transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-base md:text-lg font-bold text-[#8F93A5] mb-3">{t('footer.quick_links')}</h4>
                <div className="space-y-1.5">
                  {quickLinks.map((link, i) => (
                    <Link key={i} to={link.to} className="block text-white/60 hover:text-[#8F93A5] text-xs md:text-sm transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact + Partners */}
              <div className="space-y-5">
                {/* Contact */}
                <div>
                  <h4 className="text-base md:text-lg font-bold text-[#8F93A5] mb-3">{t('footer.contact_us')}</h4>
                  <div className="space-y-2 text-white/60 text-xs md:text-sm">
                    <div className="flex items-center justify-center md:justify-end gap-2">
                      <MapPin className="w-4 h-4 text-[#8F93A5]" />
                      <span>{t('footer.location')}</span>
                    </div>
                      <div className="flex gap-2">
      <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <a
        href="tel:+02010947354"
        dir="ltr"
        className="block text-left hover:text-white transition-colors duration-200 break-words"
        style={{ paddingLeft: '2px' }}
      >
        +966 54 309 8895
      </a>
    </div>
                    {/* Email */}
    <div className="flex gap-2">
      <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <a
        href="mailto:info@ufuq-digital.com"
        dir="ltr"
        className="block text-left hover:text-white transition-colors duration-200 break-words"
        style={{ paddingLeft: '2px' }}
      >
        info@ufuq-digital.com
      </a>
    </div>
                  </div>
                </div>

                {/* Partners */}
                <div>
                  <h4 className="text-sm md:text-base font-semibold text-white/70 mb-2">{t('footer.partners')}</h4>
                  <div className="flex justify-center md:justify-end gap-2">
                    <a href="https://salla.com/" target="_blank" rel="noopener noreferrer"
                       className="p-2.5 bg-[#25252f] border border-[#2a2a35] rounded-xl hover:border-[#8F93A5] hover:scale-105 transition-all duration-300">
                      <img src={salla} alt="Salla" className="h-7 object-contain" />
                    </a>
                    <a href="https://shopify.com/" target="_blank" rel="noopener noreferrer"
                       className="p-2.5 bg-[#25252f] border border-[#2a2a35] rounded-xl hover:border-[#8F93A5] hover:scale-105 transition-all duration-300">
                      <img src={shopify} alt="Shopify" className="h-7 object-contain" />
                    </a>
                    <a href="https://wordpress.com/" target="_blank" rel="noopener noreferrer"
                       className="p-2.5 bg-[#25252f] border border-[#2a2a35] rounded-xl hover:border-[#8F93A5] hover:scale-105 transition-all duration-300">
                      <img src={wordpress} alt="WordPress" className="h-7 object-contain" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <p className="text-white/80 text-xs md:text-sm font-medium text-center">
                    {t('footer.secure_payment_tagline')}
                  </p>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[
                      { label: 'Stripe', icon: FaStripe },
                      { label: 'Visa', icon: FaCcVisa },
                      { label: 'Mastercard', icon: FaCcMastercard },
                      { label: 'Apple Pay', icon: FaCcApplePay },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="w-12 h-12 bg-[#25252f] border border-[#2a2a35] rounded-xl flex items-center justify-center hover:border-[#8F93A5] hover:bg-[#2a2a35] hover:scale-105 transition-all duration-300"
                        aria-label={m.label}
                        title={m.label}
                      >
                        <m.icon className="w-8 h-8 text-[#8F93A5]" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#8F93A5]/20 to-transparent"></div>

            {/* Copyright */}
            <div className="text-center text-white/40 text-xs">
              <p>{t('footer.copyright')}</p>
              <p className="text-[10px] mt-1 opacity-60">{t('footer.tax_number')}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && !location.pathname.includes('/theme/') && (
        <button onClick={scrollToTop}
                className="fixed bottom-4 left-4 w-10 h-10 bg-gradient-to-r from-[#8F93A5] to-[#6c7081] rounded-full shadow-lg hover:scale-110 transition-all z-50 flex items-center justify-center md:hidden">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
    </>
  );
};

export default GlobalFooter;
