import Image from 'next/image';
import Link from 'next/link';
import type { GlobalSetting, ContactPage } from '@/lib/api';

interface FooterProps { settings: GlobalSetting | null; secretariatPhones: string[]; contact: ContactPage | null; }

export default function Footer({ settings, secretariatPhones, contact }: FooterProps) {
  const year = new Date().getFullYear();

  const addressLines = [
    contact?.address_line_1 || 'NAFDAC Office',
    contact?.address_line_2 || 'Plot 2032, Olusegun Obasanjo Way',
    contact?.address_line_3 || 'Wuse Zone 7',
    [contact?.address_line_4, contact?.address_line_5].filter(Boolean).join(', ') || 'Abuja, Federal Capital Territory, Nigeria'
  ].filter(Boolean);

  const footerEmail = 'info@nationalfortificationalliance.org.ng';

  const phoneContacts = secretariatPhones.length > 0 ? secretariatPhones : [
    '08099837920',
    '08035171719',
    '08065217543'
  ];

  return (
    <>
      <style>{`
        .footer { background: var(--wfp-navy); color: rgba(255,255,255,.8); font-size: 0.95rem; }
        .footer-main { padding: 5rem 0 4rem; border-bottom: 1px solid rgba(255,255,255,.1); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 4rem; }
        
        .footer-brand .footer-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .footer-logo-mark {
          width: 48px; height: 48px; border-radius: 12px;
          background: #fff; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 4px;
        }
        .footer-logo-name { font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1.15; letter-spacing: -0.01em; }
        .footer-brand p { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,.7); max-width: 300px; }
        
        .footer-socials { display: flex; gap: 0.75rem; margin-top: 2rem; }
        .footer-social-link {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.15);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 1rem; transition: all .25s var(--ease-out);
        }
        .footer-social-link:hover { background: var(--wfp-gold); border-color: var(--wfp-gold); color: var(--text-primary); transform: translateY(-3px); }

        .footer-col h4 {
          font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.12em; color: #fff; margin-bottom: 1.5rem;
        }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .footer-col ul li a { color: rgba(255,255,255,.7); transition: all .2s; display: inline-block; }
        .footer-col ul li a:hover { color: var(--wfp-gold); transform: translateX(4px); }

        .footer-contact-item { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: flex-start; }
        .footer-contact-icon { font-size: 1.1rem; flex-shrink: 0; color: var(--wfp-gold); margin-top: 0.1rem; }
        .footer-contact-val { color: rgba(255,255,255,.8); line-height: 1.6; }
        .footer-contact-val a { color: rgba(255,255,255,.8); transition: color .2s; }
        .footer-contact-val a:hover { color: var(--wfp-gold); }

        .footer-bottom {
          padding: 2rem 0;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1.5rem;
          font-size: 0.85rem; color: rgba(255,255,255,.5);
        }
        .footer-bottom a { color: rgba(255,255,255,.5); transition: color .2s; text-decoration: underline; text-decoration-color: transparent; }
        .footer-bottom a:hover { color: #fff; text-decoration-color: currentColor; }

        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; gap: 2.5rem; } }
      `}</style>

      <footer className="footer">
        {/* Main grid */}
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Brand */}
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="footer-logo-mark">
                    <Image src="/logo.png" alt="NFA Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div className="footer-logo-name">National Fortification Alliance</div>
                  </div>
                </div>
                <p>
                  The National Fortification Alliance remains committed to improving nutrition outcomes through sustainable food fortification programmes, regulatory strengthening, stakeholder collaboration, innovation, and public awareness.
                </p>
                <div className="footer-socials">
                  {settings?.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X / Twitter">𝕏</a>}
                  {settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">f</a>}
                  {settings?.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">in</a>}
                </div>
                {/* Newsletter signup temporarily disabled — restore by re-adding <NewsletterForm /> */}
              </div>

              {/* Simplified Links */}
              <div className="footer-col">
                <h4>Links</h4>
                <ul>
                  <li><Link href="/news?category=communique">NFA Meeting Communiques</Link></li>
                  <li><a href="https://www.nafdac.gov.ng" target="_blank" rel="noopener noreferrer">NAFDAC Website</a></li>
                  <li><a href="https://fccpc.gov.ng" target="_blank" rel="noopener noreferrer">FCCPC Website</a></li>
                  <li><a href="https://son.gov.ng" target="_blank" rel="noopener noreferrer">SON Website</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="footer-col">
                <h4>Contact</h4>
                <div className="footer-contact-item">
                  <span className="footer-contact-icon">✉</span>
                  <div className="footer-contact-val">
                    <a href={`mailto:${footerEmail}`}>{footerEmail}</a>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <span className="footer-contact-icon">📞</span>
                  <div className="footer-contact-val">
                    {phoneContacts.map((phone, idx) => (
                      <div key={idx}><a href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>{phone}</a></div>
                    ))}
                  </div>
                </div>
                <div className="footer-contact-item">
                  <span className="footer-contact-icon">📍</span>
                  <div className="footer-contact-val">
                    {addressLines.map((line, idx) => <div key={idx}>{line}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="container">
          <div className="footer-bottom">
            <div>
              <span>© {year} National Fortification Alliance. All rights reserved.</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                Privacy Policy and accessibility statements to be developed and approved.
              </div>
            </div>
            <span>
              <Link href="/about">About</Link> &nbsp;·&nbsp; <Link href="/contact">Contact</Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
