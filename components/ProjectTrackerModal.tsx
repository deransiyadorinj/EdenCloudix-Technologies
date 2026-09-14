'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface ProjectData {
  requestId: string;
  domain: string;
  status: string;
  statusLabel: string;
  description: string;
  step: number;
  progressPercent: number;
  projectTitle: string;
  clientName: string;
  budget?: string | null;
  timeline?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserProjectItem {
  id: string;
  requestId: string;
  domain: string;
  status: string;
  projectTitle: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingId?: string;
}

const STEPS = [
  { step: 1, name: 'Submitted', key: 'NEW' },
  { step: 2, name: 'In Review', key: 'CONTACTED' },
  { step: 3, name: 'In Discussion', key: 'IN_DISCUSSION' },
  { step: 4, name: 'In Progress', key: 'IN_PROGRESS' },
  { step: 5, name: 'Completed', key: 'COMPLETED' },
];

export default function ProjectTrackerModal({
  isOpen,
  onClose,
  initialTrackingId = '',
}: ProjectTrackerModalProps) {
  const [activeTab, setActiveTab] = useState<'track' | 'portal'>('track');
  const [trackingInput, setTrackingInput] = useState(initialTrackingId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [copied, setCopied] = useState(false);

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [portalEmailInput, setPortalEmailInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userProjects, setUserProjects] = useState<UserProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const email = user.email || '';
        const name = user.displayName || email.split('@')[0];
        setUserEmail(email);
        setUserName(name);
        if (email) await loadUserProjects(email);
      } else {
        setUserEmail('');
        setUserName('');
        setUserProjects([]);
      }
    });
    return () => unsub();
  }, []);

  // Auto-search if initialTrackingId provided
  useEffect(() => {
    if (initialTrackingId) {
      setTrackingInput(initialTrackingId);
      handleTrack(initialTrackingId);
    }
  }, [initialTrackingId]);

  // Handle ESC key to close
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

  const handleTrack = useCallback(async (idToQuery?: string) => {
    const query = (idToQuery || trackingInput).trim();
    if (!query) {
      setError('Please enter a valid Tracking Reference ID (e.g. ECX-CLD-2026-0008)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/track?id=' + encodeURIComponent(query));
      const data = await res.json();

      if (!res.ok || !data.project) {
        throw new Error(data.error || 'Project not found for this tracking ID.');
      }

      setProject(data.project);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch project tracking details.');
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [trackingInput]);

  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Real Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setError('Google Sign-In is not configured yet. Please try email lookup below.');
      return;
    }
    setLoadingProjects(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || '';
      const name = user.displayName || email.split('@')[0];

      // Sync with our server
      await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      setUserEmail(email);
      setUserName(name);
      await loadUserProjects(email);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Popup was blocked by browser. Please allow popups for this site and try again.');
      } else {
        setError(err?.message || 'Google sign-in failed. Please use email lookup below.');
      }
    } finally {
      setLoadingProjects(false);
    }
  };

  // Sign out from Firebase
  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      await fetch('/api/auth/google', { method: 'DELETE' });
    }
    setUserEmail('');
    setUserName('');
    setUserProjects([]);
    setFirebaseUser(null);
  };

  const handleEmailLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalEmailInput.trim()) return;
    setLoadingProjects(true);
    setError(null);
    try {
      setUserEmail(portalEmailInput.trim());
      setUserName(portalEmailInput.trim().split('@')[0]);
      await loadUserProjects(portalEmailInput.trim());
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadUserProjects = async (email: string) => {
    try {
      const res = await fetch('/api/user/projects?email=' + encodeURIComponent(email));
      const data = await res.json();
      if (res.ok && data.projects) {
        setUserProjects(data.projects);
      } else {
        setUserProjects([]);
      }
    } catch {
      setUserProjects([]);
    }
  };

  const selectProjectFromPortal = (reqId: string) => {
    setActiveTab('track');
    setTrackingInput(reqId);
    handleTrack(reqId);
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'COMPLETED':
        return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', glow: '0 0 16px rgba(16, 185, 129, 0.4)' };
      case 'IN_PROGRESS':
        return { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', glow: '0 0 16px rgba(168, 85, 247, 0.4)' };
      case 'IN_DISCUSSION':
        return { text: '#00d2ff', bg: 'rgba(0, 210, 255, 0.15)', border: '#00d2ff', glow: '0 0 16px rgba(0, 210, 255, 0.4)' };
      case 'CONTACTED':
        return { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', glow: '0 0 16px rgba(59, 130, 246, 0.4)' };
      case 'CANCELLED':
        return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', glow: '0 0 16px rgba(239, 68, 68, 0.4)' };
      default:
        return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', glow: '0 0 16px rgba(245, 158, 11, 0.4)' };
    }
  };

  if (!isOpen) return null;

  const statusColors = project ? getStatusColor(project.status) : null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6,11,26,0.98) 0%, rgba(10,18,42,0.98) 100%)',
          border: '1px solid rgba(0,210,255,0.2)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 0 60px rgba(0,210,255,0.12), 0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 8px #00d2ff', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.75rem', color: '#00d2ff', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Live Project Tracker
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              ECX Mission Control
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 300,
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '20px 28px 0', display: 'flex', gap: '8px' }}>
          {[
            { key: 'track', label: '🔍 Track by ID' },
            { key: 'portal', label: '👤 My Projects' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: activeTab === tab.key ? '1px solid rgba(0,210,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                background: activeTab === tab.key ? 'rgba(0,210,255,0.1)' : 'transparent',
                color: activeTab === tab.key ? '#00d2ff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 28px 28px' }}>
          {/* --- TRACK TAB --- */}
          {activeTab === 'track' && (
            <div>
              {/* Search Form */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
                style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}
              >
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter ID e.g. ECX-CLD-2026-0008"
                  style={{
                    flex: 1, padding: '12px 16px',
                    background: 'rgba(10,18,42,0.8)',
                    border: '1px solid rgba(0,210,255,0.25)',
                    borderRadius: '10px', color: '#fff',
                    fontSize: '0.875rem', outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #00d2ff, #0077ff)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    fontWeight: 700, fontSize: '0.875rem', cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? '...' : 'Track'}
                </button>
              </form>

              {/* Error */}
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '12px 16px',
                  color: '#f87171', fontSize: '0.875rem', marginBottom: '16px',
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Result */}
              {project && statusColors && (
                <div>
                  {/* Status Header */}
                  <div style={{
                    background: 'rgba(6,11,26,0.8)',
                    border: '1px solid ' + statusColors.border,
                    borderRadius: '14px', padding: '20px',
                    boxShadow: statusColors.glow,
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <div style={{
                          fontFamily: 'monospace', fontWeight: 800,
                          color: '#60a5fa', fontSize: '1rem', marginBottom: '4px',
                          display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                          {project.requestId}
                          <button
                            onClick={() => handleCopyId(project.requestId)}
                            style={{
                              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '6px', padding: '2px 8px',
                              color: copied ? '#10b981' : '#64748b',
                              fontSize: '0.6875rem', cursor: 'pointer',
                            }}
                          >
                            {copied ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#cbd5e1', fontWeight: 600 }}>{project.projectTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {project.domain} · Client: {project.clientName}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        color: statusColors.text, background: statusColors.bg,
                        border: '1px solid ' + statusColors.border,
                        padding: '4px 12px', borderRadius: '20px',
                        whiteSpace: 'nowrap',
                      }}>
                        {project.statusLabel}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Progress</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColors.text }}>{project.progressPercent}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 4,
                          background: 'linear-gradient(90deg, #00d2ff, ' + statusColors.border + ')',
                          width: project.progressPercent + '%',
                          transition: 'width 1s ease',
                          boxShadow: '0 0 8px ' + statusColors.border,
                        }} />
                      </div>
                    </div>

                    {/* Step indicators */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {STEPS.map((s) => {
                        const done = project.step >= s.step;
                        const active = project.step === s.step;
                        return (
                          <div key={s.step} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{
                              height: 4, borderRadius: 2, marginBottom: 4,
                              background: done
                                ? (active ? statusColors.border : 'rgba(0,210,255,0.5)')
                                : 'rgba(255,255,255,0.08)',
                              boxShadow: active ? '0 0 6px ' + statusColors.border : 'none',
                            }} />
                            <div style={{
                              fontSize: '0.625rem', color: done ? '#94a3b8' : '#334155',
                              fontWeight: active ? 700 : 400,
                            }}>
                              {s.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{
                    background: 'rgba(0,210,255,0.05)', border: '1px solid rgba(0,210,255,0.12)',
                    borderRadius: '10px', padding: '14px 16px',
                    color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.6,
                    marginBottom: '12px',
                  }}>
                    {project.description}
                  </div>

                  {/* Details row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { label: 'Budget', value: project.budget || 'TBD' },
                      { label: 'Timeline', value: project.timeline || 'TBD' },
                      { label: 'Submitted', value: new Date(project.createdAt).toLocaleDateString() },
                      { label: 'Last Update', value: new Date(project.updatedAt).toLocaleDateString() },
                    ].map((item) => (
                      <div key={item.label} style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '8px', padding: '10px 12px',
                      }}>
                        <div style={{ fontSize: '0.6875rem', color: '#475569', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!project && !loading && !error && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛰</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Enter your Tracking ID above</div>
                  <div style={{ fontSize: '0.8125rem' }}>Format: ECX-CLD-2026-0008</div>
                </div>
              )}
            </div>
          )}

          {/* --- PORTAL TAB --- */}
          {activeTab === 'portal' && (
            <div>
              {!userEmail ? (
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 20px', lineHeight: 1.6 }}>
                    Sign in with your Google account or enter your email to view all your projects and their live status.
                  </p>

                  {/* Google Sign-In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loadingProjects}
                    style={{
                      width: '100%', padding: '13px 20px',
                      background: '#fff', border: '1px solid #e2e8f0',
                      borderRadius: '12px', cursor: loadingProjects ? 'wait' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '10px', marginBottom: '16px',
                      fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b',
                      opacity: loadingProjects ? 0.7 : 1,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {loadingProjects ? (
                      <span style={{ color: '#64748b' }}>Signing in...</span>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.8125rem', marginBottom: '16px' }}>
                    — or lookup by email —
                  </div>

                  <form onSubmit={handleEmailLookup} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="email"
                      value={portalEmailInput}
                      onChange={(e) => setPortalEmailInput(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        flex: 1, padding: '10px 14px',
                        background: 'rgba(10,18,42,0.8)',
                        border: '1px solid rgba(255,42,133,0.3)',
                        borderRadius: '8px', color: '#fff',
                        fontSize: '0.875rem', outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '0 16px',
                        background: 'linear-gradient(135deg, #ff2a85, #7928ca)',
                        color: '#fff', border: 'none', borderRadius: '8px',
                        fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
                      }}
                    >
                      Lookup
                    </button>
                  </form>

                  {error && (
                    <div style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '10px', padding: '12px 16px',
                      color: '#f87171', fontSize: '0.8125rem', marginTop: '14px',
                    }}>
                      ⚠ {error}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Logged in User Bar */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(10,18,42,0.7)',
                    padding: '14px 18px', borderRadius: '12px',
                    border: '1px solid rgba(0,210,255,0.2)',
                    marginBottom: '20px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {firebaseUser?.photoURL ? (
                        <img
                          src={firebaseUser.photoURL}
                          alt={userName}
                          style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,210,255,0.4)' }}
                        />
                      ) : (
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00d2ff, #ff2a85)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: '#fff',
                        }}>
                          {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff' }}>{userName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{userEmail}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px', padding: '6px 12px',
                        color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer',
                      }}
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Projects list */}
                  <h5 style={{ margin: '0 0 12px', fontSize: '0.875rem', color: '#fff', fontWeight: 700 }}>
                    Your Tracked Projects ({userProjects.length}):
                  </h5>

                  {loadingProjects ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      Loading projects...
                    </div>
                  ) : userProjects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      No projects found under this email. Submit a project to start tracking!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {userProjects.map((p) => {
                        const colors = getStatusColor(p.status);
                        return (
                          <div
                            key={p.id}
                            style={{
                              background: 'rgba(6,11,26,0.8)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '12px', padding: '14px 18px',
                              display: 'flex', alignItems: 'center',
                              justifyContent: 'space-between', gap: '12px',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#60a5fa', fontSize: '0.875rem' }}>
                                  {p.requestId}
                                </span>
                                <span style={{
                                  fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '10px',
                                  background: 'rgba(255,255,255,0.06)', color: '#cbd5e1',
                                }}>
                                  {p.domain}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Submitted {new Date(p.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{
                                fontSize: '0.75rem', fontWeight: 700,
                                color: colors.text, background: colors.bg,
                                border: '1px solid ' + colors.border,
                                padding: '4px 10px', borderRadius: '12px',
                              }}>
                                {p.status}
                              </span>
                              <button
                                onClick={() => selectProjectFromPortal(p.requestId)}
                                style={{
                                  background: 'linear-gradient(135deg, #00d2ff, #0077ff)',
                                  border: 'none', color: '#fff',
                                  padding: '6px 12px', borderRadius: '8px',
                                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                }}
                              >
                                View →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
