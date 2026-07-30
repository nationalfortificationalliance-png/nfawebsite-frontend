'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { incrementFaqView, type FAQ } from '@/lib/api';
import { CATEGORY_META, CATEGORY_ORDER, CATEGORY_QUICK_LINKS } from '@/lib/faq-data';

interface FAQAccordionProps {
    faqs: FAQ[];
}

// Curated suggestions, not live search analytics — these are the topic
// keywords from the FAQ content itself, offered as quick-start search chips.
const POPULAR_SEARCH_TERMS = ['fortification', 'certification', 'premix', 'standards', 'consumer', 'laboratory'];

const MOST_VIEWED_COUNT = 5;
const RELATED_COUNT = 3;

function slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderAnswer(answer: string) {
    const lines = answer.split('\n').filter((line) => line.trim().length > 0);
    const blocks: React.ReactNode[] = [];
    let bulletBuffer: string[] = [];

    const flushBullets = (key: string) => {
        if (bulletBuffer.length === 0) return;
        blocks.push(
            <ul key={key} className="faq-answer-list">
                {bulletBuffer.map((item, idx) => <li key={idx}>{item.replace(/^•\s*/, '')}</li>)}
            </ul>
        );
        bulletBuffer = [];
    };

    lines.forEach((line, idx) => {
        if (line.trim().startsWith('•')) {
            bulletBuffer.push(line.trim());
        } else {
            flushBullets(`bullets-${idx}`);
            blocks.push(<p key={idx}>{line}</p>);
        }
    });
    flushBullets('bullets-end');

    return blocks;
}

