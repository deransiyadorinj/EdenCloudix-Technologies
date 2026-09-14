'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ProjectTrackerModal from './ProjectTrackerModal';
import SignInModal from './SignInModal';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Projects', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detector
      const sections = ['#home', '#about', '#services', '#why-us', '#portfolio', '#contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.querySelector(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    setActiveSection(href);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const navOffset = 76;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const targetPosition = Math.max(0, elementPosition - navOffset);
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleTrackFromSignIn = (requestId: string) => {
    setSelectedTrackingId(requestId);
    setSignInOpen(false);
    setTrackerOpen(true);
  };

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        style={{
          background: scrolled ? 'rgba(6, 10, 23, 0.95)' : 'rgba(6, 10, 23, 0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 210, 255, 0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand Logo & Wordmark */}
        <a
          href="#home"
          className="navbar-logo"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#home');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '2px solid #00d2ff',
              boxShadow: '0 0 14px rgba(0, 210, 255, 0.45)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#040714',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 42, 133, 0.55), 0 0 10px rgba(0, 210, 255, 0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 0 14px rgba(0, 210, 255, 0.45)';
            }}
          >
            <Image
              src="/logo.jpeg"
              alt="EdenCloudix Logo"
              width={42}
              height={42}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="navbar-logo-text brand-wordmark"
              style={{ fontSize: '1.25rem', lineHeight: 1.1, fontFamily: 'var(--font-primary)' }}
            >
              <span style={{ color: '#00d2ff', fontWeight: 800, textShadow: '0 0 12px rgba(0, 210, 255, 0.4)' }}>Eden</span>
              <span style={{ color: '#ff2a85', fontWeight: 800, textShadow: '0 0 12px rgba(255, 42, 133, 0.4)' }}>Cloudix</span>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.22em',
                color: '#70e2ff',
                textTransform: 'uppercase',
                marginTop: '1px',
                fontWeight: 600,
              }}
            >
              TECHNOLOGIES
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul className="navbar-links" role="list" style={{ display: 'flex', gap: 24, listStyle: 'none' }}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? '#00d2ff' : '#94a3b8',
                    transition: 'all 0.2s ease',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    position: 'relative',
                    paddingBottom: 4,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isActive ? '#00d2ff' : '#94a3b8'; }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, #00d2ff, #ff2a85)',
                        borderRadius: 2,
                      }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA Buttons */}
        <div className="navbar-cta" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Button 1: Track Status (on the side of login) */}
          <button
            onClick={() => setTrackerOpen(true)}
            className="btn btn-ghost"
            style={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              padding: '8px 14px',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              color: '#00d2ff',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(0, 210, 255, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)';
              e.currentTarget.style.borderColor = '#00d2ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 210, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.4)';
            }}
            title="Track project by Reference ID"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Track Status
          </button>

          {/* Button 2: Google Sign In / User Profile Button */}
          <button
            onClick={() => setSignInOpen(true)}
            className="btn btn-ghost"
            style={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              padding: '8px 14px',
              border: user ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255, 255, 255, 0.2)',
              color: user ? '#34d399' : '#ffffff',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: user ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = user ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = user ? '#10b981' : '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = user ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = user ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.2)';
            }}
            title={user ? `Signed in as ${user.displayName || user.email}` : 'Sign in with Google'}
          >
            {user ? (
              <>
                {/* Profile Picture or Avatar */}
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '1px solid #10b981',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d2ff, #ff2a85)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span>{(user.displayName || user.email || 'User').split(' ')[0]}</span>
              </>
            ) : (
              <>
                {/* Official Google G Icon */}
                <svg width="14" height="14" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Sign In
              </>
            )}
          </button>

          {/* Button 3: Resume Button */}
          <a
            href="https://github.com/deransiyadorinj/Cloud-Architect-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              padding: '8px 14px',
              border: '1px solid rgba(255, 42, 133, 0.4)',
              color: '#ff2a85',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 42, 133, 0.12)';
              e.currentTarget.style.borderColor = '#ff2a85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 42, 133, 0.4)';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Resume
          </a>

          {/* Button 4: Start Project CTA */}
          <button
            className="btn btn-primary"
            onClick={() => scrollTo('#start-project')}
            aria-label="Start a project with EdenCloudix"
            style={{ fontWeight: 600, fontSize: '0.8125rem', padding: '8px 18px' }}
          >
            Start a Project
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span
            style={{
              transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              transition: 'all 0.3s',
            }}
          />
          <span style={{ opacity: mobileOpen ? 0 : 1, transition: 'all 0.3s' }} />
          <span
            style={{
              transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              transition: 'all 0.3s',
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1.5rem',
          }}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(link.href);
            }}
            style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}
          >
            {link.label}
          </a>
        ))}
        
        {/* Mobile Track Button */}
        <button
          className="btn btn-ghost btn-lg"
          onClick={() => {
            setMobileOpen(false);
            setTrackerOpen(true);
          }}
          style={{
            marginTop: 14,
            border: '1px solid rgba(0, 210, 255, 0.4)',
            color: '#00d2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Track Status
        </button>

        {/* Mobile Sign In Button */}
        <button
          className="btn btn-ghost btn-lg"
          onClick={() => {
            setMobileOpen(false);
            setSignInOpen(true);
          }}
          style={{
            marginTop: 10,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          {user ? `Account (${(user.displayName || user.email || 'User').split(' ')[0]})` : 'Sign In with Google'}
        </button>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => scrollTo('#start-project')}
          style={{ marginTop: 12 }}
        >
          Start a Project
        </button>
      </div>

      {/* Real-Time Live Project Tracker Modal */}
      <ProjectTrackerModal
        isOpen={trackerOpen}
        onClose={() => {
          setTrackerOpen(false);
          setSelectedTrackingId('');
        }}
        initialTrackingId={selectedTrackingId}
      />

      {/* Separate Dedicated Google Sign In / Client Portal Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onTrackProject={handleTrackFromSignIn}
      />
    </>
  );
}
