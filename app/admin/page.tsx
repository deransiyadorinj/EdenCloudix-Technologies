'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Image
              src="/logo.jpeg"
              alt="EdenCloudix Technologies"
              width={56}
              height={56}
              style={{ borderRadius: '12px', border: '1px solid rgba(0, 212, 255, 0.3)' }}
              priority
            />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: 'var(--font-primary)',
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}>
            EdenCloudix Portal
          </h1>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em'
          }}>
            CONTROL PANEL • AUTHORIZED ACCESS ONLY
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: '#fca5a5',
            fontSize: '0.875rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              marginBottom: '8px'
            }}>
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@edencloudix.tech"
              autoComplete="username"
              className="input-field"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="input-field"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                Authenticating...
              </>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--ecx-cyan)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Return to EdenCloudix Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
