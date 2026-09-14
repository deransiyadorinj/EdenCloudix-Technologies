'use client';

export default function WhyUs() {
  const items = [
    {
      title: 'Precision Engineering',
      desc: 'Every solution is crafted with meticulous attention to detail, type safety, performance optimization, and production-grade code quality.',
      accent: '#00d2ff',
      bg: 'rgba(0, 210, 255, 0.1)',
      border: 'rgba(0, 210, 255, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      ),
    },
    {
      title: 'Rapid High Velocity',
      desc: 'We move fast without cutting corners. Agile workflows, CI/CD automation, and clear milestones ensure on-time project delivery.',
      accent: '#ff2a85',
      bg: 'rgba(255, 42, 133, 0.1)',
      border: 'rgba(255, 42, 133, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: 'Enterprise Security & Zero-Trust',
      desc: 'Security is engineered into every architectural layer — from JWT authentication and TLS encryption to zero-trust cloud VPCs and sanitized DB queries.',
      accent: '#0072ff',
      bg: 'rgba(0, 114, 255, 0.1)',
      border: 'rgba(0, 114, 255, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0072ff" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: 'Worldwide Global Delivery',
      desc: 'We serve clients anywhere in the world — seamlessly adapting to your timezone, language, and business requirements with 24/7 async execution.',
      accent: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      title: 'Full Transparency & Direct Sync',
      desc: 'Direct developer communication, honest scopes, and transparent progress updates throughout every single stage of your project.',
      accent: '#34d399',
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      title: 'Bespoke Custom Solutions',
      desc: 'No cookie-cutter templates. Every system is custom-architected and built to solve your unique enterprise challenges and drive revenue.',
      accent: '#00d2ff',
      bg: 'rgba(0, 210, 255, 0.1)',
      border: 'rgba(0, 210, 255, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      title: 'Cloud Cost Optimization',
      desc: 'Architecting auto-scaling serverless and containerized clusters that eliminate idle resources, achieving up to 40% reduction in cloud infrastructure bills.',
      accent: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: 'End-to-End Product Lifecycle',
      desc: 'From initial architectural discovery and UX prototyping to production deployment, monitoring, and ongoing post-launch scaling partnership.',
      accent: '#ff2a85',
      bg: 'rgba(255, 42, 133, 0.1)',
      border: 'rgba(255, 42, 133, 0.25)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff2a85" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <section className="why-us-section" id="why-us" aria-label="Why choose EdenCloudix Technologies">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="section-label section-label-pink" style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff2a85' }} />
            WHY CHOOSE US
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 14 }}>
            Why <span style={{ color: '#00d2ff' }}>Eden</span><span style={{ color: '#ff2a85' }}>Cloudix</span> Technologies?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 580, margin: '0 auto', lineHeight: 1.75 }}>
            We combine high-tier cloud architecture and deep AI engineering with personal, dedicated commitment to your project success.
          </p>
        </div>

        {/* 8 Cards Grid with Hover Effects */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="why-us-card"
              style={{
                border: `1.5px solid ${item.border}`,
                background: 'rgba(12, 22, 52, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '18px',
                padding: '28px 24px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.accent;
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px ${item.accent}30`;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = item.border;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div
                className="why-us-icon"
                style={{
                  background: item.bg,
                  border: `1.5px solid ${item.border}`,
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  transition: 'transform 0.3s ease',
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.865rem', color: '#94a3b8', lineHeight: 1.75 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
