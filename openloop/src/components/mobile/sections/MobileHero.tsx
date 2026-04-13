import React from 'react';

export const MobileHero: React.FC = () => {
  return (
    <section id="hero" style={{ justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
      <div className="hero-cyber-grid-wrap">
        <div className="cyber-grid-plane" />
        <div className="cyber-grid-glow" />
        <div className="crosshair-ui">
          <div className="xh-line xh-top" />
          <div className="xh-line xh-bottom" />
          <div className="xh-line xh-left" />
          <div className="xh-line xh-right" />
          <div className="xh-center-glitch" />
        </div>
      </div>

      <div style={{ 
        zIndex: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px', 
        textAlign: 'center', 
        width: '100%',
        marginTop: '-40px' 
      }}>
        
        {/* Institution Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '4px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            padding: '7px 16px',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            <img
              src="/yset-logo.png"
              alt="Yenepoya School of Engineering & Technology"
              style={{
                height: '36px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1) drop-shadow(0 0 4px rgba(255,255,255,0.25))',
                display: 'block',
              }}
            />
          </div>
        </div>

        <div className="hero-badge" style={{ opacity: 1, transform: 'none', margin: '0 auto' }}>
          // HACKATHON 2026
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="hero-title" style={{ opacity: 1, transform: 'none', display: 'block' }}>
            <span style={{ backgroundImage: "linear-gradient(to bottom, #d9ed91, #8cef56)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OPEN LOOP</span>
          </span>
          <span className="hero-year" style={{ opacity: 1, transform: 'none', display: 'block', marginTop: '-8px' }}>
            2026
          </span>
        </div>

        <div style={{ 
          background: 'rgba(198, 255, 0, 0.05)', 
          border: '1px solid rgba(198, 255, 0, 0.3)', 
          padding: '12px 24px', 
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(198, 255, 0, 0.1)'
        }}>
          <p className="hero-tagline" style={{ opacity: 1, transform: 'none', margin: 0, color: '#C6FF00', fontSize: '12px', letterSpacing: '0.3em' }}>
            // BUILD. BREAK. TRANSCEND.
          </p>
        </div>

        <p className="hero-sub" style={{ opacity: 1, transform: 'none', maxWidth: '300px', margin: '0 auto', fontSize: '15px' }}>
          24 hours. One chance.<br/>Redefine what's possible.
        </p>

        <div className="hero-stats" style={{ opacity: 1, transform: 'none', justifyContent: 'center', flexWrap: 'wrap', gap: '32px', margin: '8px 0' }}>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num">20+</span><span className="lbl">TEAMS</span>
          </div>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num">24H</span><span className="lbl">DURATION</span>
          </div>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num">₹1.5L</span><span className="lbl">PRIZES</span>
          </div>
        </div>
      </div>
      <div style={{ 
        position: 'absolute', 
        bottom: '4vh', 
        left: '0', 
        right: '0', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '24px',
        zIndex: 5
      }}>
        <div className="hero-buttons" style={{ 
          width: '85%', 
          maxWidth: '350px', 
          opacity: 1, 
          transform: 'none', 
          display: 'flex', 
          gap: '16px' 
        }}>
          <a href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231" target="_blank" rel="noopener noreferrer" className="btn-hero primary" style={{ flex: 1, padding: '14px 0', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Register Now</a>
          <a href="https://drive.google.com/file/d/1_IM0WD6zowoyv9nopm2RbnwW2dUYwwBE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-hero outline" style={{ flex: 1, padding: '14px 0', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Brochure</a>
        </div>
      </div>
    </section>
  );
};
