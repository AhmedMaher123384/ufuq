import React from 'react';
import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  structuredData?: any | any[];
};

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

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  image,
  noIndex,
  structuredData,
}) => {
  const siteUrl = getSiteUrl();
  const canonical = siteUrl + (path || (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const ogImage = image || '/logo.png';

  const sdArray = Array.isArray(structuredData)
    ? structuredData
    : structuredData
    ? [structuredData]
    : [];

  return (
    <Helmet title={title} titleTemplate="%s | أفق الرقمية">
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="أفق الرقمية" />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* JSON-LD Structured Data */}
      {sdArray.map((obj, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;