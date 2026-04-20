import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Gauge, Map, MapPin, Users, UsersRound } from 'lucide-react';
import './TopSelected25.css';

export const TopSelected25: React.FC = () => {
  const navigate = useNavigate();

  const teams = [
    { id: 'OL01', name: 'Diamond Blender' },
    { id: 'OL02', name: "Karan's Team" },
    { id: 'OL03', name: 'ByteBots' },
    { id: 'OL04', name: 'Nimbus' },
    { id: 'OL05', name: 'Algo boys' },
    { id: 'OL06', name: 'ButterByte' },
    { id: 'OL07', name: 'OpenSHA' },
    { id: 'OL08', name: 'AAF11' },
    { id: 'OL09', name: 'System Crash' },
    { id: 'OL10', name: 'Evo' },
    { id: 'OL11', name: 'SquidWardDevs' },
    { id: 'OL12', name: 'DECODE' },
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
    { id: 'OL24', name: 'Trio squad' },
    { id: 'OL25', name: 'Kindle' },
  ];

  const achievements = [
    { value: '300+', label: 'Total participants', hint: 'Makers who joined OpenLoop', tone: '#7da2ff', icon: Users },
    { value: '100+', label: 'Total teams', hint: 'Strong collaborative entries', tone: '#52ebff', icon: UsersRound },
    { value: '100+', label: 'Total colleges', hint: 'Campuses represented', tone: '#ff6fa9', icon: Building2 },
    { value: '14+', label: 'Total states', hint: 'Regional spread across India', tone: '#ffd88a', icon: Map },
    { value: '58+', label: 'Total cities', hint: 'Urban and semi-urban participation', tone: '#d5b7ff', icon: MapPin },
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
            <article key={team.id} className="team-card-item">
              <div className="team-card-meta">
                <span className="team-id-pill">{team.id}</span>
                <span className="team-rank-pill">#{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="team-name-text" title={team.name}>
                {team.name}
              </div>

              <div className="team-card-foot">
                <span className="team-tag">SHORTLISTED TEAM</span>
              </div>

              <div className="team-card-corner" />
            </article>
          ))}
        </div>

        <section className="achievements-section" aria-labelledby="registration-stats-title">
          <div className="achievements-head">
            <p className="achievements-kicker">HACKATHON ACHIEVEMENTS</p>
            <h2 id="registration-stats-title" className="achievements-title">Registration Stats</h2>
            <p className="achievements-subtitle">These numbers highlight the reach and impact of OpenLoop.</p>
          </div>

          <div className="achievements-highlight-strip">
            <div className="achievements-highlight-item">
              <span className="highlight-number">309</span>
              <span className="highlight-label">Participants</span>
            </div>
            <div className="achievements-highlight-item">
              <span className="highlight-number">120</span>
              <span className="highlight-label">Teams</span>
            </div>
            <div className="achievements-highlight-item">
              <span className="highlight-number">100</span>
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
