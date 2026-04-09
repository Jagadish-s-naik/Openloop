import React from 'react';
import { normalize, mapRange } from '../utils/math';

interface TimelineSectionProps {
  scrollVal: number;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ scrollVal }) => {
  // Sync with scroll (0.6 -> 0.8)
  const progress = normalize(scrollVal, 0.6, 0.8);
  const isVisible = progress > 0 && progress <= 1;

  // Animate opacity + translateY
  const opacity = mapRange(progress, 0, 0.2, 0, 1) * mapRange(progress, 0.8, 1, 1, 0); // Fade in and out
  const translateY = mapRange(progress, 0, 1, 100, -100); // Move up

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, calc(-50% + ${translateY}px))`,
        opacity,
        pointerEvents: 'none',
        color: '#fff',
        textAlign: 'center',
        width: '80%',
        maxWidth: '600px',
        transition: 'opacity 0.1s linear, transform 0.1s linear' // Keep smooth logic manually calculated
      }}
    >
      <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>EVOLUTION OF OPENLOOP</h2>
      <p style={{ fontSize: '1.2rem', color: '#00ccff', lineHeight: 1.6 }}>
        In the year 2026, the boundaries between the digital and physical realms dissolve. The core awakens.
      </p>
    </div>
  );
};
