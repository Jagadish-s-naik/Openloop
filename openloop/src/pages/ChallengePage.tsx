import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Square, RotateCcw, FastForward } from 'lucide-react';
import {
  useTimer,
  startChallengeTimer,
  stopChallengeTimer,
  resumeChallengeTimer,
  resetChallengeTimer,
  fastForwardChallengeTimer,
  CHALLENGE_DURATION_MS,
} from '../utils/timerClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type UIState = 'IDLE' | 'COUNTDOWN_321' | 'RUNNING' | 'PAUSED';

// ─── Component ────────────────────────────────────────────────────────────────

export const ChallengePage: React.FC = () => {
  const { remaining, mode, isChallenge, isPaused } = useTimer();

  // Local UI-only state for the 3-2-1 splash before the server is notified
  const [uiPhase, setUiPhase] = useState<UIState>('IDLE');
  const [countdown321, setCountdown321] = useState<number | null>(null);
  const [fastForwarded, setFastForwarded] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  const countdownRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Derived: what to actually show
  // While 3-2-1 is playing we stay on COUNTDOWN_321.
  // Once the server confirms CHALLENGE mode, we move to RUNNING.
  // If paused on server → PAUSED; otherwise IDLE.
  const displayState: UIState = (() => {
    if (uiPhase === 'COUNTDOWN_321') return 'COUNTDOWN_321';
    if (isChallenge) return 'RUNNING';
    if (isPaused)    return 'PAUSED';
    return 'IDLE';
  })();

  // When the server transitions to CHALLENGE (after our start call), clear the local
  // countdown phase so the timer display takes over.
  useEffect(() => {
    if (uiPhase === 'COUNTDOWN_321' && isChallenge) {
      setUiPhase('IDLE');
      setCountdown321(null);
    }
  }, [isChallenge, uiPhase]);

  // ── Viewport ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const update = () =>
      setIsCompactViewport(window.innerWidth <= 560 || window.innerHeight <= 740);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Spotlight ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: e.clientX, y: e.clientY,
          duration: 0.5, ease: 'power2.out',
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── 3-2-1 Countdown ───────────────────────────────────────────────────────

  useEffect(() => {
    if (uiPhase !== 'COUNTDOWN_321') return;

    let count = 3;
    setCountdown321(count);

    const id = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown321(count);
        if (countdownRef.current) {
          gsap.fromTo(countdownRef.current,
            { scale: 0.5, opacity: 0 },
            { scale: 1.5, opacity: 1, duration: 0.8, ease: 'power2.out' },
          );
        }
      } else {
        clearInterval(id);
        setCountdown321(null);
        // Fire the server call – the useEffect above will clear uiPhase once
        // the server responds and isChallenge becomes true.
        void startChallengeTimer();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [uiPhase]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = () => setUiPhase('COUNTDOWN_321');

  const handleStop  = () => { void stopChallengeTimer(); };
  const handleResume = () => { void resumeChallengeTimer(); };
  const handleReset = () => { void resetChallengeTimer(); };

  const handleFastForward = () => {
    if (isChallenge && remaining > 3600) {
      void fastForwardChallengeTimer().then(() => {
        setFastForwarded(true);
        setTimeout(() => setFastForwarded(false), 600);
      });
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getTimeParts = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [d, h, m, s].map(v => String(v).padStart(2, '0'));
  };

  const getTimerColor = () => {
    if (remaining <= 3600)     return '#FF3B30';
    if (remaining <= 5 * 3600) return '#FFA500';
    return isChallenge ? '#C6FF00' : '#ffffff';
  };

  const isDimmed = displayState === 'RUNNING';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle(isCompactViewport)}>
      {/* Background */}
      <div style={{
        ...backgroundStyle,
        opacity: isDimmed ? 0.95 : 0.8,
        backgroundColor: isDimmed ? '#010400' : '#020600',
      }} />

      {/* Spotlight */}
      <div
        ref={spotlightRef}
        style={{
          ...spotlightStyle,
          display: isCompactViewport ? 'none' : 'block',
          opacity: isDimmed ? 0.4 : 0.1,
        }}
      />

      <div style={contentStyle(isCompactViewport)}>

        {/* ── IDLE ── */}
        {displayState === 'IDLE' && (
          <div style={centerBlockStyle}>
            <h1 style={{
              ...titleStyle,
              fontSize: isCompactViewport ? 'clamp(24px, 7vw, 34px)' : titleStyle.fontSize,
              letterSpacing: isCompactViewport ? '0.05em' : titleStyle.letterSpacing,
              marginBottom: isCompactViewport ? 'clamp(16px, 5vw, 24px)' : titleStyle.marginBottom,
            }}>
              24 HOUR CHALLENGE
            </h1>
            <button
              onClick={handleStart}
              style={primaryButtonStyle}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 30px #C6FF00';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(198, 255, 0, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              START
            </button>
          </div>
        )}

        {/* ── 3-2-1 ── */}
        {displayState === 'COUNTDOWN_321' && (
          <div ref={countdownRef} style={countdownNumberStyle}>
            {countdown321}
          </div>
        )}

        {/* ── RUNNING ── */}
        {displayState === 'RUNNING' && (
          <div style={centerBlockStyle}>
            {isCompactViewport ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(12px, 3vw, 20px)',
                textAlign: 'center',
                animation: fastForwarded ? 'fastForwardFlash 0.6s' : undefined,
              }}>
                {getTimeParts(remaining).map((part, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(4px, 1.5vw, 8px)' }}>
                    <span style={{ fontSize: 'clamp(10px, 2.5vw, 14px)', color: getTimerColor(), opacity: 0.7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {['Days', 'Hours', 'Minutes', 'Seconds'][idx]}
                    </span>
                    <span style={{
                      fontSize: 'clamp(32px, 10vw, 56px)',
                      fontFamily: 'Share Tech Mono, monospace',
                      fontWeight: 'bold',
                      textShadow: `0 0 30px ${getTimerColor()}`,
                      color: getTimerColor(),
                      transition: 'color 0.5s, text-shadow 0.5s',
                      lineHeight: 1,
                    }}>
                      {part}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                ...timerTextStyle,
                textShadow: `0 0 30px ${getTimerColor()}`,
                color: getTimerColor(),
                transition: 'color 0.5s, text-shadow 0.5s',
                animation: fastForwarded ? 'fastForwardFlash 0.6s' : undefined,
                maxWidth: '95vw',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {getTimeParts(remaining).join(' : ')}
              </div>
            )}

            {remaining > 3600 && (
              <button
                onClick={handleFastForward}
                style={{
                  ...secondaryButtonStyle,
                  marginTop: 'clamp(18px, 4vw, 32px)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  backgroundColor: '#222',
                  border: '1px solid #FFA500',
                  color: '#FFA500',
                  boxShadow: '0 0 10px rgba(255,165,0,0.2)',
                  fontWeight: 'bold',
                  fontSize: 'clamp(12px, 3vw, 18px)',
                  cursor: 'pointer',
                  opacity: 0.85,
                  transition: 'all 0.2s',
                }}
                title="Fast forward 1 hour"
              >
                <FastForward size={18} />
                Fast Forward 1hr
              </button>
            )}
          </div>
        )}

        {/* ── PAUSED ── */}
        {displayState === 'PAUSED' && (
          <div style={centerBlockStyle}>
            <div style={{ ...timerTextStyle, color: '#888', maxWidth: '95vw' }}>
              {getTimeParts(remaining).join(' : ')}
            </div>
            <p style={{ fontFamily: 'Share Tech Mono, monospace', color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>
              PAUSED
            </p>
            <button onClick={handleResume} style={{ ...primaryButtonStyle, marginTop: 24 }}>
              RESUME
            </button>
          </div>
        )}

      </div>

      {/* ── Secret controls ── */}
      {(displayState === 'RUNNING' || displayState === 'PAUSED') && (
        <>
          <div onClick={handleStop} style={secretIconStyle('bottom', 'right')} title="Stop">
            <Square size={8} />
          </div>
          {displayState === 'PAUSED' && (
            <div onClick={handleReset} style={secretIconStyle('bottom', 'left')} title="Reset">
              <RotateCcw size={8} />
            </div>
          )}
        </>
      )}

      {/* ── HUD corners ── */}
      {!isCompactViewport && (
        <>
          <div style={cornerHUDStyle('top', 'left')} />
          <div style={cornerHUDStyle('top', 'right')} />
          <div style={cornerHUDStyle('bottom', 'left')} />
          <div style={cornerHUDStyle('bottom', 'right')} />
          <div style={systemLabelStyle}>
            SYSTEM STATUS: {displayState} // LINK_SECURE
          </div>
        </>
      )}
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle = (compact: boolean): React.CSSProperties => ({
  width: '100%',
  minHeight: '100svh',
  backgroundColor: '#020600',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowX: 'hidden',
  overflowY: compact ? 'auto' : 'hidden',
  position: 'relative',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  paddingTop: 'max(0px, env(safe-area-inset-top))',
  paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
});

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

const contentStyle = (compact: boolean): React.CSSProperties => ({
  position: 'relative',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'min(96vw, 1200px)',
  minHeight: compact ? '100svh' : undefined,
  padding: compact
    ? 'clamp(18px, 5vw, 28px) clamp(12px, 4vw, 18px) clamp(16px, 5vw, 26px)'
    : 'clamp(16px, 4vw, 40px)',
});

const centerBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: 'fadeIn 0.5s ease-out',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'Audiowide, sans-serif',
  fontSize: 'clamp(30px, 8vw, 80px)',
  letterSpacing: '0.1em',
  marginBottom: 'clamp(24px, 6vw, 60px)',
  textAlign: 'center',
  background: 'linear-gradient(to bottom, #ffffff, #888888)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: 'clamp(12px, 2.7vw, 20px) clamp(24px, 6vw, 60px)',
  fontSize: 'clamp(16px, 4.2vw, 24px)',
  fontFamily: 'Share Tech Mono, monospace',
  backgroundColor: '#C6FF00',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 0 15px rgba(198, 255, 0, 0.4)',
  letterSpacing: 'clamp(2px, 0.8vw, 4px)',
  fontWeight: 'bold',
  textTransform: 'uppercase',
};

const countdownNumberStyle: React.CSSProperties = {
  fontSize: 'clamp(86px, 26vw, 200px)',
  fontFamily: 'Audiowide, sans-serif',
  color: '#C6FF00',
  textShadow: '0 0 40px rgba(198, 255, 0, 0.6)',
  lineHeight: 1,
  textAlign: 'center',
};

const timerTextStyle: React.CSSProperties = {
  fontSize: 'clamp(34px, 9.5vw, 140px)',
  fontFamily: 'Share Tech Mono, monospace',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  letterSpacing: 'clamp(0.02em, 0.4vw, 0.05em)',
  lineHeight: 1.06,
  textAlign: 'center',
  wordBreak: 'break-word',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: 'clamp(10px, 2.4vw, 12px) clamp(18px, 4.6vw, 40px)',
  fontSize: 'clamp(12px, 3vw, 16px)',
  fontFamily: 'Share Tech Mono, monospace',
  backgroundColor: 'transparent',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  letterSpacing: 'clamp(1px, 0.4vw, 2px)',
  textTransform: 'uppercase',
};

const secretIconStyle = (v: 'top' | 'bottom', h: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  [v]: 'clamp(8px, 2vw, 12px)',
  [h]: 'clamp(8px, 2vw, 12px)',
  cursor: 'pointer',
  opacity: 0.1,
  color: 'rgba(255, 255, 255, 0.4)',
  zIndex: 100,
  padding: 'clamp(8px, 2vw, 10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.3s ease',
});

const cornerHUDStyle = (v: 'top' | 'bottom', h: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  [v]: 'clamp(16px, 3.6vw, 40px)',
  [h]: 'clamp(16px, 3.6vw, 40px)',
  width: 'clamp(20px, 3vw, 30px)',
  height: 'clamp(20px, 3vw, 30px)',
  borderTop: v === 'top' ? '2px solid #C6FF00' : 'none',
  borderBottom: v === 'bottom' ? '2px solid #C6FF00' : 'none',
  borderLeft: h === 'left' ? '2px solid #C6FF00' : 'none',
  borderRight: h === 'right' ? '2px solid #C6FF00' : 'none',
  zIndex: 20,
  opacity: 0.5,
});

const systemLabelStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 'clamp(14px, 4vw, 40px)',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: 'Share Tech Mono, monospace',
  fontSize: 'clamp(9px, 2.2vw, 12px)',
  color: 'rgba(198, 255, 0, 0.6)',
  letterSpacing: 'clamp(0.8px, 0.4vw, 2px)',
  zIndex: 20,
  textAlign: 'center',
  width: 'min(92vw, 560px)',
};

// Keyframe injection (once)
if (typeof document !== 'undefined' && !document.getElementById('challenge-kf')) {
  const s = document.createElement('style');
  s.id = 'challenge-kf';
  s.innerHTML = `
    @keyframes fastForwardFlash {
      0%   { filter: brightness(1.5) drop-shadow(0 0 10px #FFA500); }
      100% { filter: none; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(s);
}

export default ChallengePage;
