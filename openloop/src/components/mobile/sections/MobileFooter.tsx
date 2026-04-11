import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const MobileFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const hrRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to('.footer-title', { y: '0%', duration: 1.5, ease: 'power3.out' })
          .to('.footer-year', { y: '0%', duration: 1.2, ease: 'power2.out' }, '-=1.0')
          .to(tagRef.current, { opacity: 1, duration: 1.0 }, '-=0.5')
          .to(linksRef.current, { opacity: 1, duration: 0.8 }, '-=0.3')
          .to(socialRef.current, { opacity: 1, duration: 0.8 }, '-=0.3')
          .to(hrRef.current, { width: '100%', duration: 1.2, ease: 'power2.inOut' })
          .to(copyRef.current, { opacity: 1, duration: 0.8 })
          .to(topRef.current, { opacity: 1, duration: 0.8 });
      }
    });
  }, []);

  return (
    <footer id="footer" ref={footerRef} className="mobile-footer">
      <div className="section-divider" />

      <div ref={brandRef} className="footer-brand">
        <div className="footer-title-wrap">
          <span className="footer-title">
           <span style={{ backgroundImage: "linear-gradient(to bottom, #d9ed91ff, #8cef56ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OPEN LOOP</span>
          </span>
        </div>
        <div className="footer-year-wrap">
          <span className="footer-year">2026</span>
        </div>
      </div>

      <p ref={tagRef} className="footer-tag">
        Built with passion at YenTech.
      </p>

      <div ref={linksRef} className="footer-links">
        {['About', 'Timeline', 'Sponsors', 'Team'].map((item, i) => (
          <a key={i} href={`#${item.toLowerCase()}`} className="footer-link">
            {item}
          </a>
        ))}
      </div>

      <div ref={socialRef} className="footer-social">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn">IG</a>
        <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer" className="social-btn">TW</a>
        <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer" className="social-btn">IN</a>
        <a href="mailto:hello@openloop.dev"             className="social-btn">@</a>
      </div>

      <div ref={hrRef} className="footer-hr" />

      <div ref={copyRef} className="footer-copy">
        <span>© 2026 OPENLOOP. ALL RIGHTS RESERVED.</span>
        <span>YenTech [Yenepoya Institute of Engineering and Technology]</span>
      </div>

      <button ref={topRef} className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="btt-arrow" />
        <span>BACK TO TOP</span>
      </button>
    </footer>
  );
};
