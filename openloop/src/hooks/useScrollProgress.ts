import { useEffect, useState } from 'react';

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const wScroll = window.scrollY;
      const wHeight = window.innerHeight;
      const dHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, dHeight - wHeight);
      
      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      
      const progress = wScroll / maxScroll;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollProgress;
};
