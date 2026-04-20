import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    { id: 'OL25', name: 'kindle' },
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
          TOP SELECTED 25
        </h1>

        <p className="selected-subtitle">Official shortlisted teams with Team ID and Team Name</p>

        <div className="teams-grid">
          {teams.map((team) => (
            <article key={team.id} className="team-card-item">
              <div className="team-id-label">TEAM ID</div>
              <div className="team-id-text">
                {team.id}
              </div>

              <div className="team-name-label">TEAM NAME</div>
              <div className="team-name-text" title={team.name}>
                {team.name}
              </div>

              <div className="team-card-corner" />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
