'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const scrollTo = (href: string) => {
  if (href === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const pos = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: Math.max(0, pos), behavior: 'smooth' });
  }
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '105px 24px 50px',
        background: 'radial-gradient(circle at 85% 25%, rgba(0, 210, 255, 0.12) 0%, transparent 50%), radial-gradient(circle at 15% 75%, rgba(255, 42, 133, 0.09) 0%, transparent 50%), #060a17',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Tech Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div
        className="container"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {/* Left Column: Greeting, Title, Tagline, Description & 4 Gradient Buttons */}
        <div style={{ maxWidth: 640 }}>
          {/* Greeting: Shorter distance directly above headline */}
          <div
            style={{
              fontSize: '1rem',
              color: '#94a3b8',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#00d2ff' }}>▶</span>
            <span>Hello, We&apos;re</span>
          </div>

          {/* Huge Main Heading with exact Logo Color matching */}
          <h1
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: 14,
            }}
          >
            <span style={{ color: '#00d2ff', textShadow: '0 0 24px rgba(0, 210, 255, 0.45)' }}>Eden</span>
            <span style={{ color: '#ff2a85', textShadow: '0 0 24px rgba(255, 42, 133, 0.45)' }}>Cloudix</span>
            <br className="hidden-mobile" />
            <span style={{ color: '#ffffff' }}> Technologies</span>
          </h1>

          {/* Dual-Tone Highlight Subtitle */}
          <div
            style={{
              fontSize: 'clamp(1.2rem, 2.3vw, 1.75rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 18,
              fontFamily: 'var(--font-primary)',
            }}
          >
            Leading in{' '}
            <span
              style={{
                color: '#00d2ff',
                textShadow: '0 0 20px rgba(0, 210, 255, 0.45)',
              }}
            >
              Cloud Architecture
            </span>{' '}
            &amp;{' '}
            <span
              style={{
                color: '#ff2a85',
                textShadow: '0 0 20px rgba(255, 42, 133, 0.45)',
              }}
            >
              AI Solutions
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.98rem',
              color: '#94a3b8',
              lineHeight: 1.75,
              marginBottom: 32,
              maxWidth: 560,
            }}
          >
            Designing scalable cloud architectures | Engineering intelligent AI pipelines | Building modern, high-performance full-stack web applications with cloud, networking &amp; DevOps excellence.
          </p>

          {/* 4 Distinctive Glowing Gradient Buttons (2x2 Grid) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              maxWidth: 520,
            }}
          >
            {/* Button 1: Start a Project (Cyan-to-Pink gradient) */}
            <button
              onClick={() => scrollTo('#start-project')}
              style={{
                background: 'linear-gradient(135deg, #00d2ff 0%, #c026d3 50%, #ff2a85 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 22px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 22px rgba(255, 42, 133, 0.38), 0 0 10px rgba(0, 210, 255, 0.25)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 42, 133, 0.55), 0 0 18px rgba(0, 210, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 22px rgba(255, 42, 133, 0.38), 0 0 10px rgba(0, 210, 255, 0.25)';
              }}
            >
              <span>🚀</span>
              <span>Start a Project</span>
            </button>

            {/* Button 2: View Projects / Portfolio (Vibrant Cyan-Blue gradient) */}
            <button
              onClick={() => scrollTo('#portfolio')}
              style={{
                background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 22px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 22px rgba(0, 114, 255, 0.38)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 114, 255, 0.55), 0 0 16px rgba(0, 210, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 22px rgba(0, 114, 255, 0.38)';
              }}
            >
              <span style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>&lt;/&gt;</span>
              <span>View Projects</span>
            </button>

            {/* Button 3: LinkedIn Profile (Electric Cyan/Blue gradient) */}
            <a
              href="https://www.linkedin.com/in/deransiya-dorin-j-a63185353"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 14,
                padding: '14px 22px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 198, 255, 0.32)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 198, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 198, 255, 0.32)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn Profile</span>
            </a>

            {/* Button 4: Edencloudix Technologies (Orange-to-Magenta gradient) */}
            <a
              href="https://www.instagram.com/edencloudixtechnologies?utm_source=qr&stkn=dWJnNTk3dWxyYWx6"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #f37335 0%, #fd1d1d 50%, #ff2a85 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 14,
                padding: '14px 22px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 22px rgba(255, 42, 133, 0.38)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 42, 133, 0.55), 0 0 16px rgba(243, 115, 53, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 22px rgba(255, 42, 133, 0.38)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              <span>Edencloudix Tech</span>
            </a>
          </div>
        </div>

        {/* Right Column: Glowing Square Artwork Card */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Ambient Glow behind card */}
          <div
            style={{
              position: 'absolute',
              inset: '-15px',
              borderRadius: 30,
              background: 'radial-gradient(circle, rgba(0, 210, 255, 0.22) 0%, rgba(255, 42, 133, 0.18) 60%, transparent 80%)',
              filter: 'blur(28px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Framed Card Container */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 520,
              aspectRatio: '1 / 1',
              borderRadius: 22,
              background: 'rgba(8, 14, 32, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(0, 210, 255, 0.35)',
              boxShadow: '0 0 45px rgba(0, 210, 255, 0.2), 0 0 80px rgba(255, 42, 133, 0.15)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = '#00d2ff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.35)';
            }}
          >
            <Image
              src="/hero-cyber-cloud.jpg"
              alt="Cyber Cloud Digital Architecture"
              fill
              priority
              style={{
                objectFit: 'cover',
                borderRadius: 20,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
