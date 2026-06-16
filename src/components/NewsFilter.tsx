'use client';

import { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import type { NewsEvent } from '@/lib/api';

interface NewsFilterProps {
  allNews: NewsEvent[];
  categories: string[];
}

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
              <div className="news-empty-icon">📭</div>
              <p>No {activeCategory} items found.</p>
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
