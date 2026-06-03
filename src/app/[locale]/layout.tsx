import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getGlobalSettings } from "@/lib/api";
import { generateSEOMetadata, generateOrganizationSchema, generateWebSiteSchema, generateGovernmentOrganizationSchema } from '@/components/SEO';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';

  const canonicalUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`;

  return generateSEOMetadata({
    title: 'Combating Hidden Hunger Through Food Fortification',
    description: 'The National Fortification Alliance (NFA) is a multi-sectoral coordination platform driving Nigeria\'s food fortification programme to eliminate micronutrient deficiencies and improve public health outcomes through strengthened collaboration, regulatory support, and quality assurance systems.',
    keywords: [
      'food fortification Nigeria',
      'micronutrient deficiency',
      'vitamin A fortification',
      'iron fortification',
      'zinc fortification',
      'iodized salt',
      'fortified wheat flour',
      'fortified vegetable oil',
      'hidden hunger Nigeria',
      'malnutrition prevention',
      'NAFDAC',
      'SON standards',
      'nutrition policy Nigeria',
      'public health intervention',
    ],
    canonical: canonicalUrl,
    locale,
    alternateLocales: locales.map((loc) => ({
      locale: loc,
      url: loc === 'en' ? siteUrl : `${siteUrl}/${loc}`,
    })),
    ogType: 'website',
  });
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getGlobalSettings();

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const govOrgSchema = generateGovernmentOrganizationSchema();

  return (
    <html lang={locale}>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(govOrgSchema) }}
        />

        {/* Google Fonts - Montserrat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://nfawebsite-backend-production.up.railway.app" />
        <link rel="dns-prefetch" href="https://nfawebsite-backend-production.up.railway.app" />

        {/* Favicon and Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ED1C24" />
      </head>
      <body>
        <PageTransition />
        <NextIntlClientProvider messages={messages}>
          <Header siteName={settings?.site_name || "National Fortification Alliance"} />
          <main>{children}</main>
          <Footer settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
