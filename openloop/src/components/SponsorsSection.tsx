import React from 'react';
import { Typewriter } from './common/Typewriter';
import { lerp, clamp } from '../utils/math';
import './SponsorsSection.css';

interface Sponsor {
  name: string;
  tier: 'Title' | 'Gold' | 'Silver' | 'Community';
  logoImg?: string; // Add your logo image paths here
}

const SPONSORS: Sponsor[] = [
  { name: "UnStop", tier: "Gold", logoImg: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/03/ec/01/03ec01e9-83c9-b00f-94ca-e9b5a5b31356/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/1200x630wa.jpg" },
  { name: "DK24", tier: "Gold", logoImg: "data:image/png;base64,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" },
  { name: "NIAT", tier: "Gold", logoImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6OKON2o5LyVsAC0NdfP5nLD8jzbE_CULafA&s" },
  { name: "Kalvium", tier: "Gold", logoImg: "https://pbs.twimg.com/profile_images/1773285198794313729/0S43bEQA_400x400.jpg" },
  { name: "XYZ", tier: "Gold", logoImg: "data:image/jpeg;base64,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" },
];

export const SponsorsSection: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  // Unified Range: 0.75 -> 0.90
  const isSponsorsActive = p >= 0.75 && p < 0.90;
  
  // Cinematic Entry (0.75 -> 0.82)
  const entryP = clamp((p - 0.75) / 0.07, 0, 1);
  
  const opacity = entryP;
  const translateY = lerp(40, 0, entryP);

  return (
    <div 
      id="sponsors-section" 
      className="section-overlay"
      style={{
        opacity: isSponsorsActive ? opacity : 0,
        transform: `translateY(${translateY}px)`,
        visibility: isSponsorsActive && opacity > 0.01 ? 'visible' : 'hidden',
        transition: 'none' // Use raw scroll for cinematic feel
      }}
    >
      <div className="sponsors-wrapper-premium">
        <div className="timeline-label">// 005 - PARTNERS</div>
        <h2 className="section-heading">SPONSORS</h2>
        <p className="body-text-safe" style={{ marginBottom: '2rem' }}>
          <Typewriter 
            active={p > 0.78} 
            text="Our partners fueling the 2026 synergy loop. Grid layout optimized for high-fidelity logo rendering." 
          />
        </p>

        <div className="sponsors-grid-new">
          {SPONSORS.map((s, i) => (
            <div key={i} className={`sponsor-box tier-${s.tier.toLowerCase()}`}>
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

        <div className="hud-label" style={{ marginTop: '2rem' }}>
          Interested in partnering? CONTACT@OPENLOOP.IO
        </div>
      </div>
    </div>
  );
};
