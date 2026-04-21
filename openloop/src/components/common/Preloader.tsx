import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

export interface PreloaderProps {
  onComplete?: () => void;
  theme?: 'dark' | 'light';
  duration?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ 
  onComplete, 
  theme = 'dark', 
  duration = 2.0 
}) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) {
            gsap.to(containerRef.current, {
              yPercent: -100, // Slide up seamlessly to reveal the website
              duration: 0.8,
              ease: "power3.inOut",
              onComplete: onComplete
            });
          }
        }
      });

      // Smooth progress update
      const pObj = { p: 0 };
      tl.to(pObj, {
        p: 100,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: () => setProgress(Math.round(pObj.p))
      });

      // Loader line extending
      gsap.fromTo(lineRef.current, 
        { scaleX: 0 },
        { scaleX: 1, duration: duration, ease: "power2.inOut" }
      );

      // Text simple reveal
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: Math.min(1.0, duration / 2), ease: "power2.out" }
      );
      
      // Minimal exit
      tl.to([textRef.current, lineRef.current, subTextRef.current], {
        opacity: 0,
        y: -15,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.in"
      }, "+=0.1");

    });

    return () => ctx.revert();
  }, [onComplete, duration]);

  return (
    <div className={`hq-preloader hq-preloader-${theme}`} ref={containerRef}>
      <div className="hq-preloader-content">
        <h1 className="hq-preloader-title" ref={textRef}>
          OPEN<span className="text-accent">LOOP</span>
        </h1>
        <div className="hq-preloader-bar-bg">
          <div className="hq-preloader-bar-fill" ref={lineRef}></div>
        </div>
        <div className="hq-preloader-sub" ref={subTextRef}>
          LOADING SYSTEM... {progress}%
        </div>
      </div>
    </div>
  );
};
