import React from 'react';
import TeamCard from './TeamCard';

function TeamList({ teams = [], searchTerm = '' }) {
  return (
    <div className="flight-list">
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          {teams.length} team{teams.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {teams.length > 0 ? (
        <div className="search-results">
          {teams.map((team, index) => (
            <TeamCard key={team.callsign || index} team={team} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🔍</p>
          <h3>No teams found</h3>
          <p style={{ color: '#7f8c8d' }}>
            Try searching for a different team name or category.
          </p>
        </div>
      )}
    </div>
  );
}

export default TeamList;
