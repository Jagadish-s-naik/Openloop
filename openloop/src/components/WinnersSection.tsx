import React from 'react';

interface Winner {
  rank: number;
  team: string;
  prize: string;
  description: string;
}

const WINNERS: Winner[] = [
  { rank: 2, team: "CYBER PULSE", prize: "₹40,000", description: "Most Scalable Infrastructure" },
  { rank: 1, team: "NEURAL NODE", prize: "₹75,000", description: "Overall Grand Champion" },
  { rank: 3, team: "VOID RUNNERS", prize: "₹25,000", description: "Best Technical Implementation" },
];

export const WinnersSection: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ color: '#C6FF00', fontSize: '14px', letterSpacing: '0.4em', marginBottom: '10px' }}>// HALL OF FAME</div>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#fff', margin: 0 }}>HACKATHON <span style={{ color: '#C6FF00' }}>WINNERS</span></h2>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '20px',
        flexWrap: 'wrap',
        minHeight: '400px'
      }}>
        {WINNERS.map((winner) => {
          const isFirst = winner.rank === 1;
          const height = isFirst ? '320px' : winner.rank === 2 ? '280px' : '240px';
          const order = winner.rank === 1 ? 2 : winner.rank === 2 ? 1 : 3;

          return (
            <div
              key={winner.rank}
              style={{
                order: order,
                width: 'clamp(280px, 25vw, 340px)',
                height: height,
                background: isFirst ? 'rgba(198, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isFirst ? '#C6FF00' : 'rgba(198, 255, 0, 0.3)'}`,
                borderRadius: '16px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                transition: 'all 0.5s ease',
                transform: `translateY(${(1 - scrollProgress) * (winner.rank * 50)}px)`,
                opacity: scrollProgress,
                boxShadow: isFirst ? '0 0 50px rgba(198, 255, 0, 0.2)' : 'none'
              }}
            >
              {/* Rank Badge */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: isFirst ? '#C6FF00' : '#222',
                color: isFirst ? '#000' : '#C6FF00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '2px solid #C6FF00',
                boxShadow: isFirst ? '0 0 20px #C6FF00' : 'none'
              }}>
                {winner.rank === 1 ? '1st' : winner.rank === 2 ? '2nd' : '3rd'}
              </div>

              <h3 style={{ fontSize: '28px', color: '#fff', margin: '10px 0 5px', textAlign: 'center' }}>{winner.team}</h3>
              <div style={{ color: '#C6FF00', fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>{winner.prize}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textAlign: 'center', lineHeight: '1.4' }}>{winner.description}</div>
              
              {isFirst && (
                <div style={{
                  marginTop: '20px',
                  padding: '5px 15px',
                  background: '#C6FF00',
                  color: '#000',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em'
                }}>
                  GRAND CHAMPION
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '60px',
        textAlign: 'center',
        padding: '20px',
        border: '1px dashed rgba(198, 255, 0, 0.2)',
        borderRadius: '12px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '14px'
      }}>
        Congratulations to all participants! Every line of code built during OpenLoop 2026 is a step towards the future.
      </div>
    </div>
  );
};
