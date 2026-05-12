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

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => {
      /* autoplay blocked — silently ignore */
    });
  }, []);

  const sp = Math.max(0, Math.min(1, scrollProgress));

  /* ── Animation values (desktop only) ── */
  const textOpacity = isMobile ? 1 : Math.min(1, sp * 3);
  const textScale = isMobile ? 1 : 0.9 + sp * 0.1;
  const videoOpacity = isMobile ? 0.6 : Math.min(0.6, sp * 2);

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
      {/* ─── Background Video ─── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: videoOpacity,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <source src="/loop.mp4" type="video/mp4" />
        <source src="/loop.mp4" type="video/quicktime" />
      </video>

      {/* ─── HUD tag ─── */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? 16 : 30,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Share Tech Mono', monospace",
          color: '#C6FF00',
          fontSize: isMobile ? '10px' : '12px',
          letterSpacing: '0.4em',
          opacity: 0.6,
          zIndex: 4,
          whiteSpace: 'nowrap'
        }}
      >
        // ESTABLISHING_LINK_04.25
      </div>

      {/* ─── HUGE HOLLOW TEXT ─── */}
      <div
        style={{
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      >
        <h2
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 900,
            fontSize: 'clamp(120px, 35vw, 600px)',
            lineHeight: 0.75,
            margin: 0,
            color: 'transparent',
            WebkitTextStroke: isMobile ? '1.5px rgba(255,255,255,0.9)' : '3px rgba(255,255,255,0.95)',
            letterSpacing: '-0.05em',
            textAlign: 'center',
            textTransform: 'uppercase',
            filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.15))',
          }}
        >
          OPEN
        </h2>
        <h2
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 900,
            fontSize: 'clamp(120px, 35vw, 600px)',
            lineHeight: 0.75,
            margin: 0,
            color: 'transparent',
            WebkitTextStroke: isMobile ? '1.5px rgba(255,255,255,0.9)' : '3px rgba(255,255,255,0.95)',
            letterSpacing: '-0.05em',
            textAlign: 'center',
            textTransform: 'uppercase',
            filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.15))',
          }}
        >
          LOOP
        </h2>
      </div>

      {/* ─── Bottom Info ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? 16 : 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
          fontFamily: "'Share Tech Mono', monospace",
          color: 'rgba(255,255,255,0.4)',
          fontSize: isMobile ? '10px' : '12px',
          letterSpacing: '0.2em',
          zIndex: 4,
          padding: '0 20px'
        }}
      >
        <span style={{ color: '#C6FF00', marginRight: '10px' }}>[ RECORDING ]</span>
        24 HOURS OF CONTINUOUS INNOVATION
      </div>

      {/* Decorative corners for the whole screen */}
      <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '1px solid rgba(198,255,0,0.3)', borderLeft: '1px solid rgba(198,255,0,0.3)', zIndex: 4 }} />
      <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '1px solid rgba(198,255,0,0.3)', borderRight: '1px solid rgba(198,255,0,0.3)', zIndex: 4 }} />
      <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '1px solid rgba(198,255,0,0.3)', borderLeft: '1px solid rgba(198,255,0,0.3)', zIndex: 4 }} />
      <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '1px solid rgba(198,255,0,0.3)', borderRight: '1px solid rgba(198,255,0,0.3)', zIndex: 4 }} />
    </div>
  );
};
