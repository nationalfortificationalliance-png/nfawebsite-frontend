'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'Overview', href: '/about' },
      { label: 'Governance', href: '/about/governance' },
      { label: 'Secretariat', href: '/about/secretariat' },
    ]
  },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'News & Events', href: '/news' },
  { label: 'Partners', href: '/partners' },
  { label: 'FAQ', href: '/faq' },
];

const HOME_LOCALES = new Set(['en', 'ha', 'ig', 'yo']);

export default function Header({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const pathSegments = pathname.split('/').filter(Boolean);
  const isHome = pathSegments.length === 0 || (pathSegments.length === 1 && HOME_LOCALES.has(pathSegments[0]));

  return (
    <>
      <style>{`
        /* ── Modern Navigation - Asedo Inspired ── */
        .site-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          width: 100%;
        }

        .header-wrap {
          position: relative;
          width: 100%;
        }

        /* Enhanced Glassmorphism */
        .header-glass {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(64px);
          -webkit-backdrop-filter: blur(64px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        /* Gradient Shimmer Overlay */
        .header-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.6) 0%,
            rgba(255,255,255,0.2) 50%,
            rgba(255,255,255,0.6) 100%
          );
          pointer-events: none;
        }

        .header-bar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.25rem clamp(1rem, 6vw, 5rem);
          max-width: 100%;
          margin: 0 auto;
          height: 96px;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .header-bar {
            height: 80px;
            gap: 2rem;
          }
        }

        @media (max-width: 800px) {
          .header-bar {
            height: 72px;
            padding: 0.5rem 1rem;
            gap: 1rem;
          }
        }

        /* Logo - Larger & Bolder */
        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        .logo-emblem {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-text {
          line-height: 1.2;
        }
        .logo-name {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0A1E3F;
          transition: color 0.3s;
        }
        .logo-sub {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--wfp-green);
          transition: color 0.3s;
          margin-top: 0.125rem;
        }

        @media (max-width: 800px) {
          .logo-emblem {
            width: 44px;
            height: 44px;
          }
          .logo-name {
            font-size: 0.95rem;
          }
          .logo-sub {
            font-size: 0.6rem;
          }
        }

        /* Modern Nav Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.625rem 1.25rem;
          height: 47px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #000206;
          white-space: nowrap;
          gap: 0.25rem;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.6);
          color: var(--wfp-green);
          transform: translateY(-1px);
        }

        /* Gradient Underline Indicator */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--wfp-green), var(--wfp-gold));
          border-radius: 9999px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover::after {
          width: 2rem;
        }

        .nav-link.active {
          color: var(--wfp-green);
          font-weight: 600;
        }

        .nav-link.active::after {
          width: 2rem;
        }

        /* Dropdown */
        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.2s;
          opacity: 0.6;
        }
        .nav-item:hover .dropdown-arrow { transform: rotate(180deg); }
        .dropdown {
          position: absolute; top: calc(100% + 0.25rem); left: 0;
          background: #fff; border: 1px solid var(--border);
          border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
          min-width: 200px; opacity: 0; visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s var(--ease-out);
          z-index: 100;
        }
        .dropdown::before {
          content: '';
          position: absolute;
          top: -0.5rem;
          left: 0;
          right: 0;
          height: 0.5rem;
        }
        .nav-item:hover .dropdown {
          opacity: 1; visibility: visible; transform: translateY(0);
        }
        .dropdown a {
          display: block; padding: 0.75rem 1.25rem;
          font-size: 0.9rem; font-weight: 500;
          color: var(--text-primary);
          transition: background 0.15s, color 0.15s;
          border-bottom: 1px solid var(--border-light);
        }
        .dropdown a:last-child { border-bottom: none; }
        .dropdown a:hover {
          background: var(--wfp-blue-light);
          color: var(--wfp-blue);
        }
        .dropdown a.active {
          color: var(--wfp-blue);
          font-weight: 600;
        }

        /* Light nav removal: Now always uses the standard opaque layout for legibility */
        .header-cta { flex-shrink: 0; }

        /* Contact CTA */
        .header-cta { flex-shrink: 0; }

        /* Hamburger - Asedo Style */
        .hamburger {
          display: none;
          width: 48px;
          height: 48px;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          padding: 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .hamburger:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: #0A1E3F;
          transition: all 0.3s ease;
        }

        /* Mobile menu - Asedo Style */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          margin-top: 1rem;
          overflow: hidden;
          z-index: 40;
        }

        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
        }

        .mobile-menu a {
          display: block;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #000206;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
        }

        .mobile-menu a:hover {
          background: linear-gradient(90deg, rgba(0, 168, 157, 0.05), rgba(227, 167, 0, 0.05));
          color: var(--wfp-green);
        }

        .mobile-menu a.active {
          color: var(--wfp-green);
          font-weight: 600;
        }

        .mobile-submenu {
          padding-left: 1rem;
        }

        .mobile-submenu a {
          font-size: 0.9rem;
          padding: 0.75rem 1.5rem;
          color: var(--text-secondary);
          border-bottom: none;
        }

        .mobile-cta {
          padding: 1rem 1.5rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 800px) {
          .nav-links { display: none; }
          .header-cta .btn { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <header className="site-header">
        <div className="header-wrap">
          {/* Glassmorphism Background */}
          <div className="header-glass"></div>

          {/* Subtle Gradient Overlay */}
          <div className="header-gradient"></div>

          <div className="header-bar">
            {/* Logo */}
            <Link href="/" className="logo">
              <div className="logo-emblem" style={{ background: 'transparent' }}>
                <Image src="/logo.png" alt="NFA Logo" width={42} height={42} style={{ objectFit: 'contain' }} priority />
              </div>
              <div className="logo-text">
                <span className="logo-name">National Fortification Alliance</span>
                <span className="logo-sub">Nigeria · Powered by WFP</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="nav-links">
              {NAV_LINKS.map((item) => (
                <div key={item.href} className="nav-item">
                  <Link
                    href={item.href}
                    className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                  >
                    {item.label}
                    {'dropdown' in item && <span className="dropdown-arrow">▼</span>}
                  </Link>
                  {'dropdown' in item && item.dropdown && (
                    <div className="dropdown">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={pathname === subItem.href ? 'active' : ''}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA - Asedo Style */}
            <div className="header-cta" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LanguageSwitcher />
              <Link
                href="/contact"
                className="btn btn-primary btn-sm"
                style={{
                  background: 'linear-gradient(90deg, var(--wfp-gold), #d09900)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
              >
                CONTACT US
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className="hamburger"
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              {NAV_LINKS.map((item) => (
                <div key={item.href}>
                  <Link href={item.href} className={pathname === item.href ? 'active' : ''}>
                    {item.label}
                  </Link>
                  {'dropdown' in item && item.dropdown && (
                    <div className="mobile-submenu">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={pathname === subItem.href ? 'active' : ''}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mobile-cta" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0 1.5rem' }}>
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/contact"
                  style={{
                    display: 'flex',
                    padding: '0.75rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, var(--wfp-gold), #d09900)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    color: 'var(--wfp-navy)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    margin: '0 1.5rem',
                  }}
                >
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer — only on non-home pages */}
      {!isHome && <div style={{ height: '100px' }} />}
    </>
  );
}
