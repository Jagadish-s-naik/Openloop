import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onUpdate: () => {
          // Sync state progress for text display
          const p = Math.floor(tl.progress() * 100);
          setProgress(p);
        },
        onComplete: () => {
          handleExit();
        }
      });

      // Simulation of loading (2.5 seconds)
      tl.to({}, { duration: 2.5 });

      const handleExit = () => {
        const exitTl = gsap.timeline({
          onComplete: () => {
            onComplete();
          }
        });

        // 1. Intensify Core
        exitTl.to(coreRef.current, {
          scale: 1.5,
          opacity: 1,
          duration: 0.4,
          ease: "back.in(2)"
        });

        // 2. Outward Burst
        exitTl.to(".ring", {
          scale: 10,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power4.out"
        }, "-=0.2");

        // 3. White Flash & Container Fade
        exitTl.set(burstRef.current, { display: 'block' });
        exitTl.to(burstRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in"
        }, "-=0.6");

        exitTl.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      };
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="preloader-container" ref={containerRef}>
      <div className="preloader-noise" />
      <div className="preloader-scanlines" />
      
      {/* Burst Overlay for Exit */}
      <div className="exit-burst" ref={burstRef} />

      <div className="loader-visual" ref={coreRef}>
        <div className="pulse-ring" />
        <svg viewBox="0 0 100 100" className="ring">
          <circle cx="50" cy="50" r="48" className="ring-outer" />
          <circle cx="50" cy="50" r="38" className="ring-mid" />
          <circle cx="50" cy="50" r="28" className="ring-inner" />
        </svg>
      </div>

      <div className="loader-text">
        <h1 className="main-title">OPENLOOP</h1>
        <p className="sub-title">Initializing System...</p>
        <div className="percentage">{progress}%</div>
      </div>
    </div>
  );
};
