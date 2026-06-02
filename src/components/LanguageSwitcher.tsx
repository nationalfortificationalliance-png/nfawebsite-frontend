'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');

    // Navigate to the same path with new locale
    router.push(`/${newLocale}${pathWithoutLocale || '/'}`);
  };

  return (
    <div className="language-switcher">
      <style>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }
        .language-select {
          background: white;
          border: 1px solid var(--color-gray-300);
          border-radius: 6px;
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-navy);
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23003366' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          transition: all 0.2s;
        }
        .language-select:hover {
          border-color: var(--color-primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .language-select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
        }
      `}</style>

      <select
        className="language-select"
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc as Locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
