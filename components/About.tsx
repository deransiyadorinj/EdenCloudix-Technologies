'use client';

import Image from 'next/image';

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 76), behavior: 'smooth' });
};

const coreItems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4f7b" strokeWidth="2">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h3a3 3 0 0 1 3 3v1h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-1H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1v-1a3 3 0 0 1 3-3h3V9.5C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z" />
      </svg>
    ),
    badge: 'AI SOLUTIONS',
    title: 'Artificial Intelligence Systems',
    description: 'Intelligent cognitive pipelines, autonomous LLM agents, predictive models, and computer vision tailored to optimize real-world business workflows.',
    accent: '#ff4f7b',
    bg: 'rgba(255, 79, 123, 0.1)',
    border: 'rgba(255, 79, 123, 0.25)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    badge: 'FULL-STACK',
    title: 'Full-Stack Architecture',
    description: 'Modern, high-performance web applications, resilient REST/GraphQL APIs, multi-tenant SaaS platforms, and enterprise relational databases.',
    accent: '#00d2ff',
    bg: 'rgba(0, 210, 255, 0.1)',
    border: 'rgba(0, 210, 255, 0.25)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0072ff" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    badge: 'CLOUD & DEVOPS',
    title: 'Cloud Infrastructure & DevOps',
    description: 'Scalable multi-region AWS cloud environments, automated CI/CD deployment pipelines, container orchestration with Kubernetes, and enterprise security.',
    accent: '#0072ff',
    bg: 'rgba(0, 114, 255, 0.1)',
    border: 'rgba(0, 114, 255, 0.25)',
  },
];

