import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          const exitTl = gsap.timeline({
            onComplete: () => onComplete()
          });

          // Elegant split exit
          exitTl.to(ringRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut"
          })
          .to([brandRef.current, percentRef.current], {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            stagger: 0.1
          }, "-=0.3")
          .to(overlayRef.current, {
            opacity: 1,
            duration: 0.3
          }, "-=0.2")
          .to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
          });
        }
      });

      // Smooth manual progress simulation to prevent layout thrashing
      const dummyObj = { p: 0 };
      tl.to(dummyObj, {
        p: 100,
        duration: 2.2, // Smooth ease loading time
        ease: "power1.inOut",
        onUpdate: () => {
          setProgress(Math.round(dummyObj.p));
        }
      });

      gsap.fromTo(brandRef.current, 
        { opacity: 0, letterSpacing: '0px' },
        { opacity: 1, letterSpacing: '8px', duration: 1.5, ease: "power2.out" }
      );
    });

    return () => {
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div className="hq-preloader" ref={containerRef}>
      <div className="hq-background"></div>
      
      <div className="hq-core">
        <div className="hq-rings-wrapper" ref={ringRef}>
          <div className="hq-ring hq-ring-1"></div>
          <div className="hq-ring hq-ring-2"></div>
          <div className="hq-ring hq-ring-3"></div>
          <div className="hq-ring-glow"></div>
        </div>

        <div className="hq-info-wrapper">
          <div className="hq-percentage" ref={percentRef}>
            {progress.toString().padStart(2, '0')}<span className="text-accent">%</span>
          </div>
          <h1 className="hq-brand" ref={brandRef}>
            OPEN<span className="text-accent">LOOP</span>
          </h1>
          <div className="hq-status">INITIALIZING SYSTEMS</div>
        </div>
      </div>
      
      <div className="hq-exit-overlay" ref={overlayRef}></div>
    </div>
  );
};
