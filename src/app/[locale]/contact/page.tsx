import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'Contact the NFA',
    description: 'Get in touch with the National Fortification Alliance secretariat for processor support, partnership inquiries, and technical guidance.',
};

export default function ContactPage() {
    return (
        <>
            <style>{`
        /* GAIN / WFP inspired hero - big bold typography on a solid background */
        .contact-hero { background: var(--wfp-navy); color: #fff; padding: 5rem 0 4rem; position: relative; overflow: hidden; }
        .contact-hero::after { content: ''; position: absolute; right: -5%; top: -20%; width: 40%; height: 140%; background: var(--wfp-blue); opacity: 0.15; transform: rotate(-15deg); border-radius: 40px; pointer-events: none; }
        .contact-hero h1 { font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1rem; max-width: 700px; line-height: 1.1; }
        .contact-hero p { color: rgba(255,255,255,.8); max-width: 580px; line-height: 1.6; }

        /* Two column layout */
        .contact-layout { display: grid; grid-template-columns: 1fr 400px; gap: 4rem; padding: 4rem 0; align-items: start; }
        
        /* Contact Form */
        .form-panel { background: #fff; padding: 3rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); border: 1px solid var(--border-light); transform: translateY(-8rem); z-index: 10; position: relative; }
        .form-eyebrow { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--wfp-blue); letter-spacing: 0.1em; margin-bottom: 0.5rem; }
        .form-title { font-weight: 800; margin-bottom: 2rem; color: var(--text-primary); }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-grid.full { grid-template-columns: 1fr; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .form-control { width: 100%; padding: 0.85rem 1rem; font-family: inherit; font-size: 0.95rem; background: var(--bg-off); border: none; border-bottom: 2px solid var(--text-muted); border-radius: 4px 4px 0 0; transition: all 0.2s; color: var(--text-primary); }
        .form-control::placeholder { color: var(--color-gray-400); }
        .form-control:focus { outline: none; border-bottom-color: var(--wfp-blue); background: var(--wfp-blue-light); }
        textarea.form-control { resize: vertical; min-height: 140px; }

        /* Info Sidebar */
        .info-sidebar { padding-top: 1rem; }
        .info-group { margin-bottom: 3rem; }
        .info-group:last-child { margin-bottom: 0; }
        .info-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.08em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border); }
        .info-label-icon { color: var(--wfp-blue); font-size: 1.1rem; }
        
        .info-card { background: var(--bg-off); border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .info-detail { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }
        .info-detail strong { color: var(--text-primary); }
        
        .map-wrapper { width: 100%; aspect-ratio: 4/3; background: #e2e8f0; border-radius: var(--radius-md); overflow: hidden; position: relative; margin-top: 1.5rem; }

        /* FAQs */
        .faq-section { background: var(--bg-off); padding: 5rem 0; border-top: 1px solid var(--border); }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem; }
        .faq-item { background: #fff; padding: 2.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid transparent; transition: box-shadow 0.2s; }
        .faq-item:hover { box-shadow: var(--shadow-md); }
        .faq-q { font-weight: 700; color: var(--wfp-navy); margin-bottom: 0.75rem; }
        .faq-a { color: var(--text-secondary); line-height: 1.65; }

        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; gap: 2rem; }
          .form-panel { transform: none; margin-top: -3rem; }
          .form-grid { grid-template-columns: 1fr; gap: 1rem; }
          .faq-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}</style>

            {/* Hero */}
            <div className="contact-hero">
                <div className="container">
                    <div className="breadcrumb" style={{ marginBottom: '2rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,.6)' }}>Home</Link>
                        <span className="breadcrumb-sep" style={{ color: 'rgba(255,255,255,.3)' }}>›</span>
                        <span style={{ color: '#fff' }}>Contact</span>
                    </div>
                    <h1>Get in touch</h1>
                    <p>Whether you're looking for certification support, partnership opportunities, or media requests, our team at the National Fortification Alliance is here to help.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container" style={{ position: 'relative' }}>
                <div className="contact-layout">

                    {/* Form */}
                    <div className="form-panel">
                        <div className="form-eyebrow">Send a Message</div>
                        <h2 className="form-title">How can we help?</h2>

                        <ContactForm />
                    </div>

                    {/* Sidebar */}
                    <div className="info-sidebar">
                        <div className="info-group">
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="map-pin" size={18} /></span> NFA Secretariat</div>
                            <div className="info-detail">
                                <strong>World Food Programme Nigeria</strong>
                                <span>2nd Floor, UN House</span>
                                <span>Plot 617/618 Diplomatic Drive</span>
                                <span>Central Business District</span>
                                <span>Abuja, Nigeria</span>
                            </div>
                            <div className="map-wrapper">
                                {/* Fallback pattern for map */}
                                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>Map View</div>
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="mail" size={18} /></span> Direct Contacts</div>
                            <div className="info-card">
                                <div className="info-detail">
                                    <strong>General Inquiries</strong>
                                    <a href="mailto:info.ngo@wfp.org" style={{ color: 'var(--wfp-blue)', textDecoration: 'none' }}>info.ngo@wfp.org</a>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                                <div className="info-detail">
                                    <strong>Processor Support (NAFDAC)</strong>
                                    <a href="mailto:certification@nafdac.gov.ng" style={{ color: 'var(--wfp-blue)', textDecoration: 'none' }}>certification@nafdac.gov.ng</a>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                                <div className="info-detail">
                                    <strong>Media & Press</strong>
                                    <a href="mailto:media.nigeria@wfp.org" style={{ color: 'var(--wfp-blue)', textDecoration: 'none' }}>media.nigeria@wfp.org</a>
                                </div>
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="clock" size={18} /></span> Office Hours</div>
                            <div className="info-detail">
                                <span>Monday – Thursday: 8:00 AM – 4:30 PM</span>
                                <span>Friday: 8:00 AM – 1:30 PM</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>* Closed on Nigerian public holidays and UN official holidays.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <section className="faq-section">
                <div className="container">
                    <p className="section-eyebrow">Quick Answers</p>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <div className="faq-q">How do I start the NAFDAC certification process?</div>
                            <div className="faq-a">We recommend downloading the "Food Processor Certification Handbook" from our Guidelines page. It contains the application forms, compliance checklists, and contact details for the NAFDAC Food Safety Directorate.</div>
                        </div>
                        <div className="faq-item">
                            <div className="faq-q">Where can I source approved vitamin premixes?</div>
                            <div className="faq-a">The NFA partners with GAIN and trusted international suppliers to ensure high-quality premixes. Reach out via the contact form and select "Premix Supply" for an updated list of accredited vendors.</div>
                        </div>
                        <div className="faq-item">
                            <div className="faq-q">Is fortification mandatory in Nigeria?</div>
                            <div className="faq-a">Yes. Under the Food, Drugs and Related Products Regulation, the fortification of wheat flour, maize flour, vegetable oil, and sugar is mandatory for all registered commercial processors serving the Nigerian market.</div>
                        </div>
                        <div className="faq-item">
                            <div className="faq-q">How can NGOs collaborate with the NFA?</div>
                            <div className="faq-a">The NFA frequently collaborates with NGOs on consumer demand creation and grassroots nutrition awareness. Select "Partnership Inquiry" on the form to discuss alignment with current campaigns.</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
