import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

const members = [
  { 
    name: 'Radhesh Pai', 
    role: 'Lead Organizer', 
    photo: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2F0JTIwZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D', 
    phone: '+91 89513 49166',
  },
  { 
    name: 'Mohammed shameer', 
    role: 'Vice president', 
    photo: 'https://via.placeholder.com/150', 
    phone: '+91 6282 679 146',
  },
  { 
    name: 'Jagadish Naik', 
    role: 'Web Development Head', 
    photo: 'https://via.placeholder.com/150', 
    phone: '+91 80732 36744',
  },
];

export const MobileTeam: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main section transitions
      gsap.fromTo('.section-label',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
        }
      );

      gsap.fromTo('.section-heading .word',
        { y: '100%', opacity: 0 },
        {
          y: '0%', opacity: 1, stagger: 0.15, duration: 1.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.to('.team-card', {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.team-grid',
          start: 'top 80%',
        }
      });

      // Show CTA button
      gsap.to('.team-cta-wrap', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.team-cta-wrap',
          start: 'top 95%'
        }
      });

      // Avatar rings stagger start
      gsap.fromTo('.avatar-ring',
        { opacity: 0 },
        {
          opacity: 1, stagger: 0.15, duration: 0.4, delay: 0.4,
          scrollTrigger: { trigger: '.team-grid', start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="mobile-section">
      <div className="section-divider" />
      <div className="section-label">// 004 — TEAM</div>
      <h2 className="section-heading">
        <span className="word">THE</span>{' '}
        <span className="word">CREW</span>
      </h2>

      <div className="team-grid section-body" style={{ marginBottom: '32px' }}>
        {members.map((m, i) => (
          <div key={i} ref={el => { cardsRef.current[i] = el; }} className="team-card">
            
            <div className="team-info">
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
            </div>
            <div className="team-links">
              <a href={`tel:${m.phone.replace(/\s+/g, '')}`} className="team-link">
                <span className="link-icon">#</span>
                <span>{m.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Meet the Crew Link */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', opacity: 0, transform: 'translateY(20px)' }} className="team-cta-wrap">
        <Link 
          to="/crew" 
          className="cta-button" 
          style={{ 
            textDecoration: 'none',
            fontSize: '13px',
            padding: '10px 24px',
            border: '1px solid #C6FF00',
            background: 'transparent',
            color: '#C6FF00'
          }}
        >
          MEET ALL CREW MEMBERS
        </Link>
      </div>
    </section>
  );
};
