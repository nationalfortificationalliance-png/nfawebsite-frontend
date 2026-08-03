import type { Metadata } from 'next';
import Link from 'next/link';
import { getFAQs, getContactPage } from '@/lib/api';
import Icon from '@/components/Icon';
import FAQAccordion from '@/components/FAQAccordion';
import FAQAskForm from '@/components/FAQAskForm';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions (FAQ) | National Fortification Alliance',
    description: 'Find answers to common questions about food fortification, NFA programs, certification requirements, and nutrition standards in Nigeria.',
};

export const revalidate = 60;

export default async function FAQPage() {
    const [displayFAQs, contact] = await Promise.all([getFAQs(), getContactPage()]);

    const categoryCount = new Set(displayFAQs.map((f) => f.category || 'General')).size;

    const emailContacts = contact?.email_contacts || [];
    const phoneContacts = contact?.phone_contacts || [];
    const officeAddress = [contact?.address_line_1, contact?.address_line_2, contact?.address_line_3, contact?.address_line_4]
        .filter(Boolean)
        .join(', ');

    return (
        <>
            <style>{`
                /* Stats panel */
                .faq-stats-panel {
                    position: relative; z-index: 3;
                    background: #fff; border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    margin: -2.5rem auto 3rem;
                    max-width: 900px;
                    display: grid; grid-template-columns: repeat(3, 1fr);
                }
                .faq-stat {
                    text-align: center; padding: 1.5rem 1rem;
                    border-right: 1px solid var(--border);
                }
                .faq-stat:last-child { border-right: none; }
                .faq-stat-value { font-size: 1.75rem; font-weight: 800; color: var(--wfp-blue); line-height: 1.2; }
                .faq-stat-label { font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; }

                .faq-end-section {
                    margin-top: 4rem;
                    padding-top: 3rem;
                    border-top: 1px solid var(--border);
                    text-align: center;
                }
                .faq-end-section + .faq-end-section {
                    margin-top: 3rem;
                }
                .faq-end-section h3 {
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
                .faq-end-section > p {
                    color: var(--text-secondary);
                    margin-bottom: 2.25rem;
                }
                .cta-options {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.75rem; margin: 0 auto 2.5rem; max-width: 760px; text-align: left;
                }
                .cta-option {
                    display: flex; align-items: flex-start; gap: 0.65rem;
                }
                .cta-option-icon { color: var(--wfp-blue); flex-shrink: 0; margin-top: 0.15rem; }
                .cta-option-label { font-size: 0.78rem; font-weight: 600; color: var(--text-muted); }
                .cta-option-value { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-word; }
                .cta-option-value a { color: inherit; }
                .cta-option-value a:hover { color: var(--wfp-blue); }

                @media (max-width: 640px) {
                    .faq-stats-panel { grid-template-columns: 1fr; margin-top: -1.5rem; }
                    .faq-stat { border-right: none; border-bottom: 1px solid var(--border); }
                    .faq-stat:last-child { border-bottom: none; }
                }
            `}</style>

            <PageHero
                image={{ src: '/faq-hero.jpeg', alt: 'National Fortification Alliance stakeholders' }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
                title="Frequently Asked Questions"
                description="Find answers to common questions about food fortification and the National Fortification Alliance"
            />

            {/* Stats panel */}
            <div className="container">
                <div className="faq-stats-panel">
                    <div className="faq-stat">
                        <div className="faq-stat-value">{displayFAQs.length}+</div>
                        <div className="faq-stat-label">Frequently Asked Questions</div>
                    </div>
                    <div className="faq-stat">
                        <div className="faq-stat-value">{categoryCount}</div>
                        <div className="faq-stat-label">Information Categories</div>
                    </div>
                    <div className="faq-stat">
                        <div className="faq-stat-value">
                            <Icon name="clock" size={22} />
                        </div>
                        <div className="faq-stat-label">Updated Regularly</div>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <FAQAccordion faqs={displayFAQs} />

                    {/* CTA */}
                    <div className="faq-end-section">
                        <h3>Still have questions?</h3>
                        <p>Our team is here to help. Reach out to us for more information.</p>

                        <div className="cta-options">
                            {emailContacts[0]?.email && (
                                <div className="cta-option">
                                    <Icon name="mail" size={20} className="cta-option-icon" />
                                    <div>
                                        <div className="cta-option-label">Email</div>
                                        <div className="cta-option-value"><a href={`mailto:${emailContacts[0].email}`}>{emailContacts[0].email}</a></div>
                                    </div>
                                </div>
                            )}
                            {phoneContacts[0]?.phone && (
                                <div className="cta-option">
                                    <Icon name="phone" size={20} className="cta-option-icon" />
                                    <div>
                                        <div className="cta-option-label">Telephone</div>
                                        <div className="cta-option-value"><a href={`tel:${phoneContacts[0].phone.replace(/[^0-9+]/g, '')}`}>{phoneContacts[0].phone}</a></div>
                                    </div>
                                </div>
                            )}
                            <div className="cta-option">
                                <Icon name="file-text" size={20} className="cta-option-icon" />
                                <div>
                                    <div className="cta-option-label">Contact Form</div>
                                    <div className="cta-option-value"><Link href="/contact">Send a message</Link></div>
                                </div>
                            </div>
                            {officeAddress && (
                                <div className="cta-option">
                                    <Icon name="map-pin" size={20} className="cta-option-icon" />
                                    <div>
                                        <div className="cta-option-label">Secretariat Office</div>
                                        <div className="cta-option-value">{officeAddress}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
                    </div>

                    {/* Didn't find your answer? */}
                    <div className="faq-end-section">
                        <h3>Didn&apos;t find your answer?</h3>
                        <p>Send us your question directly and the Secretariat will respond by email.</p>
                        <FAQAskForm />
                    </div>
                </div>
            </section>
        </>
    );
}
