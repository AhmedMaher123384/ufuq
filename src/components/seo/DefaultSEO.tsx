import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const getSiteUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_SITE_URL as string | undefined;
  const fallback = 'https://ufuq-digital.com';
  if (envUrl && envUrl.trim()) return envUrl.trim();
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    if (origin.includes('localhost')) return fallback;
    return origin;
  }
  return fallback;
};

const DefaultSEO: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const siteUrl = getSiteUrl();
  const canonical = siteUrl + location.pathname;
  const currentLang = (i18n.language || 'en').toLowerCase().startsWith('en') ? 'en' : 'ar';

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: 'أفق الرقمية',
    alternateName: 'Ufuq Digital',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: 'أفق الرقمية',
    inLanguage: currentLang,
  };

  return (
    <Helmet defaultTitle="أفق الرقمية | حلول شركة رقمية متكاملة" titleTemplate="%s | أفق الرقمية" htmlAttributes={{ lang: currentLang, dir: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0b0e14" />
      <meta name="description" content="أفق الرقمية: حلول رقمية متكاملة، مواقع وتطبيقات وواجهات جذابة بأداء قوي." />
      <link rel="canonical" href={canonical} />

      {/* Hreflang alternates using i18n query param */}
      <link rel="alternate" hrefLang="ar" href={`${siteUrl}${location.pathname}?lng=ar`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}${location.pathname}?lng=en`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${location.pathname}`} />

      {/* Open Graph defaults */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="أفق الرقمية" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${siteUrl}/logo.png`} />

      {/* Twitter defaults */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/logo.png`} />

      {/* Organization & Website JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(organizationLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteLd)}</script>
    </Helmet>
  );
};

export default DefaultSEO;
