'use client';

import { useState } from 'react';
import Image from 'next/image';

const serviceData = {
  AI: {
    label: 'AI SOLUTIONS',
    heading: 'Intelligent Systems. Real Results.',
    description: 'We build AI-powered solutions that transform how businesses operate — from machine learning and predictive analytics to computer vision, natural language processing, and intelligent automation.',
    items: ['AI Applications', 'Machine Learning Solutions', 'AI Automation', 'Intelligent Systems', 'AI-Powered Web Apps', 'Data-Driven Solutions', 'Custom AI Integrations', 'NLP & Computer Vision'],
    tech: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'Keras', 'Pandas', 'NumPy'],
    color: '#ff4f7b',
    image: '/ai-service.jpg',
    btnText: 'Build with AI',
  },
  FULL_STACK: {
    label: 'FULL-STACK DEVELOPMENT',
    heading: 'End-to-End Software Architecture.',
    description: 'Complete digital product development — from pixel-perfect frontends to robust backend systems, REST APIs, SaaS platforms, and database architectures deployed with confidence.',
    items: ['Full-Stack Web Applications', 'SaaS Platforms', 'Business Applications', 'REST APIs', 'Database Systems', 'Authentication Systems', 'Custom Software', 'Scalable Web Platforms'],
    tech: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'AWS'],
    color: '#2ab8ff',
    image: '/fullstack-service.jpg',
    btnText: 'Build Your Platform',
  },
  CLOUD: {
    label: 'CLOUD SOLUTIONS',
    heading: 'Scalable Infrastructure. Secure. Reliable.',
    description: 'Design and manage cloud infrastructure that scales effortlessly — cloud migration, DevOps pipelines, network design, security hardening, and AWS architecture for global delivery.',
    items: ['Cloud Architecture', 'Cloud Deployment', 'Cloud Infrastructure', 'Scalable Applications', 'Cloud Migration', 'DevOps Automation', 'Monitoring & Observability', 'Cloud Optimization'],
    tech: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'GitHub Actions', 'CloudWatch', 'VPC'],
    color: '#1e8af0',
    image: '/cloud-service.jpg',
    btnText: 'Move to the Cloud',
  },
} as const;

type ServiceKey = keyof typeof serviceData;

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) {
    const pos = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: Math.max(0, pos), behavior: 'smooth' });
  }
};

export default function Services() {
  const [active, setActive] = useState<ServiceKey>('AI');
  const data = serviceData[active];

  return (
    <section className="services-section" id="services" aria-label="Our services">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="section-label section-label-pink" style={{ display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-pink)' }} />
            WHAT WE DO
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 14 }}>
            THREE PILLARS OF{' '}
            <span className="text-pink">DIGITAL EXCELLENCE</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 520, margin: '0 auto' }}>
            Specialized technology services built on deep expertise, uncompromising quality, and rapid delivery.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="service-tabs" role="tablist" aria-label="Service categories">
          {(Object.keys(serviceData) as ServiceKey[]).map(key => (
            <button
              key={key}
              className={`service-tab ${active === key ? 'active' : ''}`}
              role="tab"
              aria-selected={active === key}
              onClick={() => setActive(key)}
              id={`service-tab-${key.toLowerCase()}`}
            >
              {key === 'AI' ? 'AI Solutions' : key === 'FULL_STACK' ? 'Full-Stack Dev' : 'Cloud Solutions'}
            </button>
          ))}
        </div>

        {/* Service Content */}
        <div className="service-world" role="tabpanel" aria-labelledby={`service-tab-${active.toLowerCase()}`}>
          {/* Image */}
          <div className="service-image-area">
            <Image
              src={data.image}
              alt={`${data.label} — EdenCloudix Technologies`}
              fill
              quality={80}
              style={{ objectFit: 'cover' }}
            />
            <div className="service-image-badge">
              {data.label}
            </div>
          </div>

          {/* Content */}
          <div className="service-content">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: data.color, marginBottom: 8 }}>
                {data.label}
              </p>
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(1.35rem,2.5vw,1.85rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 12 }}>
                {data.heading}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75 }}>
                {data.description}
              </p>
            </div>

            {/* Items */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                SERVICES INCLUDE
              </p>
              <div className="service-items">
                {data.items.map(item => (
                  <div key={item} className="service-item">
                    <span className="service-item-dot" style={{ background: data.color, boxShadow: `0 0 6px ${data.color}80` }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                TECHNOLOGY ECOSYSTEM
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {data.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => scrollTo('#start-project')}
              style={{ width: 'fit-content', fontWeight: 600, fontSize: '0.875rem', padding: '10px 22px' }}
              aria-label={`Start a ${active === 'AI' ? 'AI' : active === 'FULL_STACK' ? 'Full-Stack' : 'Cloud'} project`}
            >
              {data.btnText} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
