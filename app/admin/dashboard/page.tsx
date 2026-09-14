'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Booking {
  id: string;
  requestId: string;
  domain: 'AI' | 'FULL_STACK' | 'CLOUD';
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectTitle: string | null;
  projectDescription: string;
  budget: string | null;
  timeline: string | null;
  status: 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.3)' },
  { value: 'CONTACTED', label: 'Contacted', color: '#2ab8ff', bg: 'rgba(42, 184, 255, 0.15)', border: 'rgba(42, 184, 255, 0.3)' },
  { value: 'IN_DISCUSSION', label: 'In Discussion', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', border: 'rgba(192, 132, 252, 0.3)' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#ff4f7b', bg: 'rgba(255, 79, 123, 0.15)', border: 'rgba(255, 79, 123, 0.3)' },
  { value: 'COMPLETED', label: 'Completed', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.3)' },
  { value: 'CANCELLED', label: 'Cancelled', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' },
] as const;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Status updating / deleting state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (domainFilter) params.append('domain', domainFilter);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', String(currentPage));
      params.append('limit', String(pageSize));

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (res.status === 401) {
        router.push('/admin');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load project requests from database.');
      }

      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching requests.');
      }
    } finally {
      setLoading(false);
    }
  }, [search, domainFilter, statusFilter, currentPage, pageSize, router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus as Booking['status'] } : b))
      );

      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus as Booking['status'] } : null));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRequest = async (id: string, reqId: string) => {
    if (!window.confirm(`Are you sure you want to delete request ${reqId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setBookings((prev) => prev.filter((b) => b.id !== id));
      setTotalRecords((prev) => Math.max(0, prev - 1));
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete request. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Metrics computation for the 6 specific cards
  const metrics = useMemo(() => {
    const total = totalRecords;
    const newReqs = bookings.filter((b) => b.status === 'NEW').length;
    const contacted = bookings.filter((b) => b.status === 'CONTACTED').length;
    const inProgress = bookings.filter((b) => b.status === 'IN_PROGRESS' || b.status === 'IN_DISCUSSION').length;
    const completed = bookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;
    return { total, newReqs, contacted, inProgress, completed, cancelled };
  }, [bookings, totalRecords]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header
        style={{
          background: 'rgba(3, 7, 17, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image
              src="/logo.jpeg"
              alt="EdenCloudix Logo"
              width={38}
              height={38}
              style={{ borderRadius: 8, border: '1px solid rgba(255, 79, 123, 0.35)', objectFit: 'contain' }}
              priority
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-wordmark" style={{ fontSize: '1.125rem', lineHeight: 1.1 }}>
                <span style={{ color: '#60a5fa', fontWeight: 800 }}>Eden</span>
                <span style={{ color: '#ff4f7b', fontWeight: 800 }}>Cloudix</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                ADMIN CONTROL PANEL
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.6875rem', color: '#34d399', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>Database Online</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontSize: '0.8125rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.4)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span>Live Site</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </Link>

          <button
            onClick={fetchBookings}
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              background: 'rgba(30, 138, 240, 0.1)',
              color: '#60a5fa',
              fontSize: '0.8125rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 79, 123, 0.3)',
              background: 'rgba(255, 79, 123, 0.08)',
              color: '#ff4f7b',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 79, 123, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 79, 123, 0.08)';
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '28px', maxWidth: 1400, margin: '0 auto', width: '100%', flex: 1 }}>
        {/* Page Title */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff4f7b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
              <span>✦</span>
              <span>Operations Management</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Project Requests <span style={{ color: '#60a5fa' }}>&amp; Inquiries</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
              Review, update, and manage global client inquiries received through the EdenCloudix portal.
            </p>
          </div>
        </div>

        {/* 6 Required Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '28px',
          }}
        >
          {/* Total Requests */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total Requests
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {metrics.total}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All lifetime inquiries
            </div>
          </div>

          {/* New Requests */}
          <div
            style={{
              background: 'rgba(30, 138, 240, 0.06)',
              border: '1px solid rgba(96, 165, 250, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>New Requests</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {metrics.newReqs}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Needs initial review
            </div>
          </div>

          {/* Contacted Requests */}
          <div
            style={{
              background: 'rgba(42, 184, 255, 0.06)',
              border: '1px solid rgba(42, 184, 255, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#2ab8ff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Contacted
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2ab8ff', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {metrics.contacted}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Outreach initiated
            </div>
          </div>

          {/* In Progress */}
          <div
            style={{
              background: 'rgba(255, 79, 123, 0.06)',
              border: '1px solid rgba(255, 79, 123, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#ff4f7b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              In Progress
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff4f7b', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {metrics.inProgress}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Under active delivery
            </div>
          </div>

          {/* Completed */}
          <div
            style={{
              background: 'rgba(52, 211, 153, 0.06)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Completed
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {metrics.completed}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Successfully delivered
            </div>
          </div>

          {/* Cancelled */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Cancelled
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#94a3b8', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {metrics.cancelled}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Archived or declined
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flex: 1, minWidth: 280 }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <input
                type="text"
                placeholder="Search by client, email, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  color: '#fff',
                  outline: 'none',
                }}
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Service Domain Filter */}
            <select
              value={domainFilter}
              onChange={(e) => {
                setDomainFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '9px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                color: '#fff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Services</option>
              <option value="AI">AI Solutions</option>
              <option value="FULL_STACK">Full-Stack Development</option>
              <option value="CLOUD">Cloud Solutions</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '9px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                color: '#fff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_DISCUSSION">In Discussion</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '6px 8px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', marginBottom: 20, fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Request Management Table */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-deep)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Request ID</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Customer Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Email</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Phone Number</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Selected Service</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Budget</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Timeline</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Submission Date</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      <div className="loading-spinner" style={{ width: 24, height: 24, margin: '0 auto 12px' }} />
                      Loading project requests from database...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📁</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No project requests found</div>
                      <p style={{ fontSize: '0.8125rem' }}>Try adjusting your search criteria or domain filter.</p>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const statusObj = STATUS_OPTIONS.find((s) => s.value === booking.status) || STATUS_OPTIONS[0];

                    return (
                      <tr
                        key={booking.id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s' }}
                      >
                        {/* Request ID */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#60a5fa',
                              background: 'rgba(30, 138, 240, 0.12)',
                              padding: '3px 8px',
                              borderRadius: 4,
                              border: '1px solid rgba(96, 165, 250, 0.25)',
                            }}
                          >
                            {booking.requestId}
                          </span>
                        </td>

                        {/* Customer Name */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem' }}>{booking.name}</div>
                          {booking.company && (
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              🏢 {booking.company}
                            </div>
                          )}
                        </td>

                        {/* Email */}
                        <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          <a
                            href={`mailto:${booking.email}`}
                            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                          >
                            {booking.email}
                          </a>
                        </td>

                        {/* Phone Number */}
                        <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {booking.phone ? (
                            <a
                              href={`tel:${booking.phone}`}
                              style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4f7b')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                            >
                              {booking.phone}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>

                        {/* Selected Service */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 9px',
                              borderRadius: 99,
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              background:
                                booking.domain === 'AI'
                                  ? 'rgba(30, 138, 240, 0.15)'
                                  : booking.domain === 'FULL_STACK'
                                  ? 'rgba(168, 85, 247, 0.15)'
                                  : 'rgba(42, 184, 255, 0.15)',
                              color:
                                booking.domain === 'AI'
                                  ? '#60a5fa'
                                  : booking.domain === 'FULL_STACK'
                                  ? '#c084fc'
                                  : '#2ab8ff',
                              border: `1px solid ${
                                booking.domain === 'AI'
                                  ? 'rgba(96, 165, 250, 0.35)'
                                  : booking.domain === 'FULL_STACK'
                                  ? 'rgba(192, 132, 252, 0.35)'
                                  : 'rgba(42, 184, 255, 0.35)'
                              }`,
                            }}
                          >
                            {booking.domain === 'AI' ? 'AI Solutions' : booking.domain === 'FULL_STACK' ? 'Full-Stack' : 'Cloud Solutions'}
                          </span>
                        </td>

                        {/* Budget */}
                        <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {booking.budget || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>

                        {/* Timeline */}
                        <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {booking.timeline || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>

                        {/* Status (Live Selector) */}
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <select
                            value={booking.status}
                            disabled={updatingId === booking.id}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: 99,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: statusObj.bg,
                              color: statusObj.color,
                              border: `1px solid ${statusObj.border}`,
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st.value} value={st.value} style={{ background: '#0a1628', color: '#fff' }}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Submission Date */}
                        <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(booking.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              style={{
                                padding: '5px 10px',
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(96, 165, 250, 0.1)',
                                border: '1px solid rgba(96, 165, 250, 0.3)',
                                color: '#60a5fa',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(booking.id, booking.requestId)}
                              disabled={deletingId === booking.id}
                              style={{
                                padding: '5px 8px',
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255, 79, 123, 0.1)',
                                border: '1px solid rgba(255, 79, 123, 0.25)',
                                color: '#ff4f7b',
                                cursor: deletingId === booking.id ? 'not-allowed' : 'pointer',
                              }}
                              title="Delete request"
                            >
                              {deletingId === booking.id ? '...' : '✕'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div
            style={{
              padding: '12px 20px',
              background: 'var(--bg-deep)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div>
              Showing {bookings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} project requests
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: currentPage <= 1 ? 'var(--text-muted)' : '#fff',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: currentPage >= totalPages ? 'var(--text-muted)' : '#fff',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Complete Request Detail Modal */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 700,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: '#60a5fa' }}>
                    {selectedBooking.requestId}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 99,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      background: 'rgba(255, 79, 123, 0.15)',
                      color: '#ff4f7b',
                      border: '1px solid rgba(255, 79, 123, 0.3)',
                    }}
                  >
                    {selectedBooking.domain}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Submitted on {new Date(selectedBooking.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Client Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Client Name</div>
                <div style={{ fontWeight: 700, color: '#fff', marginTop: 4 }}>{selectedBooking.name}</div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Email Address</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: '#60a5fa', fontSize: '0.8125rem' }}>{selectedBooking.email}</span>
                  <button
                    onClick={() => copyToClipboard(selectedBooking.email, 'email')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    {copiedField === 'email' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Phone Number</div>
                <div style={{ color: '#fff', marginTop: 4, fontSize: '0.8125rem' }}>{selectedBooking.phone || 'Not provided'}</div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Company / Org</div>
                <div style={{ color: '#fff', marginTop: 4, fontSize: '0.8125rem' }}>{selectedBooking.company || 'Not provided'}</div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Budget Range</div>
                <div style={{ color: '#34d399', fontWeight: 600, marginTop: 4, fontSize: '0.8125rem' }}>{selectedBooking.budget || 'Not specified'}</div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Target Timeline</div>
                <div style={{ color: '#c084fc', fontWeight: 600, marginTop: 4, fontSize: '0.8125rem' }}>{selectedBooking.timeline || 'Not specified'}</div>
              </div>
            </div>

            {/* Project Title if present */}
            {selectedBooking.projectTitle && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                  Project Title / Concept
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{selectedBooking.projectTitle}</div>
              </div>
            )}

            {/* Full Requirements */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                Project Description &amp; Custom Requirements
              </div>
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 16,
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              >
                {selectedBooking.projectDescription}
              </div>
            </div>

            {/* Status Update in Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30, 138, 240, 0.05)', border: '1px solid rgba(96, 165, 250, 0.2)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Current Status
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#fff', marginTop: 2 }}>Update request workflow status</div>
              </div>
              <select
                value={selectedBooking.status}
                disabled={updatingId === selectedBooking.id}
                onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  background: 'var(--bg-elevated)',
                  color: '#fff',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
