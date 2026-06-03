import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'ha', 'ig', 'yo'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ha: 'Hausa',
  ig: 'Igbo',
  yo: 'Yorùbá',
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the locale to resolve
  let locale = await requestLocale;

  console.log('[i18n] Requested locale:', locale);

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    console.log('[i18n] Invalid locale, using default');
    locale = 'en';
  }

  console.log('[i18n] Loading messages for locale:', locale);
  const messages = (await import(`../messages/${locale}.json`)).default;
  console.log('[i18n] Messages loaded successfully');

  return {
    locale: locale,
    messages,
  };
});
