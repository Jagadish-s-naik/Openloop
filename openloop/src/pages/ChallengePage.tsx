import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Square, RotateCcw, FastForward } from 'lucide-react';

type TimerState = 'IDLE' | 'COUNTDOWN_321' | 'RUNNING' | 'STOPPED';
const TOTAL_SECONDS = 24 * 60 * 60;
const TIMER_KEY = 'openloop_challenge_timer';
const TIMER_STATE_KEY = 'openloop_challenge_timer_state';

export const ChallengePage: React.FC = () => {
  const [state, setState] = useState<TimerState>(() => {
    const storedState = localStorage.getItem(TIMER_STATE_KEY);
    return storedState === 'RUNNING' || storedState === 'STOPPED' ? storedState : 'IDLE';
  });
  const [countdown321, setCountdown321] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = localStorage.getItem(TIMER_KEY);
    const parsed = stored ? Number(stored) : NaN;
    return Number.isFinite(parsed) ? parsed : TOTAL_SECONDS;
  });
  const [isDimmed, setIsDimmed] = useState(false);
  // For fast-forward animation feedback
  const [fastForwarded, setFastForwarded] = useState(false);
  
  const countdownRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Mouse move for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3-2-1 Countdown Logic
  useEffect(() => {
    if (state === 'COUNTDOWN_321') {
      let count = 3;
      setCountdown321(count);
      
      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown321(count);
          // Animation for number
          if (countdownRef.current) {
            gsap.fromTo(countdownRef.current, 
              { scale: 0.5, opacity: 0 },
              { scale: 1.5, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
          }
        } else {
          clearInterval(interval);
          setCountdown321(null);
          setState('RUNNING');
          setIsDimmed(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state]);

  // Sync latest values from storage on first mount.
  useEffect(() => {
    const stored = localStorage.getItem(TIMER_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (Number.isFinite(parsed)) {
      setTimeLeft(parsed);
    }

    const storedState = localStorage.getItem(TIMER_STATE_KEY);
    if (storedState === 'RUNNING' || storedState === 'STOPPED') {
      setState(storedState);
    }
  }, []);

  // 24h Timer Logic
  useEffect(() => {
    let interval: number;
    if (state === 'RUNNING') {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  // Keep shared storage updated for both Hero and Challenge.
  useEffect(() => {
    localStorage.setItem(TIMER_KEY, String(timeLeft));
    localStorage.setItem(TIMER_STATE_KEY, state === 'COUNTDOWN_321' ? 'IDLE' : state);
  }, [timeLeft, state]);

  useEffect(() => {
    setIsDimmed(state === 'RUNNING');
  }, [state]);

  useEffect(() => {
    if (timeLeft === 0 && state === 'RUNNING') {
      setState('STOPPED');
    }
  }, [timeLeft, state]);

  const handleStart = () => {
    setState('COUNTDOWN_321');
  };

  const handleStop = () => {
    setState('STOPPED');
  };

  const handleReset = () => {
    setState('IDLE');
    setTimeLeft(TOTAL_SECONDS);
  };

  const getTimeParts = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [d, h, m, s].map((v) => v.toString().padStart(2, '0'));
  };

  // Timer color logic
  const getTimerColor = () => {
    if (timeLeft <= 3600) return '#FF3B30'; // Red for last 1hr
    if (timeLeft <= 5 * 3600) return '#FFA500'; // Orange for last 5hr
    return state === 'RUNNING' ? '#C6FF00' : '#ffffff';
  };

  // Fast forward 1 hour
  const handleFastForward = () => {
    if (state === 'RUNNING' && timeLeft > 3600) {
      setTimeLeft((prev) => Math.max(prev - 3600, 0));
      setFastForwarded(true);
      setTimeout(() => setFastForwarded(false), 600);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Background Layer */}
      <div style={{
        ...backgroundStyle,
        opacity: isDimmed ? 0.95 : 0.8,
        backgroundColor: isDimmed ? '#010400' : '#020600'
      }} />

      {/* Spotlight Effect */}
      <div 
        ref={spotlightRef}
        style={{
          ...spotlightStyle,
          opacity: isDimmed ? 0.4 : 0.1,
        }} 
      />

      <div style={contentStyle}>
        {state === 'IDLE' && (
          <div style={centerBlockStyle}>
             <h1 style={titleStyle}>24 HOUR CHALLENGE</h1>
             <button 
                onClick={handleStart}
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px #C6FF00';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(198, 255, 0, 0.4)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
             >
               START
             </button>
          </div>
        )}

        {state === 'COUNTDOWN_321' && (
          <div ref={countdownRef} style={countdownNumberStyle}>
            {countdown321}
          </div>
        )}

        {(state === 'RUNNING' || state === 'STOPPED') && (
          <div style={centerBlockStyle}>
            <div
              style={{
                ...timerTextStyle,
                textShadow: state === 'RUNNING' ? `0 0 30px ${getTimerColor()}` : 'none',
                color: getTimerColor(),
                transition: 'color 0.5s, text-shadow 0.5s',
                animation: fastForwarded ? 'fastForwardFlash 0.6s' : undefined
              }}
            >
              {getTimeParts(timeLeft).join(' : ')}
            </div>
            {/* Fast Forward Button (only show if more than 1hr left and running) */}
            {state === 'RUNNING' && timeLeft > 3600 && (
              <button
                onClick={handleFastForward}
                style={{
                  ...secondaryButtonStyle,
                  marginTop: 32,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#222',
                  border: '1px solid #FFA500',
                  color: '#FFA500',
                  boxShadow: '0 0 10px rgba(255,165,0,0.2)',
                  fontWeight: 'bold',
                  fontSize: 18,
                  cursor: 'pointer',
                  opacity: 0.85,
                  transition: 'all 0.2s',
                }}
                title="Fast forward 1 hour"
              >
                <FastForward size={20} />
                Fast Forward 1hr
              </button>
            )}
          </div>
        )}
      </div>

      {/* Secret Control Icons in Corners */}
      {(state === 'RUNNING' || state === 'STOPPED') && (
        <>
          <div 
            onClick={handleStop}
            style={secretIconStyle('bottom', 'right')}
            title="S"
          >
            <Square size={8} />
          </div>

          {state === 'STOPPED' && (
            <div 
              onClick={handleReset}
              style={secretIconStyle('bottom', 'left')}
              title="R"
            >
              <RotateCcw size={8} />
            </div>
          )}
        </>
      )}


      {/* Decorative HUD elements */}
      <div style={cornerHUDStyle('top', 'left')} />
      <div style={cornerHUDStyle('top', 'right')} />
      <div style={cornerHUDStyle('bottom', 'left')} />
      <div style={cornerHUDStyle('bottom', 'right')} />
      
      <div style={systemLabelStyle}>
        SYSTEM STATUS: {state} // LINK_SECURE
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  backgroundColor: '#020600',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
};

const backgroundStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  transition: 'all 0.8s ease',
};

const spotlightStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1000px',
  height: '1000px',
  background: 'radial-gradient(circle, rgba(198, 255, 0, 0.15) 0%, rgba(198, 255, 0, 0) 70%)',
  borderRadius: '50%',
  pointerEvents: 'none',
  zIndex: 2,
  transform: 'translate(-50%, -50%)',
  left: 0,
  top: 0,
};

const contentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const centerBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: 'fadeIn 0.5s ease-out',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'Audiowide, sans-serif',
  fontSize: 'clamp(40px, 8vw, 80px)',
  letterSpacing: '0.1em',
  marginBottom: '60px',
  textAlign: 'center',
  background: 'linear-gradient(to bottom, #ffffff, #888888)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '20px 60px',
  fontSize: '24px',
  fontFamily: 'Share Tech Mono, monospace',
  backgroundColor: '#C6FF00',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 0 15px rgba(198, 255, 0, 0.4)',
  letterSpacing: '4px',
  fontWeight: 'bold',
};

const countdownNumberStyle: React.CSSProperties = {
  fontSize: '200px',
  fontFamily: 'Audiowide, sans-serif',
  color: '#C6FF00',
  textShadow: '0 0 40px rgba(198, 255, 0, 0.6)',
};

const timerTextStyle: React.CSSProperties = {
  fontSize: 'clamp(60px, 10vw, 140px)',
  fontFamily: 'Share Tech Mono, monospace',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  letterSpacing: '0.05em',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '12px 40px',
  fontSize: '16px',
  fontFamily: 'Share Tech Mono, monospace',
  backgroundColor: 'transparent',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  letterSpacing: '2px',
};

const secretIconStyle = (v: 'top' | 'bottom', h: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  [v]: '10px',
  [h]: '10px',
  cursor: 'pointer',
  opacity: 0.1,
  color: 'rgba(255, 255, 255, 0.4)',
  zIndex: 100,
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.3s ease',
});

const cornerHUDStyle = (v: 'top' | 'bottom', h: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [v]: '40px',
    [h]: '40px',
    width: '30px',
    height: '30px',
    borderTop: v === 'top' ? '2px solid #C6FF00' : 'none',
    borderBottom: v === 'bottom' ? '2px solid #C6FF00' : 'none',
    borderLeft: h === 'left' ? '2px solid #C6FF00' : 'none',
    borderRight: h === 'right' ? '2px solid #C6FF00' : 'none',
    zIndex: 20,
    opacity: 0.5,
});

const systemLabelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'rgba(198, 255, 0, 0.6)',
    letterSpacing: '2px',
    zIndex: 20,
};


// Keyframes for fast forward flash
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes fastForwardFlash {
  0% { filter: brightness(1.5) drop-shadow(0 0 10px #FFA500); }
  100% { filter: none; }
}`;
document.head.appendChild(styleSheet);

export default ChallengePage;
