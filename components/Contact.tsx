'use client';

import { useState } from 'react';

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 76), behavior: 'smooth' });
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      setError('Please enter a message (at least 5 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send message. Please try again.');
        return;
      }

      setRequestId(data.requestId || '');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact" aria-label="Contact EdenCloudix">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-label section-label-pink" style={{ display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-pink)' }} />
            GET IN TOUCH
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 14 }}>
            Let&apos;s <span className="text-pink">Connect</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            Have a project in mind or questions about our services? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div className="contact-info">
            <div>
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                Ready to Build Something{' '}
                <span style={{ color: 'var(--ecx-pink-light)' }}>Amazing?</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                EdenCloudix Technologies is available for projects worldwide. Whether you&apos;re a startup, enterprise, or individual — we&apos;re here to help bring your vision to life.
              </p>
            </div>

            {[
              { icon: '💼', label: 'Start a Project', value: 'Use our project form for detailed requests', accent: 'rgba(30,138,240,0.1)', border: 'rgba(30,138,240,0.2)', action: () => scrollTo('#start-project') },
              { icon: '🌍', label: 'Global Availability', value: 'We work with clients from anywhere in the world', accent: 'rgba(255,79,123,0.1)', border: 'rgba(255,79,123,0.2)' },
              { icon: '💡', label: 'Services', value: 'AI Solutions · Full-Stack Dev · Cloud Solutions', accent: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
            ].map(d => (
              <div
                key={d.label}
                className="contact-detail"
                onClick={d.action}
                style={{ cursor: d.action ? 'pointer' : 'default' }}
              >
                <div className="contact-icon" style={{ background: d.accent, border: `1px solid ${d.border}` }}>{d.icon}</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>{d.label}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{d.value}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14, fontWeight: 700 }}>CONNECT WITH US</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { href: 'https://www.linkedin.com/in/deransiya-dorin-j-a63185353', label: 'LinkedIn', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { href: 'https://www.instagram.com/edencloudixtechnologies', label: 'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                  { href: 'https://github.com/deransiyadorinj', label: 'GitHub', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="contact-form-card">
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1875rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Send a Quick Message</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
              For detailed project requests, use our{' '}
              <button onClick={() => scrollTo('#start-project')} style={{ color: 'var(--ecx-blue-light)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem' }}>Start a Project</button> form.
            </p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
                <h4 style={{ color: '#fff', fontFamily: 'var(--font-primary)', fontWeight: 700, marginBottom: 8 }}>Message Received!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Thank you! Your message has been saved. We&apos;ll get back to you as soon as possible.
                </p>
                {requestId && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60a5fa', marginTop: 10 }}>
                    Tracking ID: {requestId}
                  </p>
                )}
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setSent(false);
                    setError('');
                    setRequestId('');
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    className="form-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    className="form-input form-textarea"
                    rows={4}
                    placeholder="Tell us about your project or ask us anything..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>

                {error && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(255, 42, 133, 0.12)',
                      border: '1px solid rgba(255, 42, 133, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ff609f',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{
                    justifyContent: 'center',
                    opacity: loading ? 0.75 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Sending Message...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
