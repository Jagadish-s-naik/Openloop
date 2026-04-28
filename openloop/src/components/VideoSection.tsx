import React from 'react';

interface VideoSectionProps {
  scrollProgress: number; // Normalised 0..1 within its range
}

export const VideoSection: React.FC<VideoSectionProps> = ({ scrollProgress }) => {
  // Video is served from the public folder
  const videoSrc = "/loop.mp4";
  const fallbackUrl = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-1616-large.mp4";

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.92,
          transition: 'transform 0.5s ease-out',
          transform: `scale(${1 + scrollProgress * 0.08})`
        }}
      >
        <source src={videoSrc} type="video/quicktime" />
        <source src={videoSrc} type="video/mp4" />
        <source src={fallbackUrl} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent, transparent, transparent)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: '#C6FF00',
          fontSize: '14px',
          letterSpacing: '0.4em',
          marginBottom: '20px',
          opacity: Math.min(1, scrollProgress * 2),
          transform: `translateY(${20 - scrollProgress * 20}px)`
        }}>
          // SYSTEM_RECORDING_04.25
        </div>
        
        <h2 style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 'clamp(32px, 5vw, 72px)',
          color: '#fff',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '0.05em',
          opacity: Math.min(1, scrollProgress * 3),
          transform: `scale(${0.95 + scrollProgress * 0.05})`
        }}>
          THE <span style={{ color: '#C6FF00' }}>OPENLOOP</span> EXPERIENCE
        </h2>

        <div style={{
          marginTop: '30px',
          maxWidth: '600px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '18px',
          lineHeight: '1.6',
          opacity: Math.max(0, (scrollProgress - 0.3) * 2),
          transform: `translateY(${10 - (scrollProgress - 0.3) * 10}px)`
        }}>
          Witness the intensity, the innovation, and the absolute brilliance 
          of 24 hours of non-stop building.
        </div>
      </div>

      {/* Decorative corners */}
      <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '2px solid #C6FF00', borderLeft: '2px solid #C6FF00', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '2px solid #C6FF00', borderRight: '2px solid #C6FF00', opacity: 0.5 }} />
    </div>
  );
};
