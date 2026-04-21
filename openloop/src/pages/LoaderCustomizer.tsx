import React, { useState } from 'react';
import { Preloader } from '../components/common/Preloader';

export const LoaderCustomizer: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [speed, setSpeed] = useState<number>(2.0);
  const [showPreloader, setShowPreloader] = useState(false);
  const [playCount, setPlayCount] = useState(0); // Used to force a remount of the Preloader
  
  const handlePlay = () => {
    setShowPreloader(true);
    setPlayCount(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '2rem', background: '#020600', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Share Tech Mono', color: '#c6ff00', marginBottom: '1rem' }}>PRELOADER CUSTOMIZER</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
        Test and configure the preloader. When "Play Animation" is clicked, the preloader will take over the screen, and disappear once the duration concludes.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 'bold' }}>
          Theme Background
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as 'dark'|'light')}
            style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}
          >
            <option value="light">Light Mode (White bg, Black text)</option>
            <option value="dark">Dark Mode (Black bg, White/Neon text)</option>
          </select>
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 'bold' }}>
          Animation Duration (Seconds)
          <input 
            type="number" 
            min="0.5" 
            max="15" 
            step="0.5"
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ padding: '0.8rem', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}
          />
        </label>
        
        <button 
          onClick={handlePlay}
          style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#c6ff00', 
            color: '#000', 
            border: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold',
            fontFamily: 'Share Tech Mono',
            letterSpacing: '1px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          PLAY ANIMATION
        </button>
      </div>

      {showPreloader && (
        <Preloader 
           key={playCount} 
           theme={theme} 
           duration={speed} 
           onComplete={() => setShowPreloader(false)} 
        />
      )}
    </div>
  );
};
