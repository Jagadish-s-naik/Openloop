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
  const progressRingRef = useRef<SVGCircleElement>(null);

  const title = "OPENLOOP";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Progress Animation
      const tl = gsap.timeline({
        onUpdate: () => {
          const p = Math.floor(tl.progress() * 100);
          setProgress(p);
          
          // Update SVG ring stroke (circumference is ~283)
          if (progressRingRef.current) {
            const offset = 283 - (tl.progress() * 283);
            progressRingRef.current.style.strokeDashoffset = offset.toString();
          }
        },
        onComplete: () => handleExit()
      });

      tl.to({}, { duration: 3.0 }); // 3s cinematic load

      // 2. Letter Reveal
      gsap.to(".letter", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2
      });

      // 3. Glitch intensify sequence
      gsap.to(".main-title", {
        className: "main-title glitch",
        delay: 2.4,
        duration: 0.6
      });

      const handleExit = () => {
        const exitTl = gsap.timeline({
          onComplete: () => onComplete()
        });

        exitTl.to(coreRef.current, {
          scale: 1.8,
          opacity: 1,
          duration: 0.4,
          ease: "back.in(2)"
        });

        exitTl.to(".ring, .loader-text", {
          scale: 12,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power4.out"
        }, "-=0.2");

        exitTl.set(burstRef.current, { display: 'block' });
        exitTl.to(burstRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in"
        }, "-=0.6");

        exitTl.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
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
      <div className="preloader-scanner" />
      
      {/* HUD Readouts */}
      <div className="terminal-readout tr-tl">
        [ SYSTEM_BOOT_SEQUENCE_IDENTIFIED ]<br/>
        [ KERNEL_LOAD_OFFSET_0x7F ]<br/>
        [ SYNCING_CORE_SYNERGY ]
      </div>

      <div className="terminal-readout tr-br">
        VER: 2.0.26_STABLE<br/>
        UID: 89AB-FF21-C6D9<br/>
        LOC: GLOBAL_GRID
      </div>
      
      <div className="exit-burst" ref={burstRef} />

      <div className="loader-visual" ref={coreRef}>
        <div className="pulse-ring" />
        <svg viewBox="0 0 100 100" className="ring">
          {/* Static Background Rings */}
          <circle cx="50" cy="50" r="48" className="ring-outer" />
          
          {/* Rotating Hud Arc */}
          <circle cx="50" cy="50" r="32" className="ring-arc" />
          
          {/* Progress Filling Ring */}
          <circle 
            ref={progressRingRef}
            cx="50" cy="50" r="45" 
            className="ring-progress" 
            style={{ strokeDashoffset: '283' }}
          />
        </svg>
      </div>

      <div className="loader-text">
        <h1 className="main-title">
          {title.split("").map((l, i) => (
            <span key={i} className="letter" style={{ transform: 'translateY(10px)' }}>{l}</span>
          ))}
        </h1>
        <p className="sub-title">Initializing System diagnostic...</p>
        <div className="percentage">{progress}%</div>
      </div>
    </div>
  );
};
