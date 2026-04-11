import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

interface MobileAboutProps {
  scrollTo: (id: string) => void;
}

export const MobileAbout: React.FC<MobileAboutProps> = ({ scrollTo }) => {
  const aboutRef = useRef<HTMLElement>(null);
  const traverseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label
      gsap.fromTo('.section-label',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Heading split animation
      gsap.fromTo('.section-heading .word',
        { y: '100%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Body content
      gsap.fromTo('.section-body',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Divider line
      gsap.to('.section-divider', {
        width: '100%',
        duration: 0.8,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.section-divider',
          start: 'top 90%',
        }
      });

      // Highlight chips
      gsap.fromTo('.highlight-chip',
        { opacity: 0, scale: 0.8, y: 10 },
        {
          opacity: 1, scale: 1, y: 0,
          stagger: 0.07,
          duration: 0.4,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.about-highlights',
            start: 'top 85%'
          }
        }
      );

      // CTA arrow infinite animation
      gsap.to('.arrow-line', {
        scaleX: 1.3,
        duration: 0.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: 'left center'
      });

    }, aboutRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={aboutRef} className="mobile-section">
      <div className="section-divider" />
      <div className="section-label">// 001 — ABOUT</div>

      <h2 className="section-heading">
        <span className="word">WHAT</span>{' '}
        <span className="word">IS</span>{' '}
        <span className="word">
          <span style={{ backgroundImage: "linear-gradient(to bottom, #C6FF00, #FFFFFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OPEN LOOP</span>
        </span>
      </h2>

      <div className="about-body section-body">
        <p>
          OpenLoop is YenTech which is a part of Yenepoya School of 
          Engineering's hackathon — 24 hours of 
          raw innovation, sleepless engineering, and breakthrough ideas.
          We bring together the brightest minds to build what doesn't
          exist yet.
        </p>
        <p>
          This isn't just a hackathon. It's a launchpad. Past editions
          have produced startups, patents, and products used by millions.
          Your turn.
        </p>
      </div>

      <div ref={traverseRef} className="traverse-block section-body">
        <div className="traverse-line" />
        <div className="traverse-content">
          <span className="traverse-num">24</span>
          <span className="traverse-unit">HOURS</span>
          <span className="traverse-label">of non-stop building</span>
        </div>
        <div className="traverse-line" />
      </div>

      <div className="about-highlights section-body">
        {['Innovation', 'Mentorship', 'Networking', 'Prizes'].map((item, i) => (
          <div key={i} className="highlight-chip">
            <span className="chip-dot" />
            {item}
          </div>
        ))}
      </div>

      <button ref={ctaRef} className="about-cta section-body"
              onClick={() => scrollTo('#timeline')}>
        <span>VIEW TIMELINE</span>
        <div className="cta-arrow">
          <div className="arrow-line" />
          <div className="arrow-head" />
        </div>
      </button>
    </section>
  );
};
