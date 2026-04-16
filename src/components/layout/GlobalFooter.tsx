import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaFacebookF, FaSnapchatGhost, FaCcVisa, FaCcMastercard, FaCcApplePay, FaStripe, FaPaypal } from 'react-icons/fa';
import { ArrowUp, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { mockCategories } from '../../mock/categories';
import { createCategorySlug } from '../../utils/slugify';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';
import additionalLogo from '../../assets/2030.png';
import tabby from "../../assets/tabby.png";
import vat from "../../assets/vat.png";

const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

  .gf-root * { box-sizing: border-box; }

  @keyframes gf-rise {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .gf-root.visible { animation: gf-rise 0.8s cubic-bezier(0.2, 1, 0.2, 1) forwards; }

  @keyframes gf-shimmer {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  .gf-shimmer-text {
    background: linear-gradient(90deg, #c4c7d4, #ffffff, #c4c7d4);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gf-shimmer 4s ease infinite;
  }

  .gf-orb { animation: gf-orb 8s ease-in-out infinite; }

  .gf-social { transition: all .3s ease; }
  .gf-social:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(143,147,165,0.3) !important; }

  .gf-navlink { transition: all .25s ease; position: relative; }
  .gf-navlink:hover { color: white; padding-inline-start: 18px; }
  
  .gf-legal-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 12px 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  .gf-legal-card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(143, 147, 165, 0.2);
    transform: translateY(-2px);
  }

  .gf-vat-img {
    filter: drop-shadow(0 0 8px rgba(0, 195, 138, 0.1));
    transition: transform 0.3s ease;
  }
  .gf-vat-img:hover {
    transform: scale(1.1) rotate(2deg);
  }

  @media (max-width: 1024px) {
    .gf-bottom-flex {
      flex-direction: column;
      text-align: center;
      gap: 2rem;
    }
    .gf-legal-card {
        width: 100%;
        justify-content: center;
    }
  }

  /* ========== تحسينات الجزء السفلي للموبايل (جديدة) ========== */
  @media (max-width: 640px) {
    .gf-bottom-strip {
      flex-direction: column !important;
      align-items: center !important;
      gap: 1.5rem !important;
      text-align: center;
    }
    .gf-bottom-strip > div {
      width: 100%;
      justify-content: center;
    }
    .gf-legal-item {
      justify-content: center !important;
      text-align: center;
    }
    .gf-copyright {
      order: 3; /* يخلي الحقوق تظهر في الآخر */
      margin-top: 0.5rem;
    }
    .gf-commercial {
      order: 1;
    }
    .gf-tax {
      order: 2;
    }
  }
`;

const GlobalFooter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (footerRef.current) io.observe(footerRef.current);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const categoriesLinks = mockCategories.map((c) => ({
    to: `/service/${createCategorySlug(c.id, c.name)}`,
    label: isRTL ? c.name_ar ?? c.name : c.name,
  }));

  const quickLinks = [
    { name: t('footer.home'),                  to: '/' },
    { name: t('footer.our_work'),              to: '/portfolio' },
    { name: t('footer.blog'),                  to: '/blog' },
    { name: t('footer.contact_us'),            to: '/contact' },
    { name: t('footer.products'),              to: '/services' },
    { name: t('footer.privacy_policy'),        to: '/privacy-policy' },
    { name: t('footer.terms_conditions'),      to: '/terms-and-conditions' },
    { name: t('footer.refund_dispute_policy'), to: '/refund-and-dispute-policy' },
  ];

  const socials = [
    { href: 'https://www.instagram.com/ufuqdigital/',      Icon: FaInstagram,    label: 'Instagram' },
    { href: 'https://www.snapchat.com/@ufuqdigital',       Icon: FaSnapchatGhost, label: 'Snapchat' },
    { href: 'https://www.facebook.com/UfuqDigitalcom',     Icon: FaFacebookF,    label: 'Facebook' },
    { href: 'https://wa.me/966543098895',                  Icon: FaWhatsapp,     label: 'WhatsApp' },
  ];

  const sectionTitle =
    'text-[12px] font-bold tracking-[0.2em] uppercase text-white/90 mb-6 ' +
    'flex items-center gap-3 after:flex-1 after:h-px after:bg-gradient-to-r after:from-white/10 after:to-transparent after:content-[""]';

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link to={to} className="gf-navlink group flex items-center gap-2 text-white/50 text-[13px] py-1.5">
      <span className={`text-[#8f93a5] text-sm font-bold opacity-0 group-hover:opacity-100 transition-all ${isRTL ? 'ml-2' : 'mr-2'}`}>
        {isRTL ? '←' : '→'}
      </span>
      {label}
    </Link>
  );

  return (
    <>
      <style>{FOOTER_STYLES}</style>

      <footer
        ref={footerRef}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="gf-root relative w-full opacity-0 z-10"
        style={{
          background: 'radial-gradient(circle at 50% -20%, #1a1a25 0%, #111117 100%)',
          fontFamily: "'Tajawal', sans-serif",
        }}
      >
        {/* Background Decorative Orb */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="gf-orb absolute rounded-full" style={{ width: 600, height: 600, top: '-150px', [isRTL ? 'left' : 'right']: '10%', background: 'radial-gradient(circle, rgba(143,147,165,0.08) 0%, transparent 70%)' }} />
        </div>

        {/* Newsletter Section */}
        {location.pathname === '/' && (
          <div className="relative z-10 w-full border-b" style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-lg font-bold text-white mb-1.5 gf-shimmer-text">{t('footer.stay_connected')}</h3>
                <p className="text-[13px] text-white/50">{isRTL ? 'اشترك ونقّب عن أحدث العروض والمقالات الحصرية.' : 'Subscribe for exclusive offers and articles.'}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[450px]">
                <input type="email" placeholder={t('footer.email_placeholder')} className="gf-nl-input flex-1 px-5 py-3.5 rounded-xl text-[13px] text-white placeholder-white/30 outline-none bg-white/5 border border-white/10" />
                <button className="px-8 py-3.5 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-95 bg-gradient-to-br from-[#8f93a5] to-[#5c6070] shadow-lg">
                  {t('footer.subscribe_now')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 pt-16 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-12 xl:gap-10">
            
            {/* Logo & About */}
            <div className="flex flex-col gap-6 sm:col-span-2 xl:col-span-1">
              <a href="/"><img src={logo} alt="UfuqDigital" className="h-11 w-auto object-contain hover:scale-105 transition" /></a>
              <p className="text-[13px] leading-[1.8] text-white/40">
                {isRTL ? 'نصنع تجارب رقمية استثنائية تفوق التوقعات — نُجسّد رؤيتك واقعاً ملموساً.' : 'We craft exceptional digital experiences — making your vision reality.'}
              </p>
              <div className="flex gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="gf-social w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <Icon className="w-4 h-4 text-white/50" />
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-6 border-t border-white/5">
                <img src={additionalLogo} alt="Vision 2030" className="h-20 w-auto object-contain opacity-70" />
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className={sectionTitle}>{t('footer.quick_links')}</h4>
              <div className="flex flex-col gap-1">
                {quickLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} label={l.name} />
                ))}
              </div>
            </div>

            <div>
              <h4 className={sectionTitle}>{isRTL ? 'خدماتنا' : 'Services'}</h4>
              <div className="flex flex-col gap-1">
                {categoriesLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} label={l.label} />
                ))}
              </div>
            </div>

            {/* Contact & Map */}
            <div className="sm:col-span-2 xl:col-span-2 flex flex-col md:flex-row xl:flex-col gap-8">
              <div className="flex-1">
                <h4 className={sectionTitle}>{t('footer.contact_us')}</h4>
                <div className="flex flex-col gap-4">
                  {[
                    { Icon: MapPin, content: <span>{t('footer.location')}</span> },
                    { Icon: Phone, content: <a href="tel:++966535166370" dir="ltr" className="hover:text-white transition">+966535166370</a> },
                    { Icon: Mail, content: <a href="mailto:info@ufuq-digital.com" className="hover:text-white transition break-all">info@ufuq-digital.com</a> },
                  ].map(({ Icon, content }, i) => (
                    <div key={i} className="flex items-center gap-3.5 text-[13px] text-white/50">
                      <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#8f93a5]">
                        <Icon className="w-4 h-4" />
                      </span>
                      {content}
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://maps.app.goo.gl/PPaGaxxoxC5pzrFq8" target="_blank" rel="noopener noreferrer" className="gf-map-wrap block relative overflow-hidden rounded-2xl flex-1 xl:flex-none xl:h-44 border border-white/10 shadow-2xl">
                <iframe
                  title="Ufuq Location"
                  src="https://www.google.com/maps?q=24.771376,46.623678&z=15&output=embed"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: 'grayscale(0.6) brightness(0.7)', pointerEvents: 'none' }}
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 text-center py-2 text-[10px] tracking-widest uppercase text-white/70 font-bold bg-black/60 backdrop-blur-sm">
                  {isRTL ? 'اعثر علينا على الخريطة ↗' : 'Find us on Map ↗'}
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* الخط الفاصل */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* ========== الشريط السفلي المُعدل بالكامل ========== */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 py-10">
          <div className="flex flex-col gap-8">
            
            {/* بوابات الدفع (كما هي) */}
            <div className="gf-payments flex flex-wrap items-center justify-center gap-4">
              {[
                { label: 'Stripe', icon: FaStripe },
                { label: 'PayPal', icon: FaPaypal },
                { label: 'Visa', icon: FaCcVisa },
                { label: 'Mastercard', icon: FaCcMastercard },
                { label: 'Apple Pay', icon: FaCcApplePay },
              ].map((m) => (
                <div key={m.label} title={m.label} className="w-12 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all">
                  <m.icon className="w-7 h-7" />
                </div>
              ))}
              <div className="w-12 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 p-1.5 opacity-40 hover:opacity-100 transition">
                <img src="https://www.mada.com.sa/sites/mada/files/inline-images/logo-white.svg" alt="Mada" className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 p-1.5 opacity-40 hover:opacity-100 transition">
                <img src="https://cdn.prod.website-files.com/67c184892f7a84b971ff49d9/68931b4ae0847b7855db9432_tamara-text-logo-ar.svg" alt="Tamara" className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 p-1.5 opacity-40 hover:opacity-100 transition">
                <img src={tabby} alt="Tabby" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* العناصر الثلاثة (السجل - الضريبة - الحقوق) مرتبة حسب الطلب */}
            <div className="gf-bottom-strip flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
              
              {/* السجل التجاري - يظهر أولاً في الموبايل */}
              <div className="gf-commercial flex items-center gap-3">
                <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#8f93a5]">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider leading-none mb-0.5">
                    {isRTL ? 'السجل التجاري' : 'Commercial Register'}
                  </p>
                  <p dir="ltr" className="text-[13px] font-mono text-white/70 tracking-widest leading-none">1010234567</p>
                </div>
              </div>

              {/* الرقم الضريبي - يظهر ثانياً في الموبايل */}
              <div className="gf-tax flex items-center gap-3">
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider leading-none mb-0.5">
                    {isRTL ? 'الرقم الضريبي' : 'Tax Number (VAT)'}
                  </p>
                  <p dir="ltr" className="text-[13px] font-mono text-white/70 tracking-widest leading-none">312004226200003</p>
                </div>
                <img src={vat} alt="VAT" className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition" />
              </div>

              {/* الحقوق - تظهر أخيراً في الموبايل */}
              <div className="gf-copyright text-center">
                <p className="text-[12px] text-white/40 tracking-wide">
                  © {new Date().getFullYear()} <span className="text-white/80 font-bold tracking-widest uppercase">Ufuq Digital</span>
                </p>
                <p className="text-[10px] text-white/20 mt-0.5 uppercase tracking-[0.2em]">
                  {isRTL ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button onClick={scrollToTop} className={`gf-scroll-top fixed bottom-6 w-12 h-12 flex items-center justify-center rounded-2xl z-50 bg-gradient-to-br from-[#8f93a5] to-[#5c6070] text-white shadow-xl md:hidden ${isRTL ? 'right-6' : 'left-6'}`}>
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default GlobalFooter;