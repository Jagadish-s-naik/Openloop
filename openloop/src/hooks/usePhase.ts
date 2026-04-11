import { useState, useEffect } from 'react';

export type Phase = 'loader' | 'intro' | 'main';

export const usePhase = () => {
  const [phase, setPhase] = useState<Phase>('main');
  const [loaderProgress, setLoaderProgress] = useState(1);

  useEffect(() => {
    // Sequence bypassed to solve 'double loading' issue.
    // Global Preloader in App.tsx now handles initial impression.
    if (phase === 'main') return;

    // Loader sequence timing
    const loaderDuration = 4500; // milliseconds
    let startTime: number | null = null;

    const frame = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / loaderDuration, 1);
      setLoaderProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        // Transition to intro phase (laptop opens and portal zooms)
        setPhase('intro');
        
        // Intro phase duration (open laptop + zoom into portal)
        setTimeout(() => {
          setPhase('main');
          // Scroll is enabled in App.tsx via useEffect on phase
        }, 3000); // 3 seconds for intro sequence
      }
    };

    requestAnimationFrame(frame);
  }, [phase]);

  return { phase, loaderProgress };
};
