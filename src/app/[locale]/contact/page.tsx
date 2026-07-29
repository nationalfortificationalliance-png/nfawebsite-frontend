import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import ContactForm from '@/components/ContactForm';
import { getContactPage, getStrapiMediaUrl } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Contact the NFA',
    description: 'Get in touch with the National Fortification Alliance secretariat for processor support, partnership inquiries, and technical guidance.',
};

export default async function ContactPage() {
    const contactData = await getContactPage();

    // Fallback data
    const heroTitle = contactData?.hero_title || 'Get in touch';
    const heroDescription = contactData?.hero_description || "Whether you're looking for certification support, partnership opportunities, or media requests, our team at the National Fortification Alliance is here to help.";
    const heroImage = contactData?.hero_image ? getStrapiMediaUrl(contactData.hero_image.url) : '/about-hero.jpg';

    const officeName = contactData?.office_name || 'NAFDAC Office';
    const addressLines = [
        contactData?.address_line_1 || 'NAFDAC Office',
        contactData?.address_line_2 || 'Plot 2032, Olusegun Obasanjo Way',
        contactData?.address_line_3 || 'Wuse Zone 7',
        contactData?.address_line_4 || 'Abuja, Federal Capital Territory',
        contactData?.address_line_5 || 'Nigeria'
    ].filter(Boolean);

    const emailContacts = contactData?.email_contacts || [
        { label: 'General Inquiries', email: 'info.ngo@wfp.org' },
        { label: 'Processor Support (NAFDAC)', email: 'certification@nafdac.gov.ng' },
        { label: 'Media & Press', email: 'media.nigeria@wfp.org' }
    ];

    const phoneContacts = contactData?.phone_contacts || [
        { label: 'NFA Secretariat', phone: '08099837920' },
        { label: 'NFA Secretariat', phone: '08035171719' },
        { label: 'NFA Secretariat', phone: '08065217543' }
    ];

    const officeHours = contactData?.office_hours || 'Monday – Thursday: 8:00 AM – 4:30 PM\nFriday: 8:00 AM – 1:30 PM';
    const officeHoursNote = contactData?.office_hours_note || '* Closed on Nigerian public holidays and UN official holidays.';

    return (
        <>
            <style>{`
        /* Hero with Image */
        .contact-hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .contact-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .contact-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
          z-index: 1;
        }
        .contact-hero-content {
          position: relative;
          z-index: 2;
          padding: 3.5rem 0 2.75rem;
        }
        .contact-hero h1 {
          color: #fff;
          max-width: 720px;
          margin-bottom: 1rem;
        }
        .contact-hero p {
          color: rgba(255,255,255,0.95);
          max-width: 720px;
          font-size: 1.15rem;
          line-height: 1.7;
        }
        .contact-hero .breadcrumb {
          margin-bottom: 2rem;
        }
        .contact-hero .breadcrumb a,
        .contact-hero .breadcrumb span {
          color: rgba(255,255,255,0.8);
        }
        .contact-hero .breadcrumb a:hover {
          color: #fff;
        }

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

        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; gap: 2rem; }
          .form-panel { transform: none; margin-top: -3rem; }
          .form-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}</style>

            {/* Hero */}
            <div className="contact-hero">
                <div className="contact-hero-bg">
                    <Image
                        src={heroImage}
                        alt="Contact NFA"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className="container contact-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Contact</span>
                    </div>
                    <h1>{heroTitle}</h1>
                    <p>{heroDescription}</p>
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
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="map-pin" size={18} /></span> {officeName}</div>
                            <div className="info-detail">
                                {addressLines.map((line, idx) => (
                                    idx === 0 ? <strong key={idx}>{line}</strong> : <span key={idx}>{line}</span>
                                ))}
                            </div>
                            <div className="map-wrapper">
                                <iframe
                                    src="https://www.google.com/maps?q=Plot+2032,+Olusegun+Obasanjo+Way,+Wuse+Zone+7,+Abuja+904101,+Federal+Capital+Territory&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="NAFDAC Office Location"
                                />
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="phone" size={18} /></span> Phone</div>
                            <div className="info-card">
                                {phoneContacts.map((contact, idx) => (
                                    <div key={idx}>
                                        <div className="info-detail">
                                            <strong>{contact.label}</strong>
                                            <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--wfp-blue)', textDecoration: 'none', fontWeight: 600 }}>{contact.phone}</a>
                                        </div>
                                        {idx < phoneContacts.length - 1 && <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="mail" size={18} /></span> Email Contacts</div>
                            <div className="info-card">
                                {emailContacts.map((contact, idx) => (
                                    <div key={idx}>
                                        <div className="info-detail">
                                            <strong>{contact.label}</strong>
                                            <a href={`mailto:${contact.email}`} style={{ color: 'var(--wfp-blue)', textDecoration: 'none' }}>{contact.email}</a>
                                        </div>
                                        {idx < emailContacts.length - 1 && <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span className="info-label-icon" style={{ display: 'flex' }}><Icon name="clock" size={18} /></span> Office Hours</div>
                            <div className="info-detail">
                                {officeHours.split('\n').map((line, idx) => (
                                    <span key={idx}>{line}</span>
                                ))}
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{officeHoursNote}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
