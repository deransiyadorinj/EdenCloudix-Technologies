'use client';

import { useState } from 'react';
import ProjectTrackerModal from './ProjectTrackerModal';

type ServiceDomain = 'AI' | 'FULL_STACK' | 'CLOUD';
type TimelineOption = 'ASAP' | '1-4 Weeks' | '1-3 Months' | '3+ Months' | 'Flexible';

interface FormData {
  domain: ServiceDomain | '';
  name: string;
  email: string;
  phone: string;
  company: string;
  projectDescription: string;
  timeline: TimelineOption | '';
  additionalRequirements: string;
}

const STEPS = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Contact' },
  { num: 3, label: 'Scope' },
  { num: 4, label: 'Review' },
];

const TIMELINE_OPTIONS: TimelineOption[] = ['ASAP', '1-4 Weeks', '1-3 Months', '3+ Months', 'Flexible'];

const SERVICE_INFO = {
  AI: {
    icon: '🤖',
    title: 'AI Solutions',
    desc: 'Intelligent systems, LLMs, computer vision, and cognitive automation pipelines.',
    img: '/ai-service.jpg',
    color: '#ff4f7b',
    bg: 'rgba(255,79,123,0.08)',
    border: 'rgba(255,79,123,0.25)',
  },
  FULL_STACK: {
    icon: '💻',
    title: 'Full-Stack Development',
    desc: 'End-to-end web apps, SaaS platforms, robust REST APIs, and database architectures.',
    img: '/fullstack-service.jpg',
    color: '#2ab8ff',
    bg: 'rgba(42,184,255,0.08)',
    border: 'rgba(42,184,255,0.25)',
  },
  CLOUD: {
    icon: '☁️',
    title: 'Cloud Solutions',
    desc: 'Enterprise AWS architecture, Docker, Kubernetes, Terraform, and DevOps CI/CD.',
    img: '/cloud-service.jpg',
    color: '#1e8af0',
    bg: 'rgba(30,138,240,0.08)',
    border: 'rgba(30,138,240,0.25)',
  },
} as const;

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="step-progress" aria-label={`Step ${current} of ${total}`}>
      {STEPS.map((step, i) => (
        <div key={step.num} className="step-item" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div
            className={`step-circle ${current === step.num ? 'active' : current > step.num ? 'done' : ''}`}
            aria-current={current === step.num ? 'step' : undefined}
          >
            {current > step.num ? '✓' : step.num}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${current > step.num ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function StartProject() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    domain: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: '',
    timeline: '',
    additionalRequirements: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [copied, setCopied] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [apiError, setApiError] = useState('');

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (s === 1) {
      if (!form.domain) newErrors.domain = 'Please select a service domain to proceed.';
    }

    if (s === 2) {
      if (!form.name.trim() || form.name.trim().length < 2) {
        newErrors.name = 'Full name must be at least 2 characters.';
      }
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (form.phone.trim() && form.phone.trim().length < 7) {
        newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
      }
    }

    if (s === 3) {
      if (!form.projectDescription.trim() || form.projectDescription.trim().length < 20) {
        newErrors.projectDescription = 'Please provide at least 20 characters describing your project.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(STEPS.length, s + 1));
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    setApiError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: form.domain,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          projectTitle: undefined,
          projectDescription: form.projectDescription.trim(),
          budget: 'Discussed during consultation',
          timeline: form.timeline || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || 'Failed to submit your project request. Please try again.');
        setLoading(false);
        return;
      }

      setRequestId(data.requestId || 'ECX-PROJ-CONFIRMED');
      setSubmitted(true);
    } catch {
      setApiError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyRequestId = async () => {
    if (!requestId) return;
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <>
    <section className="start-project-section" id="start-project" aria-label="Start a Project with EdenCloudix Technologies">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-label section-label-blue" style={{ display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ecx-blue)' }} />
            INITIALIZE YOUR PROJECT
          </div>
          <h2 className="heading-xl" style={{ marginBottom: 14 }}>
            Start Your <span className="text-blue">Project</span> With{' '}
            <span className="text-pink">EdenCloudix</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 540, margin: '0 auto' }}>
            Tell us about your requirements. We engineer tailored, high-performance solutions for clients worldwide.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="booking-card" style={{ maxWidth: 840, margin: '0 auto' }}>
          {submitted ? (
            /* ====== SUCCESS STATE ====== */
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '2px solid #34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '2rem',
                }}
              >
                ✓
              </div>

              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                }}
              >
                REQUEST CONFIRMED
              </span>

              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                Project Request Dispatched!
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
                Thank you, <strong style={{ color: '#fff' }}>{form.name}</strong>. Your project specifications have been securely recorded. Our engineering leads will review your scope and get in touch within 24 hours.
              </p>

              {/* Request ID Display */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-blue)',
                  marginBottom: 32,
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Tracking Reference ID
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--ecx-blue-light)', letterSpacing: '0.05em' }}>
                    {requestId}
                  </div>
                </div>
                <button
                  onClick={copyRequestId}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '6px 14px', borderRadius: 'var(--radius-sm)' }}
                  title="Copy reference ID"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setTrackerOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff, #0077ff)',
                    boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Track Status
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setForm({
                      domain: '',
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      projectDescription: '',
                      timeline: '',
                      additionalRequirements: '',
                    });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff, #0077ff)',
                    boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)',
                  }}
                >
                  Submit Another Request
                </button>
                <a href="#portfolio" className="btn btn-ghost">
                  Explore Projects Showcase
                </a>
              </div>
            </div>
          ) : (
            /* ====== ACTIVE WIZARD FORM ====== */
            <div>
              {/* Step Progress Bar */}
              <StepProgress current={step} total={STEPS.length} />

              {/* Step Title Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 32,
                  paddingBottom: 20,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--ecx-pink)',
                      marginBottom: 4,
                      fontWeight: 700,
                    }}
                  >
                    STEP {step} OF {STEPS.length}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    {step === 1 ? '1. Choose Service Domain' :
                     step === 2 ? '2. Contact Information' :
                     step === 3 ? '3. Project Requirements & Scope' :
                     '4. Timeline & Submission Review'}
                  </h3>
                </div>

                {form.domain && step > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(0, 210, 255, 0.1)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                    }}
                  >
                    <span>{SERVICE_INFO[form.domain as ServiceDomain].icon}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ecx-cyan)', fontWeight: 600 }}>
                      {SERVICE_INFO[form.domain as ServiceDomain].title}
                    </span>
                  </div>
                )}
              </div>

              {/* ====== STEP 1: Service Selection ====== */}
              {step === 1 && (
                <div className="step-content">
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
                    Select the engineering domain that best matches your project vision:
                  </p>
                  <div className="service-selection-grid">
                    {(Object.keys(SERVICE_INFO) as ServiceDomain[]).map(key => {
                      const s = SERVICE_INFO[key];
                      const isSelected = form.domain === key;
                      return (
                        <button
                          key={key}
                          className={`service-option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => updateField('domain', key)}
                          role="radio"
                          aria-checked={isSelected}
                          id={`service-option-${key.toLowerCase()}`}
                          type="button"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: '18px 20px',
                            borderRadius: 'var(--radius-lg)',
                            background: isSelected ? 'rgba(0, 210, 255, 0.08)' : 'var(--bg-card)',
                            border: `1.5px solid ${isSelected ? 'var(--ecx-cyan)' : 'var(--border-subtle)'}`,
                            boxShadow: isSelected ? '0 0 20px rgba(0, 210, 255, 0.25)' : 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              background: s.bg,
                              border: `1px solid ${s.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.4rem',
                              flexShrink: 0,
                            }}
                          >
                            {s.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: 4 }}>
                              {s.title}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              {s.desc}
                            </div>
                          </div>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? s.color : 'rgba(255,255,255,0.2)'}`,
                              background: isSelected ? s.color : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.domain && <p className="form-error" style={{ marginTop: 12 }}>{errors.domain}</p>}
                </div>
              )}

              {/* ====== STEP 2: Contact Details ====== */}
              {step === 2 && (
                <div className="step-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Enter your contact details so our team can coordinate directly with you:
                  </p>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-name">Full Name *</label>
                      <input
                        id="booking-name"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g. Alex Johnson"
                        value={form.name}
                        onChange={e => updateField('name', e.target.value)}
                        autoComplete="name"
                      />
                      {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-email">Work / Personal Email *</label>
                      <input
                        id="booking-email"
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="alex@example.com"
                        value={form.email}
                        onChange={e => updateField('email', e.target.value)}
                        autoComplete="email"
                      />
                      {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-phone">Phone Number (Optional)</label>
                      <input
                        id="booking-phone"
                        type="tel"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        autoComplete="tel"
                      />
                      {errors.phone && <p className="form-error">{errors.phone}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-company">Company / Organization (Optional)</label>
                      <input
                        id="booking-company"
                        className="form-input"
                        placeholder="e.g. Apex Innovations Ltd"
                        value={form.company}
                        onChange={e => updateField('company', e.target.value)}
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ====== STEP 3: Project Requirements ====== */}
              {step === 3 && (
                <div className="step-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Describe what you aim to build, key capabilities, target users, or existing infrastructure:
                  </p>
                  <div className="form-group">
                    <label className="form-label" htmlFor="booking-desc">
                      Project Description & Requirements *
                    </label>
                    <textarea
                      id="booking-desc"
                      className={`form-input form-textarea ${errors.projectDescription ? 'error' : ''}`}
                      rows={6}
                      placeholder={
                        form.domain === 'AI'
                          ? 'Describe your AI project - what core challenge are you solving, what data sources exist, what model or automation outcomes do you require?'
                          : form.domain === 'FULL_STACK'
                          ? 'Describe your application - core user journeys, front-end design ideas, backend API requirements, database scope, third-party integrations...'
                          : 'Describe your cloud infrastructure - current AWS/GCP architecture, migration plans, scalability goals, DevOps CI/CD requirements...'
                      }
                      value={form.projectDescription}
                      onChange={e => updateField('projectDescription', e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.75rem' }}>
                      <span style={{ color: errors.projectDescription ? '#ef4444' : 'var(--text-muted)' }}>
                        Minimum 20 characters required
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {form.projectDescription.length} characters
                      </span>
                    </div>
                    {errors.projectDescription && <p className="form-error">{errors.projectDescription}</p>}
                  </div>
                </div>
              )}

              {/* ====== STEP 4: Timeline & Review (NO BUDGET SELECTION) ====== */}
              {step === 4 && (
                <div className="step-content" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Timeline Selection */}
                  <div>
                    <label className="form-label" style={{ marginBottom: 12 }}>
                      Preferred Target Timeline
                    </label>
                    <div className="option-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                      {TIMELINE_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          className={`option-btn ${form.timeline === opt ? 'selected' : ''}`}
                          onClick={() => updateField('timeline', opt)}
                          type="button"
                          style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${form.timeline === opt ? 'var(--ecx-cyan)' : 'var(--border-subtle)'}`,
                            background: form.timeline === opt ? 'rgba(0, 210, 255, 0.12)' : 'var(--bg-card)',
                            color: form.timeline === opt ? '#fff' : 'var(--text-secondary)',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commercial Terms Notice */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(0, 210, 255, 0.05)',
                      border: '1px solid rgba(0, 210, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>💬</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ecx-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                        Pricing & Commercial Terms
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Project amount and commercial structure are discussed and tailored to your exact deliverables during discovery consultation.
                      </div>
                    </div>
                  </div>

                  {/* Review Summary Grid */}
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                      Specification Summary
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Service Domain</div>
                        <div style={{ color: 'var(--ecx-cyan)', fontWeight: 700, fontSize: '0.9375rem', marginTop: 2 }}>
                          {form.domain ? SERVICE_INFO[form.domain as ServiceDomain].title : '-'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Contact Person</div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', marginTop: 2 }}>
                          {form.name} ({form.email})
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Phone & Organization</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 2 }}>
                          {form.phone || 'No phone'} • {form.company || 'Direct Client'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Target Timeline</div>
                        <div style={{ color: '#34d399', fontWeight: 600, fontSize: '0.875rem', marginTop: 2 }}>
                          {form.timeline || 'Flexible'}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 4 }}>
                        Project Scope Summary
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: 80, overflowY: 'auto' }}>
                        {form.projectDescription}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Error Notification */}
              {apiError && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.875rem',
                    marginTop: 20,
                  }}
                >
                  {apiError}
                </div>
              )}

              {/* Wizard Nav Controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 36,
                  paddingTop: 20,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.875rem', padding: '10px 20px' }}
                    disabled={loading}
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                {step < STEPS.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ fontSize: '0.875rem', padding: '10px 26px', fontWeight: 600 }}
                  >
                    Continue to Step {step + 1} →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary btn-lg"
                    style={{ fontSize: '0.9375rem', fontWeight: 700, padding: '12px 32px' }}
                    disabled={loading}
                  >
                    {loading ? 'Submitting Request...' : 'Submit Project Request 🚀'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

      {/* Project Tracker Modal for instant tracking */}
      <ProjectTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        initialTrackingId={requestId}
      />
    </>
  );
}
