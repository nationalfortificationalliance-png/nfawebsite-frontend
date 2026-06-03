import type { Metadata } from 'next';
import Link from 'next/link';
import { getFAQs } from '@/lib/api';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions (FAQ) | National Fortification Alliance',
    description: 'Find answers to common questions about food fortification, NFA programs, certification requirements, and nutrition standards in Nigeria.',
};

export const revalidate = 60;

// Fallback FAQ data
const FALLBACK_FAQS = [
    {
        id: 1,
        documentId: 'faq-1',
        question: 'What is food fortification?',
        answer: 'Food fortification is the process of adding essential vitamins and minerals to commonly consumed foods to improve their nutritional value. In Nigeria, fortification is mandatory for wheat flour, vegetable oil, sugar, and salt to combat micronutrient deficiencies.',
        category: 'General',
        order: 1,
        is_active: true
    },
    {
        id: 2,
        documentId: 'faq-2',
        question: 'Which foods are mandated for fortification in Nigeria?',
        answer: 'Nigeria mandates fortification of six key food vehicles: wheat flour (with iron, folic acid, zinc, vitamin B12), vegetable oil (with vitamin A), sugar (with vitamin A), and salt (with iodine). These foods were chosen based on consumption patterns and their ability to reach large populations.',
        category: 'General',
        order: 2,
        is_active: true
    },
    {
        id: 3,
        documentId: 'faq-3',
        question: 'How do I become a certified fortification processor?',
        answer: 'To become certified, food processors must: (1) Register with NAFDAC, (2) Install appropriate fortification equipment, (3) Implement quality assurance and quality control systems, (4) Train staff on fortification protocols, (5) Pass NAFDAC facility inspections, and (6) Demonstrate consistent compliance through product testing.',
        category: 'Certification',
        order: 3,
        is_active: true
    },
    {
        id: 4,
        documentId: 'faq-4',
        question: 'What is the role of the National Fortification Alliance?',
        answer: 'The NFA serves as the coordination platform bringing together government agencies (NAFDAC, SON, FMoH), industry partners, development organizations (WFP, GAIN), academia, and civil society to strengthen Nigeria\'s food fortification program through policy advocacy, capacity building, monitoring, and stakeholder engagement.',
        category: 'About NFA',
        order: 4,
        is_active: true
    },
    {
        id: 5,
        documentId: 'faq-5',
        question: 'How can I verify if a product is properly fortified?',
        answer: 'Look for the NAFDAC fortification logo/seal on product packaging. Certified products must display this mark. Consumers can also report suspected non-compliance to NAFDAC through their hotline or the NFA secretariat.',
        category: 'General',
        order: 5,
        is_active: true
    },
    {
        id: 6,
        documentId: 'faq-6',
        question: 'Where can I access fortification guidelines and standards?',
        answer: 'All technical guidelines, regulatory standards, and compliance documents are available on our Guidelines page. This includes NAFDAC regulations, SON standards, WHO recommendations, and operational manuals for processors.',
        category: 'Resources',
        order: 6,
        is_active: true
    },
];

export default async function FAQPage() {
    const faqs = await getFAQs();
    const displayFAQs = faqs.length > 0 ? faqs : FALLBACK_FAQS;

    // Group FAQs by category
    const categories = Array.from(new Set(displayFAQs.map(faq => faq.category || 'General')));

    return (
        <>
            <style>{`
                .faq-hero {
                    background: var(--wfp-navy);
                    padding: 5rem 0 4rem;
                    text-align: center;
                    color: #fff;
                }
                .faq-hero h1 {
                    color: #fff;
                    margin-bottom: 1rem;
                }
                .faq-hero p {
                    color: rgba(255,255,255,0.8);
                    max-width: 600px;
                    margin: 0 auto;
                }
                .faq-category {
                    margin-bottom: 4rem;
                }
                .category-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    margin-bottom: 2rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 3px solid var(--wfp-blue-light);
                }
                .faq-item {
                    background: #fff;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    transition: all 0.3s;
                }
                .faq-item:hover {
                    box-shadow: var(--shadow-md);
                    border-color: var(--wfp-blue-light);
                }
                .faq-question {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }
                .faq-icon {
                    color: var(--wfp-blue);
                    flex-shrink: 0;
                    margin-top: 0.25rem;
                }
                .faq-answer {
                    color: var(--text-secondary);
                    line-height: 1.8;
                    padding-left: 2.25rem;
                }
                .cta-box {
                    background: var(--wfp-blue-light);
                    border: 2px solid var(--wfp-blue);
                    border-radius: var(--radius-lg);
                    padding: 3rem;
                    text-align: center;
                    margin-top: 4rem;
                }
                .cta-box h3 {
                    color: var(--wfp-navy);
                    margin-bottom: 1rem;
                }
                .cta-box p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }
            `}</style>

            {/* Hero */}
            <div className="faq-hero">
                <div className="container">
                    <div className="breadcrumb" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link>
                        <span className="breadcrumb-sep" style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
                        <span>FAQ</span>
                    </div>
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about food fortification and the National Fortification Alliance</p>
                </div>
            </div>

            {/* FAQ Content */}
            <section className="section">
                <div className="container" style={{ maxWidth: '900px' }}>
                    {categories.map((category) => {
                        const categoryFAQs = displayFAQs.filter(faq => (faq.category || 'General') === category);
                        return (
                            <div key={category} className="faq-category">
                                <h2 className="category-title">{category}</h2>
                                {categoryFAQs.map((faq) => (
                                    <div key={faq.id} className="faq-item">
                                        <div className="faq-question">
                                            <Icon name="help-circle" size={24} className="faq-icon" />
                                            <span>{faq.question}</span>
                                        </div>
                                        <div className="faq-answer">{faq.answer}</div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}

                    {/* CTA */}
                    <div className="cta-box">
                        <h3>Still have questions?</h3>
                        <p>Our team is here to help. Reach out to us for more information.</p>
                        <Link href="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
