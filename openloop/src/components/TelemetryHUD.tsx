import React from 'react';


interface TelemetryHUDProps {
  scrollProgress: number;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ scrollProgress }) => {
  const p = scrollProgress;
  
  // Simulated values
  const height = Math.round(p * 35000);
  const range = Math.round(p * 10000);
  
  // Status determination
  let status = 'SYSTEM_READY';
  let statusColor = '#C6FF00';
  
  if (p > 0.01 && p <= 0.12) {
    status = 'LIFT_OFF_ACTIVE';
  } else if (p > 0.12 && p <= 0.25) {
    status = 'ASCENDING_PHASE';
  } else if (p > 0.25 && p <= 0.50) {
    status = 'VIDEO_FEED_SYNC';
  } else if (p > 0.50 && p <= 0.78) {
    status = 'CRUISING_SPEED';
  } else if (p > 0.78 && p <= 0.94) {
    status = 'STABLE_ORBIT';
  } else if (p > 0.94) {
    status = 'RE_ENTRY_INIT';
    statusColor = '#FF4D4D';
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '30px',
        right: '30px',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontFamily: "'Share Tech Mono', monospace",
        color: '#C6FF00',
        textShadow: '0 0 10px rgba(198, 255, 0, 0.3)',
      }}
    >
      {/* Left HUD: Height & Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          padding: '12px 18px',
          borderLeft: '2px solid #C6FF00',
          borderTop: '1px solid rgba(198, 255, 0, 0.2)',
          borderRadius: '0 4px 4px 0',
          minWidth: '180px'
        }}>
          <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.2em', marginBottom: '4px' }}>// ALTITUDE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            {height.toLocaleString()}
            <span style={{ fontSize: '12px', opacity: 0.8 }}>M</span>
          </div>
          
          <div style={{ width: '100%', height: '4px', background: 'rgba(198, 255, 0, 0.1)', marginTop: '8px', position: 'relative' }}>
            <div style={{ 
              width: `${p * 100}%`, 
              height: '100%', 
              background: '#C6FF00', 
              boxShadow: '0 0 10px #C6FF00' 
            }} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 12px',
          background: 'rgba(0, 0, 0, 0.6)',
          border: `1px solid ${statusColor}`,
          borderRadius: '2px',
          fontSize: '11px',
          letterSpacing: '0.1em'
        }}>
          <div style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            background: statusColor,
            animation: 'pulse 1.5s infinite ease-in-out'
          }} />
          {status}
        </div>
      </div>

      {/* Right HUD: Range & Coordinates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          padding: '12px 18px',
          borderRight: '2px solid #C6FF00',
          borderTop: '1px solid rgba(198, 255, 0, 0.2)',
          borderRadius: '4px 0 0 4px',
          minWidth: '180px'
        }}>
          <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.2em', marginBottom: '4px' }}>RANGE //</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            {range.toLocaleString()}
            <span style={{ fontSize: '12px', opacity: 0.8 }}>KM</span>
          </div>
          
          <div style={{ 
            marginTop: '8px',
            fontSize: '10px',
            opacity: 0.7,
            display: 'flex',
            gap: '8px'
          }}>
            <span>LAT: 12.8447° N</span>
            <span>LON: 74.8465° E</span>
          </div>
        </div>

        {/* Dynamic Grid Element */}
        <div style={{
          width: '60px',
          height: '60px',
          border: '1px solid rgba(198, 255, 0, 0.2)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            width: '100%',
            height: '1px',
            background: 'rgba(198, 255, 0, 0.1)',
            position: 'absolute'
          }} />
          <div style={{
            height: '100%',
            width: '1px',
            background: 'rgba(198, 255, 0, 0.1)',
            position: 'absolute'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            border: '1px solid #C6FF00',
            borderRadius: '50%',
            transform: `translate(${(p * 40) - 20}px, ${((1-p) * 40) - 20}px)`,
            transition: 'transform 0.1s linear'
          }} />
          <div style={{ position: 'absolute', top: '2px', left: '2px', fontSize: '6px', opacity: 0.5 }}>TRK_01</div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
