import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize GSAP states if needed
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
    setIsOpen(!isOpen);
  };

  const openMenu = () => {
    const links = linksRef.current.filter(Boolean);
    
    gsap.to(menuRef.current, {
      clipPath: 'circle(150% at calc(100% - 32px) 28px)',
      duration: 0.6,
      ease: 'power3.inOut',
      pointerEvents: 'all',
      visibility: 'visible'
    });
    
    gsap.to(links, {
      opacity: 1,
      x: 0,
      stagger: 0.06,
      duration: 0.4,
      ease: 'power2.out',
      delay: 0.3
    });
  };

  const closeMenu = () => {
    const links = linksRef.current.filter(Boolean);

    gsap.to(links, {
      opacity: 0,
      x: -20,
      stagger: 0.03,
      duration: 0.2,
      ease: 'power2.in'
    });
    
    gsap.to(menuRef.current, {
      clipPath: 'circle(0% at calc(100% - 32px) 28px)',
      duration: 0.5,
      ease: 'power3.inOut',
      delay: 0.15,
      pointerEvents: 'none',
      onComplete: () => {
        if (menuRef.current) menuRef.current.style.visibility = 'hidden';
      }
    });
  };

  const navItems = [
    { label: 'Hero', id: '#hero' },
    { label: 'About', id: '#about' },
    { label: 'Themes', id: '#themes' },
    { label: 'Timeline', id: '#timeline' },
    { label: 'Sponsors', id: '#sponsors' },
    { label: 'Team', id: '#team' },
    { label: 'Crew', path: '/crew' },
    { label: 'Contact', id: '#footer' },
  ];

  return (
    <div ref={containerRef}>
      <nav id="mobile-nav">
        <a 
          className="nav-logo" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (isOpen) toggleMenu();
          }}
        >
          <span style={{ color: '#ffffff' }}>OPEN</span>
          <span style={{ color: '#C6FF00' }}>LOOP</span>
        </a>
        <button 
          id="hamburger" 
          aria-label="Toggle Menu"
          className={isOpen ? 'active' : ''} 
          onClick={toggleMenu}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div ref={menuRef} id="mobile-menu" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
        {navItems.map((item, i) => (
          item.path ? (
            <Link
              key={i}
              to={item.path}
              onClick={() => { toggleMenu(); }}
              className="mobile-nav-link"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
            >
              <span className="menu-num">0{i + 1}</span>
              {item.label}
            </Link>
          ) : (
            <a
              key={i}
              ref={el => { linksRef.current[i] = el; }}
              href={item.id}
              onClick={() => { toggleMenu(); }}
            >
              <span className="menu-num">0{i + 1}</span>
              {item.label}
            </a>
          )
        ))}
      </div>
    </div>
  );
};
