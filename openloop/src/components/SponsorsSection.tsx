import React from 'react';
import { Typewriter } from './common/Typewriter';
import { lerp, clamp } from '../utils/math';
import './SponsorsSection.css';

interface Sponsor {
  name: string;
  tier: 'Title' | 'Gold' | 'Silver' | 'Community';
  logoImg?: string; // Path to image in /public/sponsors folder
}

// Update these image paths when you add sponsor logos to /public/sponsors/
const SPONSORS: Sponsor[] = [
  { name: "UnStop", tier: "Gold", logoImg: "/sponsors/image.png" },
  { name: "DK24", tier: "Gold", logoImg: "/sponsors/dk_24.png" },
  { name: "NXT WAVE", tier: "Gold", logoImg: "/sponsors/nxt_wave.png" },
  { name: "Kalvium", tier: "Gold", logoImg: "/sponsors/kalvium.webp" },
  { name: "XYZ", tier: "Gold", logoImg: "/sponsors/xyz.webp" }, 
];
 

export const SponsorsSection: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  
  // Cinematic Entry Transform (Independent of opacity management)
  // Maps 0.76 -> 0.78 for the slide-up effect
  const entryP = clamp((p - 0.76) / 0.02, 0, 1);
  const translateY = lerp(40, 0, entryP);

  return (
    <div 
      id="sponsors-section" 
      className="section-overlay"
      style={{
        opacity: 0, // Default hidden
        transform: `translateY(${translateY}px)`,
        pointerEvents: p > 0.76 && p < 0.88 ? 'auto' : 'none',
        transition: 'none'
      }}
    >
      <div className="sponsors-wrapper-premium">
        <div className="timeline-label">// 005 - PARTNERS</div>
        <h2 className="section-heading">SPONSORS</h2>
        <p className="body-text-safe" style={{ marginBottom: '2rem' }}>
          <Typewriter 
            active={p > 0.77} 
            delay={10}
            text="Our partners fueling the 2026 Open Loop." 
          />
        </p>

        <div className="sponsors-grid-new">
          {SPONSORS.map((s, i) => (
            <div 
              key={i} 
              className={`sponsor-box tier-${s.tier.toLowerCase()}`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.06)`;
                e.currentTarget.style.zIndex = '5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `translate(0px, 0px) scale(1)`;
                e.currentTarget.style.zIndex = '1';
              }}
            >
              {s.logoImg ? (
                <img src={s.logoImg} alt={s.name} className="sponsor-logo-img" />
              ) : (
                <div className="sponsor-placeholder">
                  <span className="hud-label">{s.name}</span>
                </div>
              )}
              {/* Name tag revealed on hover */}
              <span className="sponsor-name-tag">{s.name}</span>
              <div className="box-decoration" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
