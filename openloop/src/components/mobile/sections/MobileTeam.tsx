import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

const members = [
  { 
    name: 'Radhesh Pai', 
    role: 'Lead Organizer', 
    photo: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2F0JTIwZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D', 
    email: 'alex@openloop.dev',
    linkedin: '#',
    github: '#'
  },
  { 
    name: 'Mohammed', 
    role: 'Secretary', 
    photo: 'https://via.placeholder.com/150', 
    email: 'sarah@openloop.dev',
    linkedin: '#',
    github: '#'
  },
  { 
    name: 'Jagadhish Naik', 
    role: 'Web Development Head', 
    photo: 'https://via.placeholder.com/150', 
    email: 'marcus@openloop.dev',
    linkedin: '#',
    github: '#'
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
          y: '0%', opacity: 1, stagger: 0.08, duration: 0.7,
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

      <div className="team-grid section-body">
        {members.map((m, i) => (
          <div key={i} ref={el => { cardsRef.current[i] = el; }} className="team-card">
            <div className="team-avatar">
              <img src={m.photo} alt={m.name} />
              <div className="avatar-ring" />
            </div>
            <div className="team-info">
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
            </div>
            <div className="team-links">
              {m.email && (
                <a href={`mailto:${m.email}`} className="team-link">
                  <span className="link-icon">@</span>
                  <span>{m.email}</span>
                </a>
              )}
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="team-link">
                  <span className="link-icon">in</span>
                  <span>LinkedIn</span>
                </a>
              )}
              {m.github && (
                <a href={m.github} target="_blank" rel="noopener noreferrer" className="team-link">
                  <span className="link-icon">gh</span>
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
