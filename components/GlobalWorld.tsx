'use client';

import { useState } from 'react';

interface GlobalStatItem {
  id: string;
  num: string;
  label: string;
  shortExplain: string;
  accent: string;
  icon: React.ReactNode;
}

const stats: GlobalStatItem[] = [
  {
    id: 's1',
    num: '50+',
    label: 'Projects Delivered',
    shortExplain: 'Engineered production full-stack apps, cloud migrations, and AI models across 15+ business verticals worldwide.',
    accent: '#00d2ff',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 's2',
    num: '100%',
    label: 'Client Satisfaction',
    shortExplain: 'Every engagement includes structured milestone demos, transparent iterations, and post-launch deployment support.',
    accent: '#ff2a85',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 's3',
    num: 'Global',
    label: 'Worldwide Reach',
    shortExplain: 'Seamless asynchronous remote collaboration for clients across the US, UK, Europe, India, and Middle East.',
    accent: '#0072ff',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0072ff" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 's4',
    num: '3',
    label: 'Core Domains',
    shortExplain: 'Deep specialized technical mastery: Artificial Intelligence, Full-Stack Architecture, and Cloud Infrastructure.',
    accent: '#a855f7',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="5" cy="6" r="2" />
        <circle cx="12" cy="20" r="2" />
        <line x1="12" y1="9" x2="12" y2="18" />
        <line x1="9" y1="12" x2="5.5" y2="7.5" />
        <line x1="15" y1="12" x2="18.5" y2="7.5" />
      </svg>
    ),
  },
  {
    id: 's5',
    num: '24/7',
    label: 'System Support',
    shortExplain: 'Continuous monitoring, automated alerting, and proactive DevOps telemetry for maximum client peace of mind.',
    accent: '#34d399',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 's6',
    num: 'Custom',
    label: 'Tailored Solutions',
    shortExplain: 'Zero generic templates. Every line of backend and frontend logic is architected from scratch for your use case.',
    accent: '#ff2a85',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    id: 's7',
    num: '99.9%',
    label: 'Uptime Reliability',
    shortExplain: 'Multi-region AWS architectures with automated container failover and zero-downtime blue-green deployments.',
    accent: '#00d2ff',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 's8',
    num: '<25ms',
    label: 'Inference Latency',
    shortExplain: 'High-speed model execution, vector database indexing, and streamlined caching pipelines for real-time responsiveness.',
    accent: '#38bdf8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 's9',
    num: '15+',
    label: 'Modern Tech Stacks',
    shortExplain: 'Mastery across Next.js, React, Node.js, Python, PostgreSQL, MariaDB, Docker, Kubernetes, AWS, and Terraform.',
    accent: '#ec4899',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 's10',
    num: '100% Trust',
    label: 'Security Model',
    shortExplain: 'Encrypted payloads, granular role-based permissions, sanitized SQL queries, and secure session management.',
    accent: '#0072ff',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0072ff" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function GlobalWorld() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section className="global-section" id="global" aria-label="Serving clients across the globe">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label section-label-blue" style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-cyan)' }} />
            WORLDWIDE CLIENT DELIVERY
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 14 }}>
            Serving Clients{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00d2ff 0%, #a855f7 50%, #ff2a85 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Across the Globe
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 620, margin: '0 auto', lineHeight: 1.75, fontSize: '0.95rem' }}>
            EdenCloudix Technologies works with clients from anywhere in the world. Click any card below to explore our delivery metrics and global engineering standards.
          </p>
        </div>

        {/* 10 Interactive Cards Grid with Click-to-Explain and Hover */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
          }}
        >
          {stats.map(s => {
            const isExpanded = expandedId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => toggleExpand(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleExpand(s.id)}
                aria-expanded={isExpanded}
                style={{
                  padding: '24px 20px',
                  borderRadius: '18px',
                  background: isExpanded ? 'rgba(12, 24, 54, 0.95)' : 'rgba(9, 16, 36, 0.75)',
                  border: `1.5px solid ${isExpanded ? s.accent : 'rgba(0, 210, 255, 0.15)'}`,
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isExpanded
                    ? `0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${s.accent}30`
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (!isExpanded) {
                    e.currentTarget.style.borderColor = s.accent;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 28px rgba(0, 0, 0, 0.5), 0 0 16px ${s.accent}25`;
                  }
                }}
                onMouseLeave={e => {
                  if (!isExpanded) {
                    e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.15)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '14px',
                    background: `${s.accent}15`,
                    border: `1.5px solid ${s.accent}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {s.icon}
                </div>

                {/* Number */}
                <div
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    marginBottom: 4,
                  }}
                >
                  {s.num}
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: isExpanded ? s.accent : 'var(--text-secondary)',
                    fontWeight: 600,
                    marginBottom: 8,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {s.label}
                </div>

                {/* Short explanation (revealed or toggled) */}
                <div
                  style={{
                    maxHeight: isExpanded ? '120px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    marginTop: isExpanded ? '10px' : '0px',
                    paddingTop: isExpanded ? '10px' : '0px',
                    borderTop: isExpanded ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontSize: '0.78rem',
                    color: '#cbd5e1',
                    lineHeight: 1.55,
                    textAlign: 'left',
                  }}
                >
                  {s.shortExplain}
                </div>

                {/* Click hint */}
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    color: isExpanded ? s.accent : 'var(--text-muted)',
                    marginTop: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  <span>{isExpanded ? '▲ Hide details' : '▼ Click to explore'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
