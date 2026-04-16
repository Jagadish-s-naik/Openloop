import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MobileLoaderProps {
  onComplete: () => void;
}

export const MobileLoader: React.FC<MobileLoaderProps> = ({ onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Collect specific ref values inside the hook to ensure they are available
    // and correctly captured for the stagger animation.
    const targets = {
      text: textRef.current,
      sub: subRef.current,
      bar: barRef.current,
      percent: percentRef.current
    };

    const tl = gsap.timeline({
      onComplete: () => {
        if (onCompleteRef.current) onCompleteRef.current();
      }
    });

    // Step 1: Line draws across (0s–0.6s)
    tl.to(lineRef.current, {
      width: '200px',
      duration: 0.6,
      ease: 'power2.inOut'
    })

    // Step 2: OPENLOOP fades + scales in
    .to(textRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.1')

    // Step 3: Sub label types in
    .to(subRef.current, {
      opacity: 1,
      duration: 0.4
    }, '+=0.1')

    // Step 4: Bar fills 0→100% over 1.8s
    .to(fillRef.current, {
      width: '100%',
      duration: 1.8,
      ease: 'none'
    }, '+=0.2')
    .to(percentRef.current, { opacity: 1, duration: 0.2 }, '<')
    
    // Percent counter - now part of the timeline for better synchronization
    tl.to({ val: 0 }, {
      val: 100,
      duration: 1.8,
      ease: 'none',
      onUpdate: function() {
        if (percentRef.current) {
          percentRef.current.textContent = Math.round(this.targets()[0].val) + '%';
        }
      }
    }, '<')

    // Step 5: Tagline fades in
    .to(tagRef.current, {
      opacity: 1,
      duration: 0.4
    }, '-=0.8')

    // Step 6: EVERYTHING exit
    .to([targets.text, targets.sub, targets.bar, targets.percent], {
      opacity: 0,
      y: -20,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.in'
    }, '+=0.3')
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = 'none';
      }
    })

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={loaderRef} id="mobile-loader">
      <div ref={lineRef} className="loader-line" />
      <div ref={textRef} className="loader-brand">
        <span style={{ color: '#ffffff' }}>OPEN</span>
        <span style={{ color: '#C6FF00' }}>LOOP</span>
      </div>
      <div ref={subRef}  className="loader-sub">INITIALIZING SYSTEM</div>
      <div ref={barRef}  className="loader-bar-wrap">
        <div ref={fillRef} className="loader-bar-fill" />
      </div>
      <div ref={percentRef} className="loader-percent">0%</div>
      <div ref={tagRef}  className="loader-tagline">OPENLOOP 2026</div>
    </div>
  );
};
