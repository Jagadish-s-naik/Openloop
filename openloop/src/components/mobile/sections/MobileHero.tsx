import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const MobileHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Clean, minimal elegant fade up for main titles
      tl.fromTo(['.hero-title', '.hero-year'], 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
      )
      // Smooth subtle reveal for content
      .fromTo([badgeRef.current, subRef.current, statsRef.current, buttonsRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' },
        '-=0.8'
      )
      // Soft entrance for tagline
      .fromTo(taglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.6'
      )
      // Gentle drop for scroll cue
      .fromTo(scrollRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      );

    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef}>
      <div className="hero-cyber-grid-wrap">
        <div className="cyber-grid-plane" />
        <div className="cyber-grid-glow" />
        <div className="crosshair-ui">
          <div className="xh-line xh-top" />
          <div className="xh-line xh-bottom" />
          <div className="xh-line xh-left" />
          <div className="xh-line xh-right" />
          <div className="xh-center-glitch" />
        </div>
      </div>

      <div className="hero-top">
        <div ref={badgeRef} className="hero-badge">// HACKATHON 2026</div>
        <p ref={subRef} className="hero-sub">
          24 hours. One chance. Redefine what's possible.
        </p>
        <div ref={statsRef} className="hero-stats">
          <div className="stat"><span className="num">20+</span><span className="lbl">Teams of HACKERS</span></div>
          <div className="stat"><span className="num">24H</span><span className="lbl">DURATION</span></div>
          <div className="stat"><span className="num">₹1.5L</span><span className="lbl">PRIZES</span></div>
        </div>
        
        <div ref={buttonsRef} className="hero-buttons">
          <a href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231" target="_blank" rel="noopener noreferrer" className="btn-hero primary">Registration</a>
          <a href="https://drive.google.com/file/d/1_IM0WD6zowoyv9nopm2RbnwW2dUYwwBE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-hero outline">Brochure</a>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="title-line">
          <span ref={titleRef} className="hero-title">
            <span style={{ backgroundImage: "linear-gradient(to bottom, #d9ed91, #8cef56)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OPEN LOOP</span>
          </span>
        </div>
        <div className="year-line"><span ref={yearRef} className="hero-year">2026</span></div>
        <p ref={taglineRef} className="hero-tagline">// BUILD. BREAK. TRANSCEND.</p>
      </div>

      <div ref={scrollRef} className="scroll-cue">
        <div className="scroll-line" />
        <span>SCROLL</span>
      </div>
    </section >
  );
};
