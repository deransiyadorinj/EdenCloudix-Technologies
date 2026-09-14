import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Privacy Policy — EdenCloudix Technologies',
  description: 'Learn how EdenCloudix Technologies protects your personal data, handles project requests, and safeguards your intellectual property.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
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
          <p className="label-tag" style={{ marginBottom: '16px' }}>LEGAL TRANSPARENCY</p>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            Privacy <span className="text-gradient-blue">Policy</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
            EdenCloudix Technologies is committed to honoring your privacy and securing any personal or proprietary information you entrust to us.
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
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: '14px' }}>
              When you interact with our website or initiate a project proposal via our &quot;Start a Project&quot; form, we collect information you voluntarily provide, including:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Contact Information:</strong> Your name, email address, phone number, and organization name.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Project Details:</strong> Service domain (AI Solutions, Full-Stack, Cloud Engineering), project descriptions, budget estimates, and timelines.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Technical Telemetry:</strong> Anonymized server logs, IP addresses (for rate limiting and DDoS prevention), browser type, and interaction metrics.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: '14px' }}>
              We utilize collected information strictly for legitimate business purposes:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>To evaluate project feasibility, prepare architectural proposals, and formulate technical scopes.</li>
              <li>To transmit notifications to our core engineering team (via private WhatsApp and secured email channels) for rapid response.</li>
              <li>To maintain our administrative registry of client discussions and project milestones.</li>
              <li>To protect our infrastructure against automated misuse, spam, and denial-of-service attempts.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              3. Confidentiality & Non-Disclosure (NDA)
            </h2>
            <p style={{ marginBottom: '14px' }}>
              We recognize that project inquiries often contain proprietary ideas and competitive trade secrets. EdenCloudix Technologies guarantees:
            </p>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                All project submissions, architecture briefs, and requirements shared with EdenCloudix Technologies are treated as strictly confidential. We execute mutual Non-Disclosure Agreements (NDAs) prior to in-depth technical disclosures upon client request.
              </p>
            </div>
            <p>
              We do not sell, rent, trade, or monetize your contact details or project data to any third party under any circumstances.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              4. Data Retention and Security
            </h2>
            <p>
              We implement industry-standard cryptographic practices, including TLS encryption in transit, encrypted PostgreSQL database storage, and strict role-based access tokens. Data is retained only as long as necessary to facilitate ongoing project collaboration or legal accounting records.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              5. Your Privacy Rights
            </h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to inaccurate records, or request complete deletion of your booking history from our active databases. To exercise these rights, please email us directly.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              6. Contact Us
            </h2>
            <p>
              For privacy inquiries, NDA requests, or data removal requests:
            </p>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginTop: '16px',
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
