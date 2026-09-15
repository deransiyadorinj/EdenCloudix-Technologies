'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 76);
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <a href="#home" onClick={e => { e.preventDefault(); scrollTo('#home'); }} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', marginBottom: 14 }}>
              <Image src="/logo.jpeg" alt="EdenCloudix Technologies" width={40} height={40} style={{ borderRadius: 8, objectFit: 'contain', border: '1px solid rgba(255, 79, 123, 0.35)' }} />
              <div>
                <span className="brand-wordmark" style={{ fontSize: '1.2rem', lineHeight: 1.1 }}>
                  <span style={{ color: '#60a5fa', fontWeight: 800 }}>Eden</span><span style={{ color: '#ff4f7b', fontWeight: 800 }}>Cloudix</span>
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.22em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                  TECHNOLOGIES
                </div>
              </div>
            </a>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.15em',
              color: 'var(--ecx-gold-light)',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>✦</span>
              <span>INNOVATE • EMPOWER • ELEVATE</span>
              <span>✦</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Building Smart Solutions for a Smarter Tomorrow. AI • Full-Stack • Cloud Engineering.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[
                {
                  href: 'https://www.linkedin.com/in/deransiya-dorin-j-a63185353',
                  label: 'LinkedIn',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://www.instagram.com/edencloudixtechnologies?utm_source=qr&stkn=dWJnNTk3dWxyYWx6',
                  label: 'Instagram',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://github.com/deransiyadorinj',
                  label: 'GitHub',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  ),
                },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--ecx-cyan)'; el.style.color = 'var(--ecx-cyan)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--border-subtle)'; el.style.color = 'var(--text-muted)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="footer-heading">Services</p>
            <ul className="footer-links">
              <li><a href="#services" onClick={e => { e.preventDefault(); scrollTo('#services'); }}>AI Solutions</a></li>
              <li><a href="#services" onClick={e => { e.preventDefault(); scrollTo('#services'); }}>Full-Stack Development</a></li>
              <li><a href="#services" onClick={e => { e.preventDefault(); scrollTo('#services'); }}>Cloud Engineering</a></li>
              <li><a href="#start-project" onClick={e => { e.preventDefault(); scrollTo('#start-project'); }}>Start a Project</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-heading">Company</p>
            <ul className="footer-links">
              <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('#about'); }}>About Us</a></li>
              <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('#about'); }}>Our Vision</a></li>
              <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('#about'); }}>Our Mission</a></li>
              <li><a href="#why-us" onClick={e => { e.preventDefault(); scrollTo('#why-us'); }}>Why Choose Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="footer-heading">Connect</p>
            <ul className="footer-links">
              <li><a href="https://www.linkedin.com/in/deransiya-dorin-j-a63185353" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/edencloudixtechnologies?utm_source=qr&stkn=dWJnNTk3dWxyYWx6" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://github.com/deransiyadorinj" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#portfolio" onClick={e => { e.preventDefault(); scrollTo('#portfolio'); }}>What We Build</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} EdenCloudix Technologies. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link
              href="/privacy"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ecx-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ecx-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Terms of Service
            </Link>
            <Link
              href="/admin"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ecx-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
