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

      tl.to('.hero-title', {
        y: '0%',
        duration: 1.8,
        ease: 'power4.out'
      })
        .to('.hero-year', {
          y: '0%',
          duration: 1.2,
          ease: 'power3.out'
        }, '-=0.8')
        .to(badgeRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .to(subRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .to(statsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .to(buttonsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .to(taglineRef.current, {
          opacity: 1,
          duration: 0.4
        }, '-=0.2')
        .to(scrollRef.current, {
          opacity: 1,
          duration: 0.4
        }, '-=0.2');

    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef}>
      <div className="hero-rings-wrap">
        <div className="hero-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <div className="ring-core" />
          <div className="ring-dot" />
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
