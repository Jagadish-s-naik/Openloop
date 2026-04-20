import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TopSelected25: React.FC = () => {
  const navigate = useNavigate();

  // Generate 25 teams
  const teams = Array.from({ length: 25 }, (_, i) => ({
    id: `OL${String(i + 1).padStart(3, '0')}`,
    name: `Team ${i + 1}`,
  }));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020600',
      color: '#fff',
      fontFamily: "'Share Tech Mono', monospace",
      padding: '40px 20px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(198, 255, 0, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: '1px solid rgba(198, 255, 0, 0.3)',
            color: '#C6FF00',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '30px',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(198, 255, 0, 0.1)';
            e.currentTarget.style.borderColor = '#C6FF00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.borderColor = 'rgba(198, 255, 0, 0.3)';
          }}
        >
          <ArrowLeft size={16} /> BACK TO HUB
        </button>

        <h1 style={{ 
          fontSize: 'clamp(32px, 5vw, 64px)', 
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(to bottom, #d9ed91, #8cef56)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em'
        }}>
          TOP SELECTED 25
        </h1>

        <div className="teams-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 'clamp(10px, 3vw, 20px)',
          width: '100%'
        }}>
          <style>{`
            @media (max-width: 480px) {
              .teams-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
          {teams.map((team) => (
            <div 
              key={team.id}
              style={{
                background: 'rgba(20, 25, 15, 0.6)',
                border: '1px solid rgba(198, 255, 0, 0.2)',
                borderRadius: '8px',
                padding: 'clamp(16px, 4vw, 24px)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C6FF00';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(198, 255, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(198, 255, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                fontSize: '12px', 
                color: '#C6FF00', 
                opacity: 0.8, 
                marginBottom: '8px',
                letterSpacing: '0.2em'
              }}>
                {team.id}
              </div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: '#fff',
                letterSpacing: '0.05em'
              }}>
                {team.name}
              </div>
              
              {/* Corner accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '20px',
                height: '20px',
                borderTop: '2px solid rgba(198, 255, 0, 0.4)',
                borderRight: '2px solid rgba(198, 255, 0, 0.4)',
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
