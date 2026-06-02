import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  locale = 'en',
  alternateLocales = [],
}: SEOProps): Metadata {
  const siteName = 'National Fortification Alliance Nigeria';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';

  // Default keywords
  const defaultKeywords = [
    'food fortification',
    'Nigeria',
    'micronutrient deficiency',
    'nutrition',
    'fortified foods',
    'NFA',
    'National Fortification Alliance',
    'vitamin A',
    'iron fortification',
    'iodized salt',
    'NAFDAC',
    'SON',
    'public health Nigeria',
    'malnutrition prevention',
    'food security Nigeria',
  ];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  const fullTitle = `${title} | ${siteName}`;
  const imageUrl = ogImage || `${siteUrl}/og-default.png`;

  return {
    title: fullTitle,
    description: description,
    keywords: allKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,

    // Canonical URL
    alternates: {
      canonical: canonical || siteUrl,
      languages: Object.fromEntries(
        alternateLocales.map(({ locale, url }) => [locale, url])
      ),
    },

    // Open Graph
    openGraph: {
      type: ogType,
      locale: locale === 'en' ? 'en_NG' : `${locale}_NG`,
      url: canonical || siteUrl,
      siteName: siteName,
      title: fullTitle,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@NFA_Nigeria',
      creator: '@NFA_Nigeria',
      title: fullTitle,
      description: description,
      images: [imageUrl],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },

    // Other
    category: 'Health & Nutrition',
    classification: 'Government Organization',
  };
}

// JSON-LD Structured Data Generator
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'National Fortification Alliance Nigeria',
    alternateName: 'NFA Nigeria',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: 'The National Fortification Alliance coordinates food fortification programs in Nigeria to eliminate micronutrient malnutrition and improve public health.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Abuja',
      addressRegion: 'FCT',
    },
    sameAs: [
      'https://twitter.com/NFA_Nigeria',
      'https://facebook.com/NFANigeria',
      'https://linkedin.com/company/nfa-nigeria',
    ],
    memberOf: {
      '@type': 'Organization',
      name: 'Federal Government of Nigeria',
    },
  };
}

export function generateWebSiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'National Fortification Alliance Nigeria',
    url: siteUrl,
    description: 'Official website of the National Fortification Alliance Nigeria - coordinating food fortification efforts to improve public health.',
    inLanguage: ['en', 'ha', 'ig', 'yo'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema({
  title,
  description,
  publishedDate,
  modifiedDate,
  imageUrl,
  authorName = 'National Fortification Alliance',
  url,
}: {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  imageUrl?: string;
  authorName?: string;
  url: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: imageUrl || `${siteUrl}/og-default.png`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'National Fortification Alliance Nigeria',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateGovernmentOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'National Fortification Alliance Nigeria',
    description: 'Multi-sectoral coordination platform for food fortification in Nigeria',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app',
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: 'Public Health & Nutrition',
  };
}
