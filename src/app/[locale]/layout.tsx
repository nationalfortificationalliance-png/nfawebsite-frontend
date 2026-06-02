import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getGlobalSettings } from "@/lib/api";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      template: "%s | National Fortification Alliance",
      default: "National Fortification Alliance – Nourishing Nigeria",
    },
    description:
      "The National Fortification Alliance (NFA) coordinates food fortification programs in Nigeria to eliminate micronutrient malnutrition.",
    keywords: ["food fortification", "Nigeria", "WFP", "NAFDAC", "nutrition", "NFA"],
    openGraph: {
      type: "website",
      locale: locale === 'en' ? 'en_NG' : `${locale}_NG`,
      siteName: "National Fortification Alliance",
    },
  };
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
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getGlobalSettings();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header siteName={settings?.site_name || "National Fortification Alliance"} />
          <main>{children}</main>
          <Footer settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
