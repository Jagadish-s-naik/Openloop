import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, UsersRound, Zap, Shield, Earth } from 'lucide-react';
import './CrewMembers.css';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface Member {
  name: string;
  role: string;
  github: string;
  icon: React.ReactNode;
  color: string;
}

const members: Member[] = [
  { name: 'Radhesh Pai', role: 'Lead Organizer', github: 'https://github.com', icon: <Shield size={20} />, color: '#C6FF00' },
  { name: 'Mohammed', role: 'Secretary', github: 'https://github.com', icon: <UsersRound size={20} />, color: '#00ccff' },
  { name: 'Jagadhish Naik', role: 'Web Development Head', github: 'https://github.com', icon: <Zap size={20} />, color: '#ff2244' },
  { name: 'Arya Sharma', role: 'Technical Coordinator', github: 'https://github.com', icon: <Earth size={20} />, color: '#C6FF00' },
  { name: 'Kevin Dsouza', role: 'Design Lead', github: 'https://github.com', icon: <Zap size={20} />, color: '#00ccff' },
  { name: 'Zoya Khan', role: 'Student Secretary', github: 'https://github.com', icon: <Shield size={20} />, color: '#ff2244' },
];

export const CrewMembers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animations
      gsap.from('.crew-header h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.crew-card', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
      });

      gsap.from('.back-link', {
        x: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="crew-members-page" ref={containerRef}>
      {/* Background Decor */}
      <div className="crew-bg-decor">
        <div className="crew-grid-overlay" />
        <div className="crew-glow-1" />
        <div className="crew-glow-2" />
      </div>

      <div className="crew-container">
        <div className="crew-nav">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>RETURN TO NEXUS</span>
          </Link>
        </div>

        <header className="crew-header">
          <h1>OPENLOOP <span className="crew-highlight">CREW</span> MEMBERS</h1>
          <p>The architects behind the 2026 decentralized synergy loop. Mapping human talent to digital innovation.</p>
        </header>

        <div className="crew-grid">
          {members.map((member, i) => (
            <div key={i} className="crew-card">
              <div className="card-glitch-border" />
              <div className="card-top">
                <div className="role-badge" style={{'--accent-color': member.color} as React.CSSProperties}>
                  {member.icon}
                  <span>{member.role}</span>
                </div>
              </div>
              
              <div className="card-mid">
                <h3 className="member-name">{member.name}</h3>
              </div>

              <div className="card-bottom">
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="github-button"
                >
                  <GithubIcon size={18} />
                  <span>GITHUB PROFILE</span>
                </a>
              </div>

              {/* Decorative corners */}
              <div className="corner tr" />
              <div className="corner bl" />
            </div>
          ))}
        </div>

        <footer className="crew-footer">
          <div className="footer-line" />
          <div className="footer-status">
            SYSTEM STATUS: <span className="status-online">ONLINE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
