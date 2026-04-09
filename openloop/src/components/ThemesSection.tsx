import React from 'react';
import { normalize, mapRange, lerp } from '../utils/math';

interface ThemesSectionProps {
  scrollVal: number;
}

const CARDS_DATA = [
  { id: 1, title: 'SYNTHESIS' },
  { id: 2, title: 'INTEGRATION' },
  { id: 3, title: 'EXPANSION' }
];

export const ThemesSection: React.FC<ThemesSectionProps> = ({ scrollVal }) => {
  // Scroll range: 0.8 -> 0.95
  const progress = normalize(scrollVal, 0.8, 0.95);
  const isVisible = scrollVal >= 0.79 && scrollVal <= 0.96; // slightly wider than 0.8-0.95 for lerp trailing

  if (!isVisible) return null;

  const totalCards = CARDS_DATA.length;
  // 0.8 to 0.9 is assembly, 0.9 to 0.95 is post-assembly z-axis forward
  const assemblyProgress = normalize(progress, 0, 0.7);
  const postAssemblyProgress = normalize(progress, 0.7, 1);
  const fadeOutProgress = normalize(scrollVal, 0.95, 1);

  // After assembly, move entire group "forward" via scaling up
  const groupScale = lerp(1, 1.5, Math.pow(postAssemblyProgress, 2));
  const groupOpacity = mapRange(fadeOutProgress, 0, 0.5, 1, 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${groupScale})`,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity: groupOpacity
      }}
    >
      <div style={{ position: 'relative', width: '300px', height: '400px' }}>
        {CARDS_DATA.map((card, index) => {
          // Entry logic for each card based on sub-range mapping
          const subRangeStart = index / totalCards;
          const subRangeEnd = (index + 1) / totalCards;
          
          // Local progress for this card's entry
          const cardEntry = normalize(assemblyProgress, subRangeStart, subRangeEnd);
          
          // Assembly transition to grid positions
          // When assemblyProgress > 1, all cards are in stack.
          // The request asks: "After last card: Transition all cards to grid positions"
          // We can use assemblyProgress beyond the last card's subrange.
          const gridTransition = normalize(assemblyProgress, 0.9, 1); // final 10% of assembly is fanning out

          // Stack mode (0 -> 1 of cardEntry)
          const startX = -window.innerWidth / 2 - 300; // -100% basically
          const stackX = 0;
          const entryX = lerp(startX, stackX, Math.pow(cardEntry, 0.5)); // ease out
          
          // Grid mode (0 -> 1 of gridTransition)
          // Fan out horizontally
          const gap = 350;
          const offset = (index - 1) * gap; // -350, 0, 350
          const finalX = lerp(entryX, offset, gridTransition);

          const opacity = Math.min(cardEntry * 2, 1); // fade in fast
          
          // Stacking: previous cards remain visible with slight Z offset per card (simulated by scale/Y)
          const zOffset = (totalCards - index) * 5;
          const scale = lerp(1 - zOffset * 0.01, 1, gridTransition);
          // Only apply a small stacking Y offset before grid
          const yOffset = lerp(-zOffset, 0, gridTransition);

          return (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(25, 35, 50, 0.8)',
                border: '1px solid #00ccff',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '1.5rem',
                backdropFilter: 'blur(10px)',
                opacity,
                transform: `translate(${finalX}px, ${yOffset}px) scale(${scale})`,
                zIndex: index, // Stacking order
                transition: 'none' // Lerp logic ensures smooth movement via React
              }}
            >
              {card.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
