import { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { getAllNews } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/about/governance',
    '/about/secretariat',
    '/partners',
    '/news',
    '/guidelines',
    '/initiatives',
    '/contact',
  ];

  // Generate URLs for all locales and static pages
  const staticUrls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      const pageUrl = locale === 'en' ? `${siteUrl}${page}` : `${siteUrl}/${locale}${page}`;

      staticUrls.push({
        url: pageUrl,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              loc === 'en' ? `${siteUrl}${page}` : `${siteUrl}/${loc}${page}`
            ])
          ),
        },
      });
    }
  }

  // Dynamic news articles
  const newsUrls: MetadataRoute.Sitemap = [];

  try {
    const { data: newsArticles } = await getAllNews(1, 100);

    for (const locale of locales) {
      for (const article of newsArticles) {
        const articleUrl = locale === 'en'
          ? `${siteUrl}/news/${article.slug}`
          : `${siteUrl}/${locale}/news/${article.slug}`;

        newsUrls.push({
          url: articleUrl,
          lastModified: new Date(article.publishedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              locales.map((loc) => [
                loc,
                loc === 'en'
                  ? `${siteUrl}/news/${article.slug}`
                  : `${siteUrl}/${loc}/news/${article.slug}`
              ])
            ),
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating news sitemap:', error);
  }

  return [...staticUrls, ...newsUrls];
}