function formatDate(dateStr?: string): string | null {
    if (!dateStr) return null;
    try {
        return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return null;
    }
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<Record<number, 'yes' | 'no'>>({});
    const [navTop, setNavTop] = useState(0);
    const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        if (openId === null) return;
        itemRefs.current[openId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [openId]);

    useEffect(() => {
        const updateNavTop = () => {
            const header = document.querySelector('.site-header');
            setNavTop(header ? header.getBoundingClientRect().height : 0);
        };
        updateNavTop();
        window.addEventListener('resize', updateNavTop);
        return () => window.removeEventListener('resize', updateNavTop);
    }, []);

    const presentCategories = useMemo(() => {
        const found = Array.from(new Set(faqs.map((f) => f.category || 'General')));
        const ordered = CATEGORY_ORDER.filter((c) => found.includes(c));
        const extra = found.filter((c) => !CATEGORY_ORDER.includes(c));
        return [...ordered, ...extra];
    }, [faqs]);

    const normalizedQuery = query.trim().toLowerCase();
    const filteredFaqs = useMemo(() => {
        if (!normalizedQuery) return faqs;
        return faqs.filter((faq) =>
            faq.question.toLowerCase().includes(normalizedQuery) ||
            faq.answer.toLowerCase().includes(normalizedQuery) ||
            (faq.category || '').toLowerCase().includes(normalizedQuery)
        );
    }, [faqs, normalizedQuery]);

    const isSearching = normalizedQuery.length > 0;

    const mostViewed = useMemo(() => {
        return faqs
            .filter((f) => (f.view_count || 0) > 0)
            .slice()
            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
            .slice(0, MOST_VIEWED_COUNT);
    }, [faqs]);

    const toggleFaq = (id: number) => {
        setOpenId((prev) => {
            if (prev === id) return null;
            const faq = faqs.find((f) => f.id === id);
            if (faq) incrementFaqView(faq.documentId);
            return id;
        });
    };

    const openFaq = (id: number) => {
        const faq = faqs.find((f) => f.id === id);
        if (faq) incrementFaqView(faq.documentId);
        // Clear any active search filter first — otherwise the target FAQ
        // may not be in the filtered list and this would silently no-op.
        setQuery('');
        setOpenId(id);
    };

    const setHelpful = (id: number, value: 'yes' | 'no') => {
        setFeedback((prev) => ({ ...prev, [id]: value }));
        try {
            localStorage.setItem(`faq-helpful-${id}`, value);
        } catch {
            // localStorage unavailable — feedback still reflected in UI state
        }
    };

    const renderFaqItem = (faq: FAQ) => {
        const isOpen = openId === faq.id;
        const lastUpdated = formatDate(faq.updatedAt);
        const alreadyRated = feedback[faq.id];
        const related = isOpen
            ? faqs.filter((f) => f.id !== faq.id && (f.category || 'General') === (faq.category || 'General')).slice(0, RELATED_COUNT)
            : [];

        return (
            <div key={faq.id} ref={(el) => { itemRefs.current[faq.id] = el; }} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                    type="button"
                    className="faq-question-btn"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    onClick={() => toggleFaq(faq.id)}
                >
                    <Icon name="help-circle" size={22} className="faq-icon" />
                    <span className="faq-question-text">{faq.question}</span>
                    <Icon name="arrow-right" size={18} className="faq-chevron" />
                </button>
                {isOpen && (
                    <div id={`faq-panel-${faq.id}`} className="faq-answer-panel" role="region">
                        <div className="faq-answer">{renderAnswer(faq.answer)}</div>

                        {lastUpdated && (
                            <div className="faq-updated">
                                <Icon name="clock" size={13} /> Last updated: {lastUpdated}
                            </div>
                        )}

                        <div className="faq-helpful">
                            {alreadyRated ? (
                                <span className="faq-helpful-thanks">Thanks for your feedback!</span>
                            ) : (
                                <>
                                    <span>Was this helpful?</span>
                                    <button type="button" onClick={() => setHelpful(faq.id, 'yes')} aria-label="Yes, this was helpful">Yes</button>
                                    <button type="button" onClick={() => setHelpful(faq.id, 'no')} aria-label="No, this was not helpful">No</button>
                                </>
                            )}
                        </div>

                        {related.length > 0 && (
                            <div className="faq-related">
                                <span className="faq-related-label">Related questions</span>
                                <ul>
                                    {related.map((r) => (
                                        <li key={r.id}>
                                            <button type="button" onClick={() => openFaq(r.id)}>
                                                {r.question}
                                                <Icon name="arrow-right" size={13} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <style>{`
                .faq-search-wrap { position: relative; margin-bottom: 1.5rem; }
                .faq-search-icon { position: absolute; left: 1.35rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
                .faq-search-input {
                    width: 100%; padding: 1.05rem 3rem 1.05rem 3.5rem; font-size: 1.05rem;
                    font-family: inherit; color: var(--text-primary);
                    background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius-full);
                    box-shadow: var(--shadow-sm);
                    transition: border-color .2s, box-shadow .2s;
                    -webkit-appearance: none; appearance: none;
                }
                .faq-search-input::placeholder { color: var(--text-muted); }
                .faq-search-input:hover { border-color: #cbd5e1; }
                .faq-search-input:focus-visible, .faq-search-input:focus {
                    outline: none; border-color: var(--wfp-blue);
                    box-shadow: 0 0 0 4px var(--wfp-blue-light);
                }
                .faq-search-clear {
                    position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
                    width: 26px; height: 26px; border-radius: 50%; border: none;
                    background: var(--bg-off); color: var(--text-secondary);
                    font-size: 1.2rem; line-height: 1; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all .2s;
                }
                .faq-search-clear:hover { background: var(--wfp-blue-light); color: var(--wfp-blue); }
                .faq-search-clear:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: 1px; }
                .faq-search-hint { margin-top: 0.75rem; font-size: 0.88rem; color: var(--text-secondary); }
                .faq-popular-terms {
                    display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
                    margin-top: 0.85rem; font-size: 0.85rem; color: var(--text-secondary);
                }
                .faq-popular-terms button {
                    padding: 0.3rem 0.8rem; border-radius: 100px; border: 1px solid var(--border);
                    background: #fff; color: var(--text-primary); font-size: 0.82rem; font-weight: 600;
                    cursor: pointer; transition: all .2s;
                }
                .faq-popular-terms button:hover { border-color: var(--wfp-blue); color: var(--wfp-blue); background: var(--wfp-blue-light); }
                .faq-popular-terms button:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: 1px; }

                .faq-most-viewed {
                    background: var(--bg-off); border: 1px solid var(--border); border-radius: var(--radius-lg);
                    padding: 1.5rem 1.75rem; margin-bottom: 2rem;
                }
                .faq-most-viewed-title {
                    display: flex; align-items: center; gap: 0.5rem;
                    font-size: 1.05rem; font-weight: 700; color: var(--wfp-blue); margin-bottom: 0.9rem;
                }
                .faq-most-viewed ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
                .faq-most-viewed button, .faq-related button {
                    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
                    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
                    padding: 0.5rem 0; color: var(--text-primary); font-size: 0.92rem; font-weight: 600;
                }
                .faq-most-viewed button:hover, .faq-related button:hover { color: var(--wfp-blue); }
                .faq-most-viewed button:focus-visible, .faq-related button:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: 2px; }

                .faq-related {
                    margin-top: 1.25rem; padding-top: 1.1rem; border-top: 1px dashed var(--border);
                }
                .faq-related-label { display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-secondary); margin-bottom: 0.4rem; }
                .faq-related ul { list-style: none; margin: 0; padding: 0; }
                .faq-related li { border-bottom: 1px solid var(--border); }
                .faq-related li:last-child { border-bottom: none; }

                .faq-cat-nav {
                    position: sticky; top: 0; z-index: 5; background: #fff;
                    display: flex; flex-wrap: wrap; gap: 0.5rem;
                    padding: 1rem 0; margin-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }
                .faq-cat-nav-link {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.5rem 0.9rem; border-radius: 100px;
                    background: var(--bg-off); color: var(--text-primary);
                    font-size: 0.88rem; font-weight: 600; white-space: nowrap;
                    border: 1px solid transparent; transition: all .2s;
                }
                .faq-cat-nav-link:hover { background: var(--wfp-blue-light); border-color: var(--wfp-blue-light); }
                .faq-cat-nav-link:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: 2px; }

                .faq-category { margin-bottom: 3.5rem; scroll-margin-top: 170px; }
                .category-title {
                    font-size: 1.6rem; font-weight: 700; color: var(--wfp-blue);
                    margin-bottom: 1.75rem; padding-bottom: 0.75rem;
                    border-bottom: 3px solid var(--wfp-blue-light);
                    display: flex; align-items: center; gap: 0.6rem;
                }

                .faq-item {
                    background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg);
                    margin-bottom: 1rem; transition: box-shadow .25s, border-color .25s;
                    overflow: hidden;
                }
                .faq-item:hover, .faq-item.is-open { box-shadow: var(--shadow-md); border-color: var(--wfp-blue-light); }

                .faq-question-btn {
                    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
                    display: flex; align-items: flex-start; gap: 0.75rem;
                    padding: 1.5rem 1.75rem; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);
                }
                .faq-question-btn:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: -2px; }
                .faq-icon { color: var(--wfp-blue); flex-shrink: 0; margin-top: 0.15rem; }
                .faq-question-text { flex: 1; line-height: 1.5; }
                .faq-chevron { flex-shrink: 0; margin-top: 0.2rem; color: var(--text-secondary); transition: transform .25s; transform: rotate(0deg); }
                .faq-item.is-open .faq-chevron { transform: rotate(90deg); color: var(--wfp-blue); }

                .faq-answer-panel { padding: 0 1.75rem 1.75rem 3.2rem; }
                .faq-answer { color: var(--text-secondary); line-height: 1.8; }
                .faq-answer p { margin: 0 0 0.85rem; }
                .faq-answer p:last-child { margin-bottom: 0; }
                .faq-answer-list { margin: 0 0 0.85rem; padding-left: 1.2rem; }
                .faq-answer-list li { margin-bottom: 0.35rem; }

                .faq-updated {
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);
                }

                .faq-quick-links { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: -1rem 0 1.75rem; }
                .faq-quick-link {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.45rem 0.85rem; border-radius: 100px;
                    background: var(--wfp-blue-light); color: var(--wfp-blue);
                    font-size: 0.85rem; font-weight: 600; transition: all .2s;
                }
                .faq-quick-link:hover { background: var(--wfp-blue); color: #fff; }
                .faq-quick-link:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: 2px; }

                .faq-helpful {
                    display: flex; align-items: center; gap: 0.75rem; margin-top: 1.25rem;
                    padding-top: 1.1rem; border-top: 1px dashed var(--border);
                    font-size: 0.88rem; color: var(--text-secondary);
                }
                .faq-helpful button {
                    padding: 0.3rem 0.85rem; border-radius: 6px; border: 1px solid var(--border);
                    background: #fff; cursor: pointer; font-weight: 600; font-size: 0.85rem;
                    transition: all .2s;
                }
                .faq-helpful button:hover { border-color: var(--wfp-blue); color: var(--wfp-blue); }
                .faq-helpful button:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: 1px; }
                .faq-helpful-thanks { color: var(--wfp-green, #008751); font-weight: 600; }

                .faq-no-results { text-align: center; padding: 3rem 1rem; color: var(--text-secondary); }

                @media (max-width: 640px) {
                    .faq-answer-panel { padding-left: 1.75rem; }
                    .faq-cat-nav { position: static; }
                }
            `}</style>

            <div className="faq-search-wrap">
                <Icon name="search" size={18} className="faq-search-icon" />
                <input
                    type="text"
                    className="faq-search-input"
                    placeholder="Search FAQs — e.g. fortification, certification, premix, standards, laboratory..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search frequently asked questions"
                />
                {isSearching && (
                    <button type="button" className="faq-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                        &times;
                    </button>
                )}
                {isSearching && (
                    <p className="faq-search-hint">
                        {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                    </p>
                )}
                {!isSearching && (
                    <div className="faq-popular-terms">
                        <span>Popular:</span>
                        {POPULAR_SEARCH_TERMS.map((term) => (
                            <button key={term} type="button" onClick={() => setQuery(term)}>{term}</button>
                        ))}
                    </div>
                )}
            </div>

            {!isSearching && mostViewed.length > 0 && (
                <div className="faq-most-viewed">
                    <h2 className="faq-most-viewed-title">
                        <Icon name="trending-up" size={18} /> Most Viewed Questions
                    </h2>
                    <ul>
                        {mostViewed.map((faq) => (
                            <li key={faq.id}>
                                <button type="button" onClick={() => openFaq(faq.id)}>
                                    {faq.question}
                                    <Icon name="arrow-right" size={13} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!isSearching && (
                <nav className="faq-cat-nav" aria-label="FAQ categories" style={{ top: navTop }}>
                    {presentCategories.map((category) => {
                        const meta = CATEGORY_META[category] || { icon: 'help-circle', slug: slugify(category) };
                        return (
                            <a key={category} href={`#faq-${meta.slug}`} className="faq-cat-nav-link">
                                <Icon name={meta.icon} size={15} />
                                {category}
                            </a>
                        );
                    })}
                </nav>
            )}

            {isSearching ? (
                filteredFaqs.length > 0 ? (
                    <div className="faq-category">
                        {filteredFaqs.map((faq) => renderFaqItem(faq))}
                    </div>
                ) : (
                    <div className="faq-no-results">
                        <Icon name="search" size={32} />
                        <p>No FAQs match &ldquo;{query}&rdquo;. Try a different keyword, or <Link href="/contact">contact the Secretariat</Link>.</p>
                    </div>
                )
            ) : (
                presentCategories.map((category) => {
                    const meta = CATEGORY_META[category] || { icon: 'help-circle', slug: slugify(category) };
                    const categoryFaqs = faqs.filter((f) => (f.category || 'General') === category);
                    const links = CATEGORY_QUICK_LINKS[category] || [];
                    return (
                        <div key={category} id={`faq-${meta.slug}`} className="faq-category">
                            <h2 className="category-title">
                                <Icon name={meta.icon} size={22} />
                                {category}
                            </h2>
                            {links.length > 0 && (
                                <div className="faq-quick-links">
                                    {links.map((link) => {
                                        const isExternal = /^https?:\/\//.test(link.href);
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="faq-quick-link"
                                                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                            >
                                                <Icon name={link.icon} size={14} />
                                                {link.label}
                                                <Icon name="arrow-right" size={12} />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                            {categoryFaqs.map((faq) => renderFaqItem(faq))}
                        </div>
                    );
                })
            )}
        </>
    );
}
