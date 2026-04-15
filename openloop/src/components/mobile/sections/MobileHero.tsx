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
        gap: 'clamp(16px, 4vw, 24px)', 
        textAlign: 'center', 
        width: '100%',
        paddingLeft: 'clamp(16px, 4vw, 24px)',
        paddingRight: 'clamp(16px, 4vw, 24px)',
        marginTop: 'clamp(-30px, -5vh, -40px)' 
      }}>
        
        {/* Institution Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection:"column",
          width: '100%',
          marginBottom: 'clamp(4px, 1vw, 12px)',
        }}>
          <div style={{
            borderRadius: '10px',
            padding: 'clamp(4px, 1.5vw, 8px) clamp(10px, 2vw, 16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img
              src="/yset.svg"
              alt="Yenepoya School of Engineering & Technology"
              style={{
                height: 'clamp(35px, 10vw, 54px)',
                width: 'auto',
                maxWidth: '90%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            
            <p className="hero-subtitle" style={{ fontSize: 'clamp(8px, 2.2vw, 12px)', color: 'white', opacity: 0.6, marginTop: 'clamp(2px, 0.8vw, 6px)', margin: 0, paddingTop: 'clamp(4px, 1vw, 8px)' }}>Affiliated to Yenepoya Deemed to be University</p>  
            
          </div>
        </div>

        <div className="hero-badge" style={{ opacity: 1, transform: 'none', margin: '0 auto', fontSize: 'clamp(11px, 2.5vw, 15px)', padding: 'clamp(6px, 1.2vw, 12px) clamp(12px, 2vw, 16px)' }}>
          // HACKATHON 2026
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <span className="hero-title" style={{ opacity: 1, transform: 'none', display: 'block', fontSize: 'clamp(36px, 13vw, 84px)', lineHeight: 'clamp(0.9, 1vw, 1.2)' }}>
            <span style={{ backgroundImage: "linear-gradient(to bottom, #d9ed91, #8cef56)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: 'nowrap' }}>OPEN LOOP</span>
          </span>
          <span className="hero-year" style={{ opacity: 1, transform: 'none', display: 'block', marginTop: 'clamp(-6px, -1vw, -4px)', fontSize: 'clamp(20px, 7vw, 42px)', letterSpacing: '0.3em' }}>
            2026
          </span>
        </div>

        <div style={{ 
          background: 'rgba(198, 255, 0, 0.05)', 
          border: '1px solid rgba(198, 255, 0, 0.3)', 
          padding: 'clamp(10px, 2vw, 14px) clamp(16px, 4vw, 28px)', 
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(198, 255, 0, 0.1)',
          maxWidth: '90%'
        }}>
          <p className="hero-tagline" style={{ opacity: 1, transform: 'none', margin: 0, color: '#C6FF00', fontSize: 'clamp(10px, 2.2vw, 13px)', letterSpacing: '0.25em' }}>
            // BUILD. BREAK. TRANSCEND.
          </p>
        </div>

        <p className="hero-sub" style={{ opacity: 1, transform: 'none', maxWidth: '95%', margin: '0 auto', fontSize: 'clamp(13px, 3vw, 16px)', lineHeight: '1.6', paddingLeft: '8px', paddingRight: '8px' }}>
          24 hours. One chance.<br/>Redefine what's possible.
        </p>

        <div className="hero-stats" style={{ opacity: 1, transform: 'none', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(20px, 6vw, 32px)', margin: 'clamp(6px, 2vw, 12px) 0', width: '100%' }}>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>20+</span><span className="lbl" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>TEAMS</span>
          </div>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>24H</span><span className="lbl" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>DURATION</span>
          </div>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>₹1.5L</span><span className="lbl" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>PRIZES</span>
          </div>
        </div>
      </div>
      <div style={{ 
        position: 'absolute', 
        bottom: 'clamp(20px, 4vh, 60px)',
        left: '0', 
        right: '0', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '24px',
        zIndex: 5,
        paddingLeft: 'clamp(16px, 4vw, 24px)',
        paddingRight: 'clamp(16px, 4vw, 24px)'
      }}>
        <div className="hero-buttons" style={{ 
          width: '100%',
          maxWidth: '400px',
          opacity: 1, 
          transform: 'none', 
          display: 'flex', 
          gap: 'clamp(12px, 3vw, 16px)' 
        }}>
          <a href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231" target="_blank" rel="noopener noreferrer" className="btn-hero primary" style={{ flex: 1, padding: 'clamp(12px, 3vw, 16px) 0', fontSize: 'clamp(13px, 2.5vw, 15px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Register Now</a>
          <a href="https://drive.google.com/file/d/1_IM0WD6zowoyv9nopm2RbnwW2dUYwwBE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-hero outline" style={{ flex: 1, padding: 'clamp(12px, 3vw, 16px) 0', fontSize: 'clamp(13px, 2.5vw, 15px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Brochure</a>
        </div>
      </div>
    </section>
  );
};
