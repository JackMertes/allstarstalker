import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teamService from '../../services/teamService';
import { getFlightStatus } from '../../utils/mockData';
import { FlightStatus } from '.';
import '../../styles/Flight.css';
import '../../styles/Common.css';

// Toggle to false when backend is ready
const USE_MOCK = true;

// Derives a readable location string from team data
function getLocationDisplay(team) {
  if (team.status === 'ACTIVE') return 'Currently Airborne';
  if (team.lastAirport) return team.lastAirport;
  if (team.origin)     return team.origin;
  return 'Location unavailable';
}

function TeamCard({ team }) {
  const navigate = useNavigate();
  const [loading, setLoading]       = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isLive = team.status === 'ACTIVE';

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      let statusData;

      if (USE_MOCK) {
        await new Promise(res => setTimeout(res, 500));
        statusData = getFlightStatus(team.callsign);
      } else {
        // Real API — returns { [callsign]: statusData }
        const response = await teamService.checkStatus(team.callsign);
        statusData = response[team.callsign];
      }

      if (statusData && statusData.is_flying) {
        navigate(`/flight/${team.callsign}`, { state: { flightData: statusData } });
      } else {
        alert(`${team.team} is not currently flying.`);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      alert('Failed to check flight status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracking = async () => {
    try {
      if (USE_MOCK) {
        await new Promise(res => setTimeout(res, 300));
        alert(`${team.team} added to tracking!`);
      } else {
        await teamService.addTracking(team.callsign);
        alert(`${team.team} added to tracking!`);
      }
    } catch (error) {
      console.error('Error adding to tracking:', error);
      alert('Failed to add to tracking. Please try again.');
    }
  };

  return (
    <div className="flight-card">
      {/* Live / offline indicator dot */}
      <div className={`live-dot ${isLive ? 'live' : 'offline'}`} title={isLive ? 'Live' : 'Not flying'} />

      {/* Navy header bar */}
      <div className="card-header">
        <h3 className="card-team-name">{team.team}</h3>
        <span className="category-badge">{team.category}</span>
      </div>

      {/* Main info: location at a glance */}
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
