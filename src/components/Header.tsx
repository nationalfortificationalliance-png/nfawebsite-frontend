'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
];

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

  const isHome = pathname === '/';

  return (
    <>
      <style>{`
        /* ── Announcement bar ── */
        .announce-bar {
          background: var(--wfp-blue);
          color: rgba(255,255,255,.9);
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.5rem 0;
          letter-spacing: 0.01em;
        }
        .announce-inner {
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem;
        }
        .announce-links { display: flex; gap: 1.5rem; }
        .announce-links a { color: rgba(255,255,255,.8); transition: color .15s; }
        .announce-links a:hover { color: #fff; }

        /* ── Main header ── */
        .site-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          transition: all 0.35s var(--ease-out);
        }
        .header-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.5rem; max-width: var(--container);
          margin: 0 auto; height: 68px; gap: 2rem;
        }
        /* Transparent on hero, white after scroll or on inner pages */
        .header-transparent .header-wrap { background: transparent; }
        .header-opaque .header-wrap,
        .header-scrolled .header-wrap {
          background: #fff;
          box-shadow: 0 1px 0 var(--border), var(--shadow-sm);
        }
        .header-wrap {
          transition: background 0.35s var(--ease-out), box-shadow 0.35s var(--ease-out);
        }

        /* Logo */
        .logo {
          display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0;
        }
        .logo-emblem {
          width: 42px; height: 42px; border-radius: 10px;
          background: var(--wfp-blue); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 800; flex-shrink: 0;
          letter-spacing: -1px;
        }
        .logo-text { line-height: 1.15; }
        .logo-name {
          display: block; font-size: 0.975rem; font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--logo-color, var(--text-primary));
          transition: color 0.35s;
        }
        .logo-sub {
          display: block; font-size: 0.62rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: var(--logo-sub-color, var(--text-muted));
          transition: color 0.35s;
        }

        /* Nav links */
        .nav-links { display: flex; align-items: center; gap: 0.25rem; }
        .nav-item { position: relative; }
        .nav-link {
          font-size: 0.9rem; font-weight: 500; padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm); transition: background .15s, color .15s;
          color: var(--nav-color, var(--text-primary)); white-space: nowrap;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .nav-link:hover { background: rgba(0,0,0,.05); }
        .nav-link.active { color: var(--wfp-blue); font-weight: 700; }

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

        /* Hamburger */
        .hamburger {
          display: none; width: 40px; height: 40px; border: none;
          background: transparent; border-radius: var(--radius-sm);
          align-items: center; justify-content: center; flex-direction: column; gap: 5px;
          padding: 0; transition: background .15s;
        }
        .hamburger:hover { background: rgba(0,0,0,.06); }
        .hamburger span {
          display: block; width: 20px; height: 1.5px; border-radius: 2px;
          background: var(--ham-color, var(--text-primary)); transition: all 0.3s;
        }

        /* Mobile menu */
        .mobile-menu {
          background: #fff; border-top: 1px solid var(--border);
          padding: 1rem 0 1.5rem;
        }
        .mobile-menu a {
          display: block; padding: 0.7rem 1.5rem;
          font-size: 0.975rem; font-weight: 500; color: var(--text-primary);
          transition: color .15s, background .15s; border-radius: var(--radius-sm);
          margin: 0 0.5rem;
        }
        .mobile-menu a:hover, .mobile-menu a.active { color: var(--wfp-blue); background: var(--wfp-blue-light); }
        .mobile-submenu { padding-left: 1rem; }
        .mobile-submenu a {
          font-size: 0.9rem;
          padding: 0.6rem 1.5rem;
          color: var(--text-secondary);
        }
        .mobile-cta { padding: 0.75rem 1.5rem; margin-top: 0.5rem; }

        @media (max-width: 800px) {
          .nav-links { display: none; }
          .header-cta .btn { display: none; }
          .hamburger { display: flex; }
          .announce-links { display: none; }
        }
      `}</style>

      {/* Announcement bar */}
      <div className="announce-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001 }}>
        <div className="container">
          <div className="announce-inner">
            <span>WFP Nigeria · National Fortification Project (NFP)</span>
            <div className="announce-links">
              <a href="https://www.wfp.org" target="_blank" rel="noopener noreferrer">WFP Global</a>
              <a href="https://www.nafdac.gov.ng" target="_blank" rel="noopener noreferrer">NAFDAC</a>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`site-header header-opaque ${scrolled ? 'header-scrolled' : ''}`}
        style={{ top: '32px' }}
      >
        <div className="header-wrap">
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

            {/* CTA */}
            <div className="header-cta">
              <Link href="/contact" className="btn btn-primary btn-sm">Contact Us</Link>
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
            <div className="mobile-cta">
              <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer — only on non-home pages */}
      {!isHome && <div style={{ height: '100px' }} />}
    </>
  );
}
