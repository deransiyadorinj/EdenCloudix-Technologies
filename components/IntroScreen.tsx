'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ─── Particle canvas ──────────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface P { x: number; y: number; r: number; dx: number; dy: number; a: number; }
    const pts: P[] = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.55 + 0.15,
    }));

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,210,255,${p.a})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  );
}

/* ─── Animated progress bar ───────────────────────────────────────── */
function ProgressBar({ duration }: { duration: number }) {
  return (
    <div style={{ width: 200, height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 28 }}>
      <div
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 3,
          background: 'linear-gradient(90deg, #00d2ff, #a855f7, #ff2a85)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          animation: `ecxProgress ${duration}ms linear forwards`,
          boxShadow: '0 0 8px rgba(0,210,255,0.6)',
        }}
      />
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */
const DURATION = 3000;

export default function IntroScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible');
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setPhase('fading');
    setTimeout(() => setPhase('done'), 500);
  };

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #0d1230 0%, #060a17 70%)',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
        userSelect: 'none',
      }}
    >
      <ParticleCanvas />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* ── Circle logo with spin animations ── */}
        <div
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            marginBottom: 28,
            animation: 'ecxSlideUp 0.65s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          {/* outer soft pulse halo */}
          <div
            style={{
              position: 'absolute',
              inset: -18,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,210,255,0.18) 0%, rgba(168,85,247,0.1) 50%, transparent 70%)',
              animation: 'ecxHaloPulse 3s ease-out both',
              pointerEvents: 'none',
            }}
          />
          {/* rotating conic glow ring */}
          <div
            style={{
              position: 'absolute',
              inset: -5,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #00d2ff, #a855f7, #ff2a85, #00d2ff)',
              animation: 'ecxRingRotate 3s cubic-bezier(.2,0.7,.3,1) both',
              boxShadow: '0 0 22px rgba(0,210,255,0.5), 0 0 44px rgba(255,42,133,0.3)',
              padding: 3,
            }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#060a17' }} />
          </div>
          {/* orbiting spark dots rotating in sync */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              animation: 'ecxRingRotate 3s cubic-bezier(.2,0.7,.3,1) both',
              pointerEvents: 'none',
            }}
          >
            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 7,
                  height: 7,
                  marginTop: -3.5,
                  marginLeft: -3.5,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#00d2ff' : '#ff2a85',
                  boxShadow: i % 2 === 0
                    ? '0 0 8px 2px rgba(0,210,255,0.9)'
                    : '0 0 8px 2px rgba(255,42,133,0.9)',
                  transform: `rotate(${deg}deg) translateX(78px)`,
                }}
              />
            ))}
          </div>
          {/* logo spins once over 3s matching skip time and lands upright */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              overflow: 'hidden',
              animation: 'ecxLogoSpin 3s cubic-bezier(.2,0.7,.3,1) both',
            }}
          >
            <Image src="/logo.jpeg" alt="EdenCloudix Technologies" fill style={{ objectFit: 'cover' }} priority />
          </div>
        </div>

        {/* ── Company name pill ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #00d2ff 0%, #a855f7 55%, #ff2a85 100%)',
            borderRadius: 999,
            padding: '7px 28px',
            marginBottom: 24,
            animation: 'ecxSlideUp 0.65s 0.1s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk','Inter',sans-serif",
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            EdenCloudix Technologies
          </span>
        </div>

        {/* ── Tagline ── */}
        <div
          style={{
            textAlign: 'center',
            lineHeight: 1.25,
            marginBottom: 24,
            animation: 'ecxSlideUp 0.65s 0.18s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.5rem,4.5vw,2.2rem)', color: '#e2e8f0' }}>
            &quot;You Dream,
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk','Inter',sans-serif",
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem,4.5vw,2.2rem)',
              background: 'linear-gradient(135deg,#00d2ff 0%,#ff2a85 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            We Stream&quot;
          </div>
        </div>

        {/* ── Gradient divider ── */}
        <div
          style={{
            width: 160,
            height: 2,
            borderRadius: 2,
            background: 'linear-gradient(90deg,transparent,#00d2ff 30%,#ff2a85 70%,transparent)',
            marginBottom: 28,
            animation: 'ecxSlideUp 0.65s 0.24s cubic-bezier(.22,1,.36,1) both',
          }}
        />

        {/* ── Animated progress line ── */}
        <div style={{ animation: 'ecxSlideUp 0.65s 0.3s cubic-bezier(.22,1,.36,1) both' }}>
          <ProgressBar duration={DURATION} />
        </div>

        {/* ── Skip Intro button ── */}
        <button
          onClick={dismiss}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            padding: '10px 36px',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: "'Inter',sans-serif",
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            backdropFilter: 'blur(8px)',
            animation: 'ecxSlideUp 0.65s 0.36s cubic-bezier(.22,1,.36,1) both',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = 'rgba(0,210,255,0.15)';
            b.style.color = '#fff';
            b.style.borderColor = 'rgba(0,210,255,0.6)';
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = 'rgba(255,255,255,0.05)';
            b.style.color = 'rgba(255,255,255,0.8)';
            b.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          Skip Intro
        </button>
      </div>

      <style>{`
        @keyframes ecxSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ecxProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes ecxLogoSpin {
          0%   { opacity: 0; transform: rotate(0deg) scale(0.75); }
          30%  { opacity: 1; }
          100% { opacity: 1; transform: rotate(360deg) scale(1); }
        }
        @keyframes ecxRingRotate {
          0%   { transform: rotate(0deg) scale(0.75); opacity: 0.4; }
          30%  { opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes ecxHaloPulse {
          0%   { opacity: 0; transform: scale(0.6); }
          40%  { opacity: 1; transform: scale(1.15); }
          70%  { opacity: 0.6; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1); }
        }
        @keyframes ecxOrbit {
          0%   { opacity: 0; transform: rotate(var(--r,0deg)) translateX(78px) scale(0); }
          25%  { opacity: 1; }
          85%  { opacity: 0.8; }
          100% { opacity: 0; transform: rotate(calc(var(--r,0deg) + 360deg)) translateX(78px) scale(1); }
        }
      `}</style>
    </div>
  );
}
