import React, { useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Gauge, Map, MapPin, Users, UsersRound, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TopSelected25.css';

const TeamCard: React.FC<{ team: any; index: number; onClick: (team: any) => void }> = ({ team, index, onClick }) => {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    cardRef.current.style.setProperty('--rotateX', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotateY', `${rotateY}deg`);
    cardRef.current.style.setProperty('--x', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rotateX', `0deg`);
    cardRef.current.style.setProperty('--rotateY', `0deg`);
  };

  return (
    <article 
      ref={cardRef}
      className="team-card-item"
      onClick={() => onClick({ ...team, rank: index + 1 })}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
    >
      <div className="light" />
      <div className="team-card-meta">
        <div className="team-id-block">
          <span className="team-field-label">TEAM ID</span>
          <span className="team-id-pill">{team.id}</span>
        </div>
        <span className="team-rank-pill">#{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="team-card-body">
        <div className='team-card-photo'>
          <div className="photo-placeholder">
             <ExternalLink size={10} />
          </div>
          <h2 className='team-card-photo-para'>Click for Details</h2>
        </div>
        <div className="team-card-name-mini">{team.name}</div>
      </div>

      <div className="team-card-foot">
        <span className="team-tag">SHORTLISTED TEAM</span>
      </div>
      <div className="team-card-corner" />
    </article>
  );
};

export const TopSelected25: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const teams = [
    { id: 'OL01', name: 'Alt F4' },
    { id: 'OL02', name: "Karan's Team" },
    { id: 'OL03', name: 'ByteBots' },
    { id: 'OL04', name: 'Code Burglars' },
    { id: 'OL05', name: 'Algo Boys' },
    { id: 'OL06', name: 'ButterByte' },
    { id: 'OL07', name: 'OpenSHA' },
    { id: 'OL08', name: 'AAF11' },
    { id: 'OL09', name: 'System Crash' },
    { id: 'OL10', name: 'Evo' },
    { id: 'OL11', name: 'SquidWardDevs' },
    { id: 'OL12', name: 'Code Ninjas'},
    { id: 'OL13', name: 'Dot&Key' },
    { id: 'OL14', name: 'ZenithAI' },
    { id: 'OL15', name: 'rohan' },
    { id: 'OL16', name: 'Loop Crackers' },
    { id: 'OL17', name: 'The Faah Sparrow' },
    { id: 'OL18', name: 'Yen Quads' },
    { id: 'OL19', name: 'Code Crafters' },
    { id: 'OL20', name: 'Isaac' },
    { id: 'OL21', name: 'Simple coders' },
    { id: 'OL22', name: 'Next-gen' },
    { id: 'OL23', name: 'QuantumCoders' },
    { id: 'OL24', name: 'Kai' },
    { id: 'OL25', name: 'Hacktivators' },
  ];

  const achievements = [
    { value: '309', label: 'Total participants', hint: 'Makers who joined OpenLoop', tone: '#7da2ff', icon: Users },
    { value: '121', label: 'Total teams', hint: 'Strong collaborative entries', tone: '#52ebff', icon: UsersRound },
    { value: '109', label: 'Total colleges', hint: 'Campuses represented', tone: '#eb2675', icon: Building2 },
    { value: '14', label: 'Total states', hint: 'Regional spread across India', tone: '#ffd88a', icon: Map },
    { value: '58', label: 'Total cities', hint: 'Urban and semi-urban participation', tone: '#d5b7ff', icon: MapPin },
    { value: '70%', label: 'Completion rate', hint: 'Teams that shipped end-to-end', tone: '#e4ebff', icon: Gauge },
  ];

  return (
    <div className="selected-page">
      {/* Background decoration */}
      <div className="selected-bg" />

      <div className="selected-wrap">
        <button 
          onClick={() => navigate('/')}
          className="selected-back-btn"
        >
          <ArrowLeft size={16} /> BACK TO HUB
        </button>

        <h1 className="selected-title">
          SHORT LISTED SELECTED 25
        </h1>

        <p className="selected-subtitle">Official shortlisted teams with Team ID and Team Name</p>

        <div className="teams-grid">
          {teams.map((team, index) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              index={index} 
              onClick={setSelectedTeam} 
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedTeam && (
            <div className="team-modal-overlay" onClick={() => setSelectedTeam(null)}>
              <motion.div 
                className="team-modal-content"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close-btn" onClick={() => setSelectedTeam(null)}>
                  <X size={24} />
                </button>

                <div className="modal-photo-box">
                  <img 
                    src={`https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop`} 
                    alt={selectedTeam.name}
                    className="modal-large-photo"
                  />
                  <div className="modal-photo-overlay" />
                  <div className="modal-id-badge">{selectedTeam.id}</div>
                </div>

                <div className="modal-info-box">
                  <div className="modal-label">TEAM NAME</div>
                  <h2 className="modal-team-name">{selectedTeam.name}</h2>                  
                </div>

                <div className="modal-footer">
                  <div className="modal-status-pill">OFFICIAL SHORTLISTED TEAM</div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <section className="achievements-section" aria-labelledby="registration-stats-title">
          <div className="achievements-head">
            <p className="achievements-kicker">HACKATHON ACHIEVEMENTS</p>
            <h2 id="registration-stats-title" className="achievements-title">Registration Stats</h2>
            <p className="achievements-subtitle">These numbers highlight the reach and impact of OpenLoop.</p>
          </div>

          <div className="achievements-highlight-strip">
            <div className="achievements-highlight-item">
              <span className="highlight-number">300+</span>
              
              <span className="highlight-label">Participants</span>
            </div>
            <div className="achievements-highlight-item">
              <span className="highlight-number">120+</span>
              <span className="highlight-label">Teams</span>
            </div>
            <div className="achievements-highlight-item">
              <span className="highlight-number">100+</span>
              <span className="highlight-label">Colleges</span>
            </div>
          </div>

          <div className="achievements-body">
            <p className="achievements-story">
              OpenLoop attracted a strong multi-city, multi-campus community. With teams coming from 14 states and 58 cities,
              the event built a wide innovation network beyond a single region.
            </p>

            <ul className="achievement-flow-list" aria-label="Detailed registration statistics">
              {achievements.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    className="achievement-flow-item"
                    style={{ '--tone': item.tone } as React.CSSProperties}
                  >
                    <span className="achievement-flow-icon">
                      <Icon size={16} />
                    </span>
                    <span className="achievement-flow-label">{item.label}</span>
                    <span className="achievement-flow-value">{item.value}</span>
                    <span className="achievement-flow-hint">{item.hint}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
