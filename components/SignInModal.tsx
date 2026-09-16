'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface UserProject {
  id: string;
  requestId: string;
  domain: string;
  status: string;
  projectTitle: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackProject?: (requestId: string) => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onTrackProject,
}: SignInModalProps) {
  const { user, signInWithGoogle, logout, isFirebaseConfigured } = useAuth();
  const isDev = process.env.NODE_ENV === 'development';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [customEmail, setCustomEmail] = useState('dea@gmail.com');

  // Load user's projects whenever user changes
  useEffect(() => {
    if (user?.email) {
      loadProjects(user.email);
    } else {
      setProjects([]);
    }
  }, [user]);

  const loadProjects = async (email: string) => {
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/user/projects?email=' + encodeURIComponent(email));
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleGoogleClick = async (emailToUse?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseConfigured) {
        await signInWithGoogle();
      } else if (isDev) {
        await signInWithGoogle(emailToUse || customEmail || 'dea@gmail.com');
      } else {
        await signInWithGoogle();
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by browser. Please allow popups for this site.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase Console. Please add this domain to Authorized Domains.');
      } else {
        setError(err?.message || 'Authentication error. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(2, 6, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(145deg, rgba(8, 15, 34, 0.98) 0%, rgba(4, 8, 20, 0.99) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 42, 133, 0.3)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 42, 133, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(12, 18, 38, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff2a85, #00d2ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(255, 42, 133, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                {user ? 'Client Account Portal' : 'Sign In with Google'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Firebase Authentication & Client Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94a3b8',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ff2a85';
              e.currentTarget.style.borderColor = '#ff2a85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '0.8125rem',
              }}
            >
              {error}
            </div>
          )}

          {!user ? (
            /* Sign In Screen */
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(255, 42, 133, 0.12)',
                  border: '1px solid rgba(255, 42, 133, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>

              <h4 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                Welcome to Client Portal
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {isFirebaseConfigured || !isDev
                  ? 'Use Firebase Authentication to securely sign in with Google and manage your project requests.'
                  : 'Instant Client Sign-In active. Access your submitted requests or test with any Google account.'}
              </p>

              {/* Local development auth notice: ONLY rendered in local development when Firebase is not configured */}
              {isDev && !isFirebaseConfigured && (
                <div
                  style={{
                    background: 'rgba(0, 210, 255, 0.08)',
                    border: '1px solid rgba(0, 210, 255, 0.25)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    textAlign: 'left',
                    fontSize: '0.8125rem',
                    color: '#93c5fd',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#00d2ff', marginBottom: '4px' }}>
                    <span>⚡</span>
                    <span>Local Development Auth Active</span>
                  </div>
                  <span>
                    Firebase API keys not detected in <code>.env.local</code>. You can instantly sign in below with your project email (<strong>dea@gmail.com</strong>) or any email to preview submitted requests.
                  </span>
                </div>
              )}

              {/* Continue with Google Button */}
              <button
                onClick={() => handleGoogleClick()}
                disabled={loading}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  padding: '14px 20px',
                  background: '#ffffff',
                  color: '#1f2937',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 22px rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.35)';
                }}
              >
                {/* Official Google 4-Color 'G' Logo */}
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>
                  {loading
                    ? 'Connecting with Google...'
                    : isDev && !isFirebaseConfigured
                    ? `Continue as ${customEmail}`
                    : 'Continue with Google'}
                </span>
              </button>

              {/* Local development project email input: ONLY rendered in local development when Firebase is not configured */}
              {isDev && !isFirebaseConfigured && (
                <div style={{ maxWidth: '360px', margin: '0 auto', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                    Or sign in with a different project email:
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. your-email@gmail.com"
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '0.8125rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => handleGoogleClick(customEmail)}
                      disabled={loading || !customEmail}
                      style={{
                        background: 'linear-gradient(135deg, #00d2ff, #0084ff)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-In User Dashboard */
            <div>
              {/* Profile Card showing Name and Profile Picture */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(12, 20, 44, 0.85)',
                  border: '1px solid rgba(0, 210, 255, 0.25)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* User Profile Picture */}
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Profile picture'}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: '2px solid #00d2ff',
                        objectFit: 'cover',
                        boxShadow: '0 0 12px rgba(0, 210, 255, 0.4)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d2ff, #ff2a85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#fff',
                        boxShadow: '0 0 14px rgba(0, 210, 255, 0.4)',
                      }}
                    >
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user.displayName || 'Google Client'}
                      <span
                        style={{
                          fontSize: '0.625rem',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        Verified
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{user.email}</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => logout()}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#f87171',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  }}
                >
                  Logout
                </button>
              </div>

              {/* Projects List */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h5 style={{ margin: 0, fontSize: '0.9375rem', color: '#fff', fontWeight: 700 }}>
                  Your Submitted Projects ({projects.length})
                </h5>
                <button
                  onClick={() => user.email && loadProjects(user.email)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00d2ff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Refresh
                </button>
              </div>

              {loadingProjects ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Loading projects...</div>
              ) : projects.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    background: 'rgba(10, 18, 42, 0.5)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '0.875rem' }}>
                    No project submissions found for <strong>{user.email}</strong>.
                  </p>
                  <a
                    href="#start-project"
                    onClick={onClose}
                    style={{
                      color: '#00d2ff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Start a project now &rarr;
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {projects.map((p) => {
                    const isCompleted = p.status === 'COMPLETED';
                    const isCopied = copiedId === p.requestId;

                    return (
                      <div
                        key={p.id}
                        style={{
                          background: 'rgba(8, 14, 32, 0.8)',
                          border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 210, 255, 0.15)',
                          borderRadius: '14px',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          boxShadow: isCompleted ? '0 0 14px rgba(16, 185, 129, 0.12)' : 'none',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono, monospace)',
                                fontWeight: 800,
                                color: '#60a5fa',
                                fontSize: '0.9375rem',
                              }}
                            >
                              {p.requestId}
                            </span>
                            <button
                              onClick={() => handleCopy(p.requestId)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: isCopied ? '#10b981' : '#64748b',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                              title="Copy tracking ID"
                            >
                              {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#cbd5e1',
                                padding: '2px 8px',
                                borderRadius: '10px',
                              }}
                            >
                              {p.domain}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Submitted {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                              color: isCompleted ? '#10b981' : '#00d2ff',
                              border: isCompleted ? '1px solid #10b981' : '1px solid #00d2ff',
                            }}
                          >
                            {isCompleted ? 'COMPLETED 🎉' : p.status}
                          </span>

                          {onTrackProject && (
                            <button
                              onClick={() => onTrackProject(p.requestId)}
                              style={{
                                background: 'rgba(0, 210, 255, 0.1)',
                                border: '1px solid rgba(0, 210, 255, 0.3)',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                color: '#00d2ff',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Track &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Portal Quick Links */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem',
                }}
              >
                <a
                  href="/admin"
                  style={{
                    color: '#a78bfa',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                  Admin Control Panel &rarr;
                </a>

                <a
                  href="#start-project"
                  onClick={onClose}
                  style={{
                    color: '#00d2ff',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  + New Request
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