const principles = [
  {
    num: '01',
    name: 'Precision Engineering',
    tag: 'Zero-Defect Standard',
    desc: 'Every architecture diagram, database schema, and line of code is purpose-built, type-safe, and thoroughly tested before production deployment.',
    color: '#00d2ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    num: '02',
    name: 'Enterprise Security',
    tag: 'Zero-Trust Architecture',
    desc: 'Security is engineered into every level: encrypted transmission, strict role-based access control (RBAC), sanitized queries, and hardened VPC networks.',
    color: '#ff2a85',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    num: '03',
    name: 'Rapid High Velocity',
    tag: 'Agile & On-Time',
    desc: 'Fast turnaround without quality degradation. Automated CI/CD, modular code reuse, and iterative sprint reviews ensure consistent early delivery.',
    color: '#38bdf8',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    num: '04',
    name: 'Cutting-Edge Innovation',
    tag: 'Modern Tech Stack',
    desc: 'We adopt proven next-generation tools: Next.js Turbopack, containerization, modern neural models, and microservice meshes to future-proof your digital assets.',
    color: '#ec4899',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    num: '05',
    name: 'Direct Transparency',
    tag: 'Engineer-Led Sync',
    desc: 'No middleman clutter. Direct coordination with lead engineers, transparent milestone tracking, and clear communication from kickoff to release.',
    color: '#00d2ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    num: '06',
    name: 'Global Scalability',
    tag: 'Worldwide Reach',
    desc: 'Systems engineered to scale from the first 100 users to millions seamlessly, serving worldwide clients across North America, Europe, and Asia.',
    color: '#ff2a85',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section
      className="about-section"
      id="about"
      aria-label="About EdenCloudix Technologies"
      style={{
        paddingTop: '36px', // Reduced top space so full screen is visible immediately
        paddingBottom: '72px',
        background: 'var(--bg-dark)',
        borderTop: '1px solid rgba(0, 210, 255, 0.18)',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="section-label section-label-blue" style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-cyan)' }} />
            WHO WE ARE
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 10 }}>
            About{' '}
            <span style={{ color: '#00d2ff' }}>Eden</span>
            <span style={{ color: '#ff2a85' }}>Cloudix</span>{' '}
            <span style={{ color: '#ffffff' }}>Technologies</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            A modern technology company focused on building intelligent, scalable, and innovative digital solutions for clients worldwide.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="about-grid" style={{ marginBottom: 54, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '44px', alignItems: 'center' }}>
          {/* Image */}
          <div
            className="about-image-wrapper"
            style={{
              position: 'relative',
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1.5px solid rgba(0, 210, 255, 0.25)',
              boxShadow: '0 0 35px rgba(0, 210, 255, 0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#00d2ff';
              e.currentTarget.style.boxShadow = '0 0 45px rgba(0, 210, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.015)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 210, 255, 0.15)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%' }}>
              <Image
                src="/about-tech.jpg"
                alt="EdenCloudix Technologies modern engineering laboratory"
                fill
                quality={85}
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(6, 10, 23, 0.4) 100%)' }} />
            </div>
          </div>

          {/* Content */}
          <div className="about-content">
            <div>
              <h3 className="heading-lg" style={{ marginBottom: 14 }}>
                Engineering the Future,{' '}
                <span style={{ color: '#ff2a85' }}>One Solution at a Time</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.92rem', marginBottom: 14 }}>
                EdenCloudix Technologies is a forward-thinking engineering firm committed to delivering high-performance, robust, and intelligent systems. We specialize in Artificial Intelligence pipelines, Full-Stack digital products, and Cloud &amp; DevOps infrastructures.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.92rem' }}>
                We empower visionary startups, growing enterprises, and global organizations to transform ambitious digital concepts into scalable, revenue-generating solutions.
              </p>
            </div>

            {/* Vision & Mission Cards - UPGRADED WITH HIGH-TECH ICONS & HOVER */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', margin: '24px 0' }}>
              {/* Vision Card */}
              <div
                style={{
                  padding: '20px 18px',
                  borderRadius: '16px',
                  background: 'rgba(9, 17, 36, 0.85)',
                  border: '1.5px solid rgba(0, 210, 255, 0.22)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#00d2ff';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 210, 255, 0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.22)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'rgba(0, 210, 255, 0.12)',
                    border: '1.5px solid rgba(0, 210, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                    boxShadow: '0 0 14px rgba(0, 210, 255, 0.25)',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00d2ff', fontWeight: 700, marginBottom: 4 }}>
                  OUR VISION
                </p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  To become an internationally recognized engineering partner delivering world-class AI, Full-Stack, and Cloud platforms.
                </p>
              </div>

              {/* Mission Card */}
              <div
                style={{
                  padding: '20px 18px',
                  borderRadius: '16px',
                  background: 'rgba(9, 17, 36, 0.85)',
                  border: '1.5px solid rgba(255, 42, 133, 0.22)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#ff2a85';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 42, 133, 0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 133, 0.22)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'rgba(255, 42, 133, 0.12)',
                    border: '1.5px solid rgba(255, 42, 133, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                    boxShadow: '0 0 14px rgba(255, 42, 133, 0.25)',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4.5c1.2-1.2 3-1.5 3-1.5" />
                    <path d="M15 9V4s3.03.55 4.5 2c1.2 1.2 1.5 3 1.5 3" />
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff2a85', fontWeight: 700, marginBottom: 4 }}>
                  OUR MISSION
                </p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  To build intelligent, secure, and resilient technology architectures that turn innovative ideas into market-dominating software.
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => scrollTo('#start-project')}
              style={{ width: 'fit-content' }}
            >
              Start Your Project 🚀
            </button>
          </div>
        </div>

        {/* Core Specializations */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ecx-pink)', marginBottom: 6, fontWeight: 700 }}>
              TECHNICAL DEPTH
            </p>
            <h3 className="heading-lg">Core Specializations</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {coreItems.map(item => (
              <div
                key={item.title}
                style={{
                  padding: '28px 24px',
                  borderRadius: '20px',
                  background: 'rgba(9, 17, 36, 0.85)',
                  border: `1.5px solid ${item.border}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 36px rgba(0,0,0,0.5), 0 0 20px ${item.bg}`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = item.accent;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.borderColor = item.border;
                }}
                onClick={() => scrollTo('#services')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: item.bg, border: `1.5px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: item.accent, border: `1px solid ${item.border}` }}>
                    {item.badge}
                  </span>
                </div>
                <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.description}</p>
                <div style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: item.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Explore Capabilities →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Stand For - COMPLETELY DELIVERED IN AN ELEVATED, BEAUTIFUL PRESENTATION */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="section-label section-label-pink" style={{ display: 'inline-flex', marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-pink)' }} />
              OUR PHILOSOPHY &amp; FOUNDATION
            </div>
            <h3 className="heading-lg" style={{ marginBottom: 8 }}>
              What We <span style={{ color: '#ff2a85' }}>Stand For</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto' }}>
              The non-negotiable architectural and engineering pillars governing every client delivery.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {principles.map(p => (
              <div
                key={p.name}
                style={{
                  padding: '24px 22px',
                  borderRadius: '18px',
                  background: 'rgba(8, 15, 34, 0.75)',
                  border: '1.5px solid rgba(0, 210, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 14px 35px rgba(0, 0, 0, 0.6), 0 0 20px ${p.color}25`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.15)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: `${p.color}15`,
                      border: `1.5px solid ${p.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {p.icon}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: p.color,
                        background: `${p.color}12`,
                        border: `1px solid ${p.color}30`,
                        padding: '3px 9px',
                        borderRadius: '99px',
                      }}
                    >
                      {p.tag}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'rgba(255,255,255,0.18)',
                      }}
                    >
                      {p.num}
                    </span>
                  </div>
                </div>

                <h4
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {p.name}
                </h4>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.65 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
