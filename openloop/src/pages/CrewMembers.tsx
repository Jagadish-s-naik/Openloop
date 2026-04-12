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
  { name: 'Radhesh Pai', role: 'President', github: 'https://github.com/radheshpai87', icon: <Shield size={20} />, color: '#C6FF00' },
  { name:'DevKeerthana Pradeep', role: 'Secretary', github: 'https://github.com', icon: <UsersRound size={20} />, color: '#ff2244' },
  { name: 'Mohammed Shameer', role: 'Vice President', github: 'http://github.com/Muhammed-Shameer-PK', icon: <UsersRound size={20} />, color: '#00ccff' },
  { name: 'Jagadish S Naik', role: 'Web Development Head', github: 'https://github.com/Jagadish-s-naik', icon: <Zap size={20} />, color: '#ff2244' },
  { name: 'Ashwin Nethan', role: 'Web Development Head', github: 'https://github.com/Ashwinnethan64-maker', icon: <Zap size={20} />, color: '#ff2244' },
  { name: 'Dinesh A', role: 'Designer', github: 'https://github.com/dineshyr29-04', icon: <Earth size={20} />, color: '#C6FF00' },
  { name: 'Dhanush Shenoy H', role: 'AI/ML Head', github: 'https://github.com/abbysallord', icon: <Zap size={20} />, color: '#00ccff' },
  { name: 'Ashwin R', role: 'AI/ML Head', github: 'https://github.com', icon: <Zap size={20} />, color: '#00ccff' },
  { name: 'Anand M', role: 'Media/Graphics Head', github: 'https://github.com/anandmahadev', icon: <Shield size={20} />, color: '#ff2244' },
  { name: 'Sana Zainaba', role: 'Media/Graphics Head', github: 'https://github.com', icon: <Shield size={20} />, color: '#C6FF00' },
  { name: 'Srithan', role: 'Social Co-ordinator', github: 'https://github.com', icon: <Earth size={20} />, color: '#C6FF00' },
  { name: 'Rinu Manoj', role: 'Program Manager', github: 'https://github.com', icon: <Zap size={20} />, color: '#00ccff' },
  { name: 'Safwan M', role: 'Multi Media Manager', github: 'https://github.com', icon: <Shield size={20} />, color: '#ff2244' },
  { name: 'Amal VS ', role: 'Organising Committee', github: 'https://github.com/Amal-v-s', icon: <UsersRound size={20} />, color: '#C6FF00' },
  { name: 'Mohammed Reehan', role: 'Organising Committee', github: 'https://github.com', icon: <UsersRound size={20} />, color: '#C6FF00' },
  { name: 'Divya Shettar', role: 'Organising Committee', github: 'https://github.com/divya5623', icon: <UsersRound size={20} />, color: '#C6FF00' },
  { name: 'Chethan M', role: 'Organising Committee', github: 'https://github.com ', icon: <Shield size={20} />, color: '#ff2244' },

];

export const CrewMembers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Premium Entry animations
      gsap.fromTo('.crew-header', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
      );

      gsap.fromTo('.crew-card', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo('.back-link', 
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="crew-members-page" ref={containerRef}>
      {/* Dynamic Background */}
      <div className="page-background">
        <div className="bg-glow-main" />
        <div className="bg-grid-overlay" />
      </div>

      <div className="crew-content-wrapper">
        <nav className="crew-top-nav">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>BACK TO NEXUS</span>
          </Link>
        </nav>

        <header className="crew-header">
          <h1 className="crew-title">CREW</h1>
          <p className="crew-subtitle">Meet the team behind OPENLOOP</p>
          <div className="header-glow-line" />
        </header>

        <div className="crew-grid">
          {members.map((member, i) => (
            <div key={i} className="crew-card">
              <div className="card-glass-depth" />
              <div className="card-border-glow" />
              
              <div className="card-image-wrapper">
                <div className="image-placeholder">
                  <span className="placeholder-initials">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <div className="image-ring" style={{'--accent': member.color} as React.CSSProperties} />
                </div>
              </div>

              <div className="card-info">
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">{member.role}</span>
              </div>

              <div className="card-actions">
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn github-btn"
                >
                  <GithubIcon size={20} />
                  <span>GITHUB</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <footer className="crew-page-footer">
          <div className="footer-hud">
            <span className="hud-unit">// TEAM_COUNT: 13</span>
            <span className="hud-unit">// SYSTEM: STABLE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
