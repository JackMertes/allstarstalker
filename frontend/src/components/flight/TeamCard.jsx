import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightStatus from './FlightStatus';
import teamService from '../../services/teamService';
import { useFavourites } from '../../hooks/useFavourites';

function getLocationDisplay(team) {
  if (team.origin && team.destination) return `${team.origin} → ${team.destination}`;
  if (team.origin)                     return team.origin;
  if (team.destination)                return team.destination;
  return 'Location unknown';
}

function TeamCard({ team }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading]         = useState(false);
  const { isFavourite, toggle }       = useFavourites();

  const isLive    = team.status === 'ACTIVE';
  const isFav     = isFavourite(team.callsign);

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const response = await teamService.checkStatus(team.callsign);
      const statusData = response[team.callsign];
      if (statusData?.is_flying) {
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

      {/* ── Star / favourite button ── */}
      <button
        onClick={() => toggle(team.callsign)}
        aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        title={isFav ? 'Remove from favourites' : 'Add to favourites'}
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

      {/* Main info */}
      <div className="card-body">
        <div className="card-location">
          <span className="location-icon">{isLive ? '✈️' : '🏟️'}</span>
          <div className="location-text">
            <div className="location-label">{isLive ? 'In Flight' : 'Last Known Location'}</div>
            <div className="location-value">{getLocationDisplay(team)}</div>
          </div>
        </div>
      </div>

      {/* Show Details toggle */}
      <button
        className="details-toggle"
        onClick={() => setShowDetails(prev => !prev)}
        aria-expanded={showDetails}
      >
        Show Details
        <span className={`toggle-arrow ${showDetails ? 'open' : ''}`}>▼</span>
      </button>

      {/* Collapsible detail rows */}
      {showDetails && (
        <div className="card-details">
          <div className="detail-row">
            <span className="detail-label">Callsign</span>
            <span className="detail-value">{team.callsign}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <FlightStatus status={team.status} />
          </div>
          {team.category && (
            <div className="detail-row">
              <span className="detail-label">League</span>
              <span className="detail-value">{team.category}</span>
            </div>
          )}
          {team.origin && (
            <div className="detail-row">
              <span className="detail-label">Origin</span>
              <span className="detail-value">{team.origin}</span>
            </div>
          )}
          {team.destination && (
            <div className="detail-row">
              <span className="detail-label">Destination</span>
              <span className="detail-value">{team.destination}</span>
            </div>
          )}
          {team.aircraft && (
            <div className="detail-row">
              <span className="detail-label">Aircraft</span>
              <span className="detail-value">{team.aircraft}</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="card-actions">
        <button
          className="btn btn-primary"
          onClick={handleCheckStatus}
          disabled={loading}
        >
          {loading ? 'Checking…' : 'Check Status'}
        </button>
        <button className="btn btn-secondary" onClick={handleAddToTracking}>
          Add to Tracking
        </button>
      </div>
    </div>
  );
}

export default TeamCard;
