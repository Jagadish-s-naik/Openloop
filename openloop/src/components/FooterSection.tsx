import React from 'react';
import { normalize, mapRange } from '../utils/math';

interface FooterSectionProps {
  scrollVal: number;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ scrollVal }) => {
  // Scroll: 0.95 -> 1.0
  const progress = normalize(scrollVal, 0.95, 1);
  const isVisible = scrollVal >= 0.94; // Render early slightly for smoothing

  if (!isVisible) return null;

  // Fade in footer (opacity 0 -> 1) 
  // Slight upward motion
  const opacity = mapRange(progress, 0, 1, 0, 1);
  const translateY = mapRange(progress, 0, 1, 100, 0); // Up to 0 form 100

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        color: '#fff',
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: 'auto', // allow click if any links
        zIndex: 10
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1rem', color: '#00ccff' }}>
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 1rem 0' }}>OPENLOOP</h3>
        <p style={{ margin: 0, opacity: 0.8 }}>© 2026 OpenLoop Industries. All rights reserved.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>SYSTEMS</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>ARCHIVE</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>CONTACT</span>
        </div>
      </div>
    </footer>
  );
};
