import React, { useRef, useEffect } from 'react';

interface VideoSectionProps {
  scrollProgress?: number; // Normalised 0..1 — optional, static on mobile
  isMobile?: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  scrollProgress = 1,
  isMobile = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Ensure the video actually plays (some browsers need a push) */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => {
      /* autoplay blocked — silently ignore */
    });
  }, []);

  const sp = Math.max(0, Math.min(1, scrollProgress));

  /* ── Parallax / entrance animation values (desktop only) ── */
  const textOpacity   = isMobile ? 1 : Math.min(1, sp * 3);
  const textScaleOpen = isMobile ? 1 : 0.92 + sp * 0.08;
  const textScaleLoop = isMobile ? 1 : 0.92 + sp * 0.08;
  const videoOpacity  = isMobile ? 1 : Math.min(1, sp * 2);
  const videoScale    = isMobile ? 1 : 1 + sp * 0.04;

  return (
    <div
      className="vs-root"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ─── HUD tag ─── */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? 16 : 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Share Tech Mono', monospace",
          color: '#C6FF00',
          fontSize: isMobile ? '11px' : '13px',
          letterSpacing: '0.35em',
          opacity: isMobile ? 0.8 : Math.min(0.8, sp * 2),
          whiteSpace: 'nowrap',
          zIndex: 4,
        }}
      >
        // SYSTEM_RECORDING_04.25
      </div>

      {/* ─── OPEN (top) ─── */}
      <div
        style={{
          zIndex: 3,
          lineHeight: 1,
          fontFamily: "'Share Tech Mono', monospace",
          fontWeight: 900,
          fontSize: 'clamp(72px, 18vw, 220px)',
          letterSpacing: '-0.02em',
          color: 'transparent',
          WebkitTextStroke: '2px rgba(198,255,0,0.85)',
          textShadow: '0 0 60px rgba(198,255,0,0.25)',
          opacity: textOpacity,
          transform: `scale(${textScaleOpen})`,
          transition: 'transform 0.4s ease-out',
          userSelect: 'none',
          mixBlendMode: 'screen',
        }}
      >
        OPEN
      </div>

      {/* ─── VIDEO BAND ─── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? 'clamp(140px, 30vw, 260px)' : 'clamp(160px, 22vw, 320px)',
          overflow: 'hidden',
          flexShrink: 0,
          zIndex: 2,
        }}
      >
        {/* subtle dark vignette so text pops */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, #000 0%, transparent 18%, transparent 82%, #000 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: videoOpacity,
            transform: `scale(${videoScale})`,
            transition: 'transform 0.5s ease-out',
            display: 'block',
          }}
        >
          <source src="/loop.mp4" type="video/mp4" />
          <source src="/loop.mp4" type="video/quicktime" />
        </video>

        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: 32,
            height: 32,
            borderTop: '2px solid #C6FF00',
            borderLeft: '2px solid #C6FF00',
            opacity: 0.6,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 32,
            height: 32,
            borderBottom: '2px solid #C6FF00',
            borderRight: '2px solid #C6FF00',
            opacity: 0.6,
            zIndex: 2,
          }}
        />
      </div>

      {/* ─── LOOP (bottom) ─── */}
      <div
        style={{
          zIndex: 3,
          lineHeight: 1,
          fontFamily: "'Share Tech Mono', monospace",
          fontWeight: 900,
          fontSize: 'clamp(72px, 18vw, 220px)',
          letterSpacing: '-0.02em',
          color: '#C6FF00',
          textShadow:
            '0 0 40px rgba(198,255,0,0.5), 0 0 100px rgba(198,255,0,0.2)',
          opacity: textOpacity,
          transform: `scale(${textScaleLoop})`,
          transition: 'transform 0.4s ease-out',
          userSelect: 'none',
        }}
      >
        LOOP
      </div>

      {/* ─── Subtitle ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? 14 : 22,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Share Tech Mono', monospace",
          color: 'rgba(255,255,255,0.55)',
          fontSize: isMobile ? '11px' : '13px',
          letterSpacing: '0.25em',
          whiteSpace: 'nowrap',
          opacity: isMobile ? 1 : Math.max(0, (sp - 0.4) * 2),
          zIndex: 4,
          textAlign: 'center',
        }}
      >
        24 HOURS · NON-STOP BUILDING · INNOVATION UNLEASHED
      </div>

      {/* ─── Scoped styles ─── */}
      <style>{`
        .vs-root {
          /* nothing extra needed — kept for potential future hooks */
        }

        @media (max-width: 600px) {
          /* nudge corner accents inward on very small screens */
        }
      `}</style>
    </div>
  );
};
