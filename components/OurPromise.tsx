'use client';

export default function OurPromise() {
  const promises = [
    { icon: '📋', title: 'Clear Requirements', desc: 'We take time to fully understand your vision before writing a single line of code.' },
    { icon: '🏗️', title: 'Solid Architecture', desc: 'Scalable, maintainable, and well-documented codebases built to last.' },
    { icon: '✅', title: 'Quality Assurance', desc: 'Thorough testing at every stage to ensure your solution works flawlessly.' },
    { icon: '🚀', title: 'Production Ready', desc: 'Deployed, optimized, and ready for real users from day one.' },
  ];

  return (
    <section style={{ padding: 'var(--section-pad) 0', background: 'var(--bg-deep)' }} id="promise" aria-label="Our promise">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label section-label-blue" style={{ display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-blue)' }} />
            OUR COMMITMENT
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 14 }}>
            Our Promise <span className="text-blue">to You</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 520, margin: '0 auto' }}>
            When you work with EdenCloudix Technologies, you get more than just code. You get a committed technology partner.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {promises.map((p, i) => (
            <div
              key={p.title}
              style={{
                padding: '28px 24px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = i % 2 === 0 ? 'rgba(30,138,240,0.35)' : 'rgba(255,79,123,0.35)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-card)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
            >
              <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                0{i + 1}
              </div>
              <div style={{ fontSize: '1.5rem', marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.0625rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
