'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProjectItem {
  id: string;
  category: 'Full Stack' | 'Cloud' | 'Networking';
  badgeClass: string;
  badgeLabel: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  gallery: string[];
  githubUrl: string;
  demoUrl?: string;
  linkedinUrl?: string;
  metrics: string;
  highlights: string[];
  techStack: string[];
}

const projects: ProjectItem[] = [
  {
    id: 'proj1',
    category: 'Full Stack',
    badgeClass: 'vp-badge-fullstack',
    badgeLabel: 'Full Stack Project',
    title: 'Tamilji Holidays',
    description:
      'A complete Full Stack web application for a travel/holiday business. Both frontend and backend are integrated with a fully functional admin panel for managing bookings, tour packages, fleet tracking, and customer inquiries.',
    tags: ['Full Stack', 'Frontend', 'Backend', 'Admin Panel', 'Next.js', 'MariaDB / PostgreSQL'],
    coverImage: '/projects/proj1-cover.png',
    gallery: [
      '/projects/proj1-cover.png',
      '/projects/proj1-2.png',
      '/projects/proj1-3.png',
      '/projects/proj1-4.png',
      '/projects/proj1-5.png',
      '/projects/proj1-6.png',
      '/projects/proj1-7.png',
      '/projects/proj1-8.png',
      '/projects/proj1-9.png',
    ],
    githubUrl: 'https://github.com/deransiyadorinj/Tamiljiholidays-Frontend',
    demoUrl: 'https://www.instagram.com/reel/Dc0Atgyvs0s',
    linkedinUrl: 'https://www.linkedin.com/posts/deransiya-dorin-j-a63185353_fullstackdevelopment-webdevelopment-python-activity-7501119158559051776-83hw?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFgf66sBTLevKRh_unxK-ODBZJHNkhTz5k8',
    metrics: 'Production Deployed • 100% Responsive',
    highlights: [
      'End-to-end travel portal with real-time booking engine',
      'Dynamic admin management dashboard for packages & vehicles',
      'High-performance responsive UI optimized for mobile devices',
      'Secure customer data handling and inquiry automation',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'Express', 'MariaDB', 'REST APIs', 'JWT Auth'],
  },
  {
    id: 'proj2',
    category: 'Cloud',
    badgeClass: 'vp-badge-cloud',
    badgeLabel: 'Cloud Project',
    title: 'Cloud Monitoring Digital Twin',
    description:
      'A cloud-based digital twin system for real-time infrastructure monitoring. Visualizes cloud resource metrics, alerts, health status, and live performance data in an immersive dashboard environment.',
    tags: ['Cloud', 'Monitoring', 'Digital Twin', 'Infrastructure', 'AWS', 'Telemetry'],
    coverImage: '/projects/proj2-cover.png',
    gallery: [
      '/projects/proj2-cover.png',
      '/projects/proj2-2.png',
      '/projects/proj2-3.png',
      '/projects/proj2-4.png',
      '/projects/proj2-5.png',
      '/projects/proj2-6.png',
      '/projects/proj2-7.png',
    ],
    githubUrl: 'https://github.com/deransiyadorinj/Cloud-Monitoring-Digital-Twin',
    demoUrl: 'https://www.instagram.com/reel/DdQpowHuWXO/?stkn=MWZyYmNsNTdxN2ttMA==',
    linkedinUrl: 'https://lnkd.in/p/gvDaSWSj',
    metrics: '99.99% Telemetry Uptime • Sub-Second Latency',
    highlights: [
      'Real-time digital twin visualization of cloud computing clusters',
      'Continuous metric streaming and automated threshold alerts',
      'Containerized microservices topology mapping',
      'AWS CloudWatch and Prometheus observability integration',
    ],
    techStack: ['AWS Cloud', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana', 'Python', 'WebSocket'],
  },
  {
    id: 'proj3',
    category: 'Networking',
    badgeClass: 'vp-badge-network',
    badgeLabel: 'Networking Project',
    title: 'Enterprise Network Design Simulation',
    description:
      'Enterprise-level network design and simulation project. Covers complex topology design, VLAN configuration, dynamic routing protocols (OSPF/BGP), firewall security, and end-to-end connectivity in a simulated enterprise environment.',
    tags: ['Networking', 'Enterprise', 'Simulation', 'VLAN', 'Routing', 'Security'],
    coverImage: '/projects/proj3-cover.png',
    gallery: [
      '/projects/proj3-cover.png',
      '/projects/proj3-2.png',
      '/projects/proj3-3.png',
      '/projects/proj3-4.png',
    ],
    githubUrl: 'https://github.com/deransiyadorinj/Enterprise-Network-Design-Simulation',
    demoUrl: '#gallery',
    linkedinUrl: 'https://www.linkedin.com/in/deransiya-dorin-j-a63185353',
    metrics: 'Zero Packet Loss • Redundant Topology',
    highlights: [
      'Multi-tier enterprise campus network architecture design',
      'VLAN segmentation, trunking, and inter-VLAN routing',
      'High-availability gateway redundancy (HSRP/VRRP)',
      'Enterprise firewall access control lists (ACLs) and NAT',
    ],
    techStack: ['Cisco Packet Tracer', 'GNS3', 'Wireshark', 'OSPF', 'BGP', 'VLANs', 'Network ACLs'],
  },
];

const categories = ['All', 'Full Stack', 'Cloud', 'Networking'] as const;

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number>(0);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter(p => p.category === activeCategory);

  const openModal = (project: ProjectItem, index = 0) => {
    setActiveModalProject(project);
    setSelectedGalleryIndex(index);
  };

  const closeModal = () => {
    setActiveModalProject(null);
    setSelectedGalleryIndex(0);
  };

  return (
    <section className="portfolio-section" id="portfolio" aria-label="Projects & Portfolio Showcase">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 className="section-title">
            <span className="gradient-text">Projects</span>
          </h2>
          <div className="title-underline" />
          <p className="section-subtitle">
            Full Stack, Cloud, and Networking projects with live demos
          </p>
        </div>

        {/* Category Filters */}
        <div className="portfolio-filters" role="tablist" aria-label="Filter projects by domain">
          {categories.map(cat => (
            <button
              key={cat}
              className={`portfolio-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards List */}
        <div className="portfolio-list" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {filteredProjects.map(project => (
            <article key={project.id} className="vp-card" aria-label={project.title}>
              {/* Category Ribbon Badge */}
              <div className={`vp-badge ${project.badgeClass}`}>
                {project.badgeLabel}
              </div>

              {/* Card Body: Split Grid */}
              <div className="vp-body">
                {/* Left Side: Mockup Browser Gallery */}
                <div
                  className="vp-gallery"
                  onClick={() => openModal(project, 0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && openModal(project, 0)}
                  aria-label={`View gallery for ${project.title}`}
                  title="Click to view full gallery & interactive preview"
                >
                  {/* Browser Mockup Header */}
                  <div className="vp-mockup-header">
                    <div className="vp-mockup-dots">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    <div className="vp-mockup-url">
                      https://{project.title.toLowerCase().replace(/\s+/g, '')}.com
                    </div>
                    <div style={{ width: 36 }} />
                  </div>

                  {/* Cover Image */}
                  <div className="vp-cover-wrapper">
                    <Image
                      src={project.coverImage}
                      alt={`${project.title} Cover Screenshot`}
                      width={640}
                      height={400}
                      className="vp-cover-img"
                      priority={project.id === 'proj1'}
                    />
                  </div>

                  {/* Hover Gallery Hint */}
                  <div className="vp-gallery-hint">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Click to view live gallery ({project.gallery.length} screenshots)</span>
                  </div>
                </div>

                {/* Right Side: Project Details */}
                <div className="vp-details">
                  {/* Status telemetry chip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span className="vp-metric-chip">
                      <span className="vp-metric-pulse" />
                      {project.metrics}
                    </span>
                  </div>

                  <h3 className="vp-title">{project.title}</h3>

                  <p className="vp-desc">{project.description}</p>

                  {/* Technology Tags */}
                  <div className="project-tags">
                    {project.tags.map((tag, idx) => (
                      <span key={tag} className={`tag ${idx === 0 ? 'tag-primary' : ''}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="vp-links">
                    {/* View on GitHub */}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vp-btn vp-btn-github"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>View on GitHub</span>
                    </a>

                    {/* Project Demo */}
                    {project.demoUrl && project.demoUrl !== '#gallery' ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vp-btn vp-btn-insta"
                        title="Watch Project Demo Video"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                        <span>Project Demo</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openModal(project, 0)}
                        className="vp-btn vp-btn-insta"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" fill="white" />
                        </svg>
                        <span>Project Demo</span>
                      </button>
                    )}

                    {/* LinkedIn Post */}
                    {project.linkedinUrl ? (
                      <a
                        href={project.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vp-btn vp-btn-linkedin"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span>LinkedIn Post</span>
                      </a>
                    ) : (
                      <span className="vp-btn vp-btn-placeholder">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <em>LinkedIn Post — Coming Soon</em>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* FOR MORE PROJECTS VIEW MY GITHUB - PROMINENT GITHUB CARD AS REQUESTED */}
        <div
          style={{
            marginTop: 48,
            padding: '36px 32px',
            background: 'linear-gradient(135deg, rgba(8, 16, 38, 0.95) 0%, rgba(14, 26, 60, 0.9) 100%)',
            border: '1.5px solid rgba(0, 210, 255, 0.3)',
            borderRadius: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 210, 255, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#00d2ff';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 210, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 210, 255, 0.15)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '99px',
                  background: 'rgba(0, 210, 255, 0.15)',
                  border: '1px solid rgba(0, 210, 255, 0.35)',
                  color: '#00d2ff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                OPEN SOURCE &amp; REPOSITORIES
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              For More Projects, View My GitHub
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Explore full source codes, architecture topologies, database migrations, CI/CD scripts, and ongoing open-source engineering work on GitHub.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="https://github.com/deransiyadorinj"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontWeight: 700,
                fontSize: '1rem',
                padding: '14px 28px',
                boxShadow: '0 4px 20px rgba(0, 210, 255, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>View GitHub Profile</span>
            </a>
          </div>
        </div>

        {/* ====== INTERACTIVE GALLERY & LIVE DEMO MODAL ====== */}
        {activeModalProject && (
          <div
            className="vp-modal-backdrop"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeModalProject.title} Gallery Walkthrough`}
          >
            <div
              className="vp-modal-content"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="vp-modal-header">
                <div>
                  <span className={`vp-badge-inline ${activeModalProject.badgeClass}`}>
                    {activeModalProject.badgeLabel}
                  </span>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginTop: 4 }}>
                    {activeModalProject.title} — Interactive Showcase
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="vp-modal-close"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Main View */}
              <div className="vp-modal-body">
                {/* Main Selected Image */}
                <div className="vp-modal-main-img-wrapper">
                  <Image
                    src={activeModalProject.gallery[selectedGalleryIndex] || activeModalProject.coverImage}
                    alt={`${activeModalProject.title} Screenshot ${selectedGalleryIndex + 1}`}
                    width={900}
                    height={520}
                    className="vp-modal-main-img"
                  />
                  <div className="vp-modal-img-counter">
                    Image {selectedGalleryIndex + 1} of {activeModalProject.gallery.length}
                  </div>
                </div>

                {/* Thumbnails Row */}
                {activeModalProject.gallery.length > 1 && (
                  <div className="vp-modal-thumbnails">
                    {activeModalProject.gallery.map((imgUrl, i) => (
                      <button
                        key={imgUrl}
                        type="button"
                        className={`vp-modal-thumb ${selectedGalleryIndex === i ? 'active' : ''}`}
                        onClick={() => setSelectedGalleryIndex(i)}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Thumbnail ${i + 1}`}
                          width={80}
                          height={50}
                          style={{ objectFit: 'cover' }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Details in Modal */}
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
                    Architecture Highlights & Deliverables
                  </h4>
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8, marginBottom: 16 }}>
                    {activeModalProject.highlights.map(hl => (
                      <li key={hl} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--ecx-pink)', fontWeight: 700 }}>✓</span>
                        {hl}
                      </li>
                    ))}
                  </ul>

                  {/* Modal Action Links */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <a
                      href={activeModalProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vp-btn vp-btn-github"
                    >
                      View GitHub Repository
                    </a>
                    {activeModalProject.demoUrl && activeModalProject.demoUrl !== '#gallery' && (
                      <a
                        href={activeModalProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vp-btn vp-btn-insta"
                      >
                        Watch Project Demo
                      </a>
                    )}
                    {activeModalProject.linkedinUrl && (
                      <a
                        href={activeModalProject.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vp-btn vp-btn-linkedin"
                      >
                        LinkedIn Post
                      </a>
                    )}
                    <a
                      href="#start-project"
                      onClick={closeModal}
                      className="btn btn-primary"
                      style={{ marginLeft: 'auto' }}
                    >
                      Build a Similar Solution →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
