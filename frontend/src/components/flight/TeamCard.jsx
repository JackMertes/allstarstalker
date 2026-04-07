import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightStatus from './FlightStatus';
import teamService from '../../services/teamService';
import { useFavorites } from '../../hooks/useFavorites';

function getLocationDisplay(team) {
  if (team.origin && team.destination) return `${team.origin} → ${team.destination}`;
  if (team.origin)                     return team.origin;
  if (team.destination)                return team.destination;
  return 'Location unknown';
}

function TeamCard({ team }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggle }        = useFavorites();

  const isLive    = team.status === 'ACTIVE';
  const isFav     = isFavorite(team.callsign);

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const response = await teamService.checkStatus(team.callsign);
      const statusData = response[team.callsign];
      // Pass data in navigation state whenever we have any position data (flying or last known)
      if (statusData?.raw) {
        navigate(`/flight/${team.callsign}`, { state: { flightData: statusData } });
      } else {
        navigate(`/flight/${team.callsign}`);
      }
    } catch {
      navigate(`/flight/${team.callsign}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracking = () => {
    console.log('Add to tracking:', team.callsign);
  };

  return (
    <div className="team-card" style={{ position: 'relative' }}>
      {/* Live indicator dot */}
      <div className={`status-dot ${isLive ? 'live' : 'offline'}`} title={isLive ? 'Live' : 'Not flying'} />

      {/* ── Star / favorite button ── */}
      <button
        onClick={() => toggle(team.callsign)}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          position: 'absolute',
          top: 10,
          right: 12,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          lineHeight: 1,
          padding: '2px 4px',
          borderRadius: 6,
          transition: 'transform 0.15s',
          zIndex: 2,
          filter: isFav ? 'none' : 'grayscale(1) opacity(0.45)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ⭐
      </button>

      {/* Navy header bar */}
      <div className="card-header" style={{ paddingRight: 36 }}>
        <h3 className="card-team-name">{team.team}</h3>
        <span className="category-badge">{team.category}</span>
      </div>

      {/* Callsign */}
      {team.callsign && (
        <div style={{ padding: '6px 16px 0', fontSize: 12, color: '#8a98a8', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
          {team.callsign}
        </div>
      )}

      {/* Main info */}
      <div className="card-body">
        <div className="card-location">
          <span className="location-icon">{isLive ? '✈️' : '📍'}</span>
          <div>
            <span className="location-label">{isLive ? 'In Flight' : 'Location'}</span>
            <span className="location-value">{getLocationDisplay(team)}</span>
          </div>
        </div>

        <FlightStatus status={team.status} />
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button
          className="btn btn-primary"
          onClick={handleCheckStatus}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Show Details'}
        </button>
        <button className="btn btn-secondary" onClick={handleAddToTracking}>
          + Track
        </button>
      </div>
    </div>
  );
}

export default TeamCard;
