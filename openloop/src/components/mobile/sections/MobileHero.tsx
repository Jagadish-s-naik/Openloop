import React from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from '../../../utils/timerClient';

export const MobileHero: React.FC = () => {
  const { remaining: eventTimeLeft, isChallenge } = useTimer();

  const formatEventTime = (seconds: number): string => {
    const clamped = Math.max(0, seconds);
    const days = Math.floor(clamped / 86400);
    const hours = Math.floor((clamped % 86400) / 3600);
    const minutes = Math.floor((clamped % 3600) / 60);
    const secs = clamped % 60;
    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '10px',
        paddingTop: '72px',
        paddingBottom: '22px',
      }}
    >
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
        gap: 'clamp(8px, 2.4vw, 14px)', 
        textAlign: 'center', 
        width: '100%',
        paddingLeft: 'clamp(16px, 4vw, 24px)',
        paddingRight: 'clamp(16px, 4vw, 24px)',
        marginTop: '0' 
      }}>
        
        
        {/* Institution Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection:"column",
          width: '100%',
          marginBottom: 'clamp(0px, 0.5vw, 6px)',
        }}>
          <div style={{
            borderRadius: '10px',
            padding: 'clamp(4px, 1.5vw, 8px) clamp(10px, 2vw, 16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            <img
              src="/yset.svg"
              alt="Yenepoya School of Engineering & Technology"
              style={{
                height: 'clamp(30px, 8.5vw, 44px)',
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
          <span className="hero-title" style={{ opacity: 1, transform: 'none', display: 'block', fontSize: 'clamp(31px, 11vw, 64px)', lineHeight: '1' }}>
            <span style={{ backgroundImage: "linear-gradient(to bottom, #d9ed91, #8cef56)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: 'nowrap' }}>OPEN LOOP</span>
          </span>
          <span className="hero-year" style={{ opacity: 1, transform: 'none', display: 'block', marginTop: 'clamp(-4px, -0.6vw, -2px)', fontSize: 'clamp(18px, 5.8vw, 34px)', letterSpacing: '0.24em' }}>
            2026
          </span>
        </div>

        <div style={{ 
          background: 'rgba(198, 255, 0, 0.05)', 
          border: '1px solid rgba(198, 255, 0, 0.3)', 
          padding: 'clamp(8px, 1.7vw, 12px) clamp(14px, 3.4vw, 22px)', 
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(198, 255, 0, 0.1)',
          maxWidth: '90%'
        }}>
          <p className="hero-tagline" style={{ opacity: 1, transform: 'none', margin: 0, color: '#C6FF00', fontSize: 'clamp(10px, 2.2vw, 13px)', letterSpacing: '0.25em' }}>
            // BUILD. BREAK. TRANSCEND.
          </p>
        </div>

        <p className="hero-sub" style={{ opacity: 1, transform: 'none', maxWidth: '95%', margin: '0 auto', fontSize: 'clamp(12px, 2.6vw, 15px)', lineHeight: '1.5', paddingLeft: '8px', paddingRight: '8px' }}>
          24 hours. One chance.<br/>Redefine what's possible.
        </p>

        <div className="hero-stats" style={{ opacity: 1, transform: 'none', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(14px, 4.8vw, 24px)', margin: 'clamp(2px, 1vw, 8px) 0', width: '100%' }}>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 'clamp(20px, 4.8vw, 25px)' }}>20+</span><span className="lbl" style={{ fontSize: 'clamp(7px, 1.7vw, 9px)' }}>TEAMS</span>
          </div>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 'clamp(20px, 4.8vw, 25px)' }}>24H</span><span className="lbl" style={{ fontSize: 'clamp(7px, 1.7vw, 9px)' }}>DURATION</span>
          </div>
          <div className="stat" style={{ alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 'clamp(20px, 4.8vw, 25px)' }}>₹1.5L</span><span className="lbl" style={{ fontSize: 'clamp(7px, 1.7vw, 9px)' }}>PRIZES</span>
          </div>
        </div>

        <div className="mobile-hero-timer-wrap">
          <p className="mobile-hero-timer-label">
            {isChallenge ? 'CHALLENGE TIMER LIVE' : 'TIME SHOWN FOR 25TH APRIL'}
          </p>
          <p className="mobile-hero-timer-value">{formatEventTime(eventTimeLeft)}</p>
        </div>

        <Link 
          to="/top-25" 
          className="top-25-mobile-button"
        >
          <span className="btn-shine"></span>
          <span className="btn-text">SHORTLISTED 25 TEAMS</span>
          <style>{`
            .top-25-mobile-button {
              position: relative;
              background: #C6FF00;
              color: #000;
              font-family: 'Share Tech Mono', monospace;
              font-weight: 950;
              font-size: 13px;
              padding: 12px 24px;
              margin-top: 4px;
              border-radius: 6px;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              text-decoration: none;
              box-shadow: 0 0 25px rgba(198, 255, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              animation: button-pulse 2s infinite ease-in-out;
            }

            .btn-shine {
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
              );
              animation: btn-shine-anim 3s infinite linear;
            }

            @keyframes btn-shine-anim {
              0% { left: -100%; }
              20% { left: 100%; }
              100% { left: 100%; }
            }

            @keyframes button-pulse {
              0% { transform: scale(1); box-shadow: 0 0 20px rgba(198, 255, 0, 0.5); }
              50% { transform: scale(1.03); box-shadow: 0 0 40px rgba(198, 255, 0, 0.8); }
              100% { transform: scale(1); box-shadow: 0 0 20px rgba(198, 255, 0, 0.5); }
            }
          `}</style>
        </Link>

        <div className="hero-buttons" style={{ 
          width: '100%',
          maxWidth: '420px',
          opacity: 1, 
          transform: 'none', 
          display: 'flex', 
          gap: 'clamp(12px, 3vw, 16px)',
          marginTop: '4px'
        }}>
          <a href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231" target="_blank" rel="noopener noreferrer" className="btn-hero primary" style={{ flex: 1, padding: 'clamp(12px, 3vw, 16px) 0', fontSize: 'clamp(13px, 2.5vw, 15px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Register Closed</a>
          <a href="https://drive.google.com/file/d/1_IM0WD6zowoyv9nopm2RbnwW2dUYwwBE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-hero outline" style={{ flex: 1, padding: 'clamp(12px, 3vw, 16px) 0', fontSize: 'clamp(13px, 2.5vw, 15px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Brochure</a>
        </div>
      </div>
    </section>
  );
};
