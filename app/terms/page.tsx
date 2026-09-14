import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Terms of Service — EdenCloudix Technologies',
  description: 'Terms of service, engineering engagement standards, and operational guidelines for EdenCloudix Technologies.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = 'March 11, 2026';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(5, 11, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <Image src="/logo.jpeg" alt="EdenCloudix Technologies" width={36} height={36} style={{ borderRadius: '8px' }} />
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>EdenCloudix</span>
          </Link>
          <Link
            href="/"
            className="btn btn-ghost"
            style={{ fontSize: '0.8125rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '80px 0 40px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <p className="label-tag" style={{ marginBottom: '16px' }}>SERVICE AGREEMENT</p>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            Terms of <span className="text-gradient-blue">Service</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
            These terms govern your access to EdenCloudix Technologies website and outline our engineering engagement terms.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <main style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '840px', lineHeight: 1.85, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing our website (https://edencloudix.tech), submitting a project request, or commissioning engineering services from EdenCloudix Technologies, you agree to comply with and be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              2. Scope of Engineering Services
            </h2>
            <p style={{ marginBottom: '14px' }}>
              EdenCloudix Technologies provides professional software engineering across three primary domains:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>AI Solutions:</strong> Custom AI models, LLM workflows, automated cognitive pipelines, and intelligent agents.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Full-Stack Development:</strong> Scalable web applications, modern responsive interfaces, REST/GraphQL APIs, and database architectures.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Cloud Engineering:</strong> Multi-region cloud infrastructure, container orchestration, automated CI/CD pipelines, and DevOps consulting.</li>
            </ul>
            <p style={{ marginTop: '14px' }}>
              Formal client engagements are governed by individual Statements of Work (SOW) or Master Services Agreements (MSA) detailing deliverables, milestones, and timelines.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              3. Intellectual Property Rights
            </h2>
            <p style={{ marginBottom: '14px' }}>
              Upon full settlement of contracted invoices for custom client software:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Client Ownership:</strong> The client retains exclusive ownership and intellectual property of custom source code, assets, and deliverables specifically commissioned for their project.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Pre-existing IP & Tools:</strong> EdenCloudix Technologies retains rights to pre-existing libraries, general utilities, and reusable boilerplate frameworks, granting the client a perpetual, non-exclusive license to utilize them within the deliverable.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              4. Project Requests & Quotations
            </h2>
            <p>
              Submission of a project request through our website does not create a binding commitment or contract until an official technical proposal is approved in writing by both parties. We reserve the right to decline project inquiries that conflict with ethical considerations or engineering capacity.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              5. Acceptable Use of Website
            </h2>
            <p>
              You agree not to attempt unauthorized access to our administrative systems, execute automated vulnerability scans, overload our servers via automated booking spam, or reverse-engineer our proprietary platform assets.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              6. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, EdenCloudix Technologies and its engineers shall not be liable for any indirect, incidental, special, or consequential damages resulting from website downtime or third-party service outages.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              7. Governing Law & Dispute Resolution
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              8. Contact
            </h2>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              <p style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontWeight: 600 }}>EdenCloudix Technologies</p>
              <p style={{ margin: '0 0 6px' }}>Email: <a href="mailto:admin@edencloudix.tech" style={{ color: 'var(--ecx-cyan)' }}>admin@edencloudix.tech</a></p>
              <p style={{ margin: 0 }}>Website: <a href="https://edencloudix.tech" style={{ color: 'var(--ecx-cyan)' }}>https://edencloudix.tech</a></p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <div className="container">
          © {new Date().getFullYear()} EdenCloudix Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
