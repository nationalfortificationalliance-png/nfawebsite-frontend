import { getRequestConfig } from 'next-intl/server';

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

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale: locale,
    messages,
  };
});
