'use client';

import { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import Icon, { IconName } from '@/components/Icon';
import type { NewsEvent } from '@/lib/api';

interface NewsFilterProps {
  allNews: NewsEvent[];
  categories: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  news: 'News', event: 'Events', communique: 'Communiqués', report: 'Reports',
};

const CATEGORY_EMPTY_ICONS: Record<string, IconName> = {
  news: 'newspaper', event: 'calendar', communique: 'scroll-text', report: 'bar-chart',
};

export default function NewsFilter({ allNews, categories }: NewsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredNews = activeCategory === 'all'
    ? allNews
    : allNews.filter(item => item.category === activeCategory);

  return (
    <>
      {/* Filter bar */}
      <div className="news-filter-bar">
        <div className="container">
          <div className="news-filter-inner">
            <span
              className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </span>
            {categories.map((c) => (
              <span
                key={c}
                className={`filter-chip ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <section className="section">
        <div className="container">
          {filteredNews.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p className="news-count" style={{ margin: 0 }}>
                Showing {filteredNews.length} of {allNews.length} items
              </p>
            </div>
          )}

          {filteredNews.length === 0 ? (
            <div className="news-empty">
              <div className="news-empty-icon">
                <Icon name={CATEGORY_EMPTY_ICONS[activeCategory] || 'newspaper'} size={28} />
              </div>
              <h3 className="news-empty-title">
                No {CATEGORY_LABELS[activeCategory] || activeCategory} yet
              </h3>
              <p className="news-empty-text">
                Check back soon — new {(CATEGORY_LABELS[activeCategory] || activeCategory).toLowerCase()} will appear here as they&apos;re published.
              </p>
              {activeCategory !== 'all' && (
                <button type="button" className="news-empty-reset" onClick={() => setActiveCategory('all')}>
                  View all news &amp; events
                </button>
              )}
            </div>
          ) : (
            <div className="grid-3">
              {filteredNews.map((article: NewsEvent) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
