import React, { useState } from 'react';
import { useNavigate }
  from 'react-router-dom';
import FlightStatus from './FlightStatus';
import teamService
  from '../../services/teamService';
import trackingService from '../../services/trackingService';
import { useFavorites }
  from '../../hooks/useFavorites';

// NBA team primary colors map
const TEAM_COLORS = {
  "Atlanta Hawks": "#E03A3E",
  "Boston Celtics": "#007A33",
  "Brooklyn Nets": "#000000",
  "Charlotte Hornets": "#1D1160",
  "Chicago Bulls": "#CE1141",
  "Cleveland Cavaliers": "#860038",
  "Dallas Mavericks": "#00538C",
  "Denver Nuggets": "#0E2240",
  "Detroit Pistons": "#C8102E",
  "Golden State Warriors": "#1D428A",
  "Houston Rockets": "#CE1141",
  "Indiana Pacers": "#002D62",
  "LA Clippers": "#C8102E",
  "Los Angeles Lakers": "#552583",
  "Memphis Grizzlies": "#5D76A9",
  "Miami Heat": "#98002E",
  "Milwaukee Bucks": "#00471B",
  "Minnesota Timberwolves": "#0C2340",
  "New Orleans Pelicans": "#0C2340",
  "New York Knicks": "#006BB6",
  "Oklahoma City Thunder": "#007AC1",
  "Orlando Magic": "#0077C0",
  "Philadelphia 76ers": "#006BB6",
  "Phoenix Suns": "#1D1160",
  "Portland Trail Blazers": "#E03A3E",
  "Sacramento Kings": "#5A2D81",
  "San Antonio Spurs": "#C4CED4",
  "Toronto Raptors": "#CE1141",
  "Utah Jazz": "#002B5C",
  "Washington Wizards": "#002B5C",
};

// Returns team color, fallback navy
function getTeamColor(teamName) {
  return TEAM_COLORS[teamName]
    || "#1a2233";
}

// Builds location display string
function getLocationDisplay(team) {
  if (team.origin && team.destination)
    return `${team.origin} → ${team.destination}`;
  if (team.origin) return team.origin;
  if (team.destination)
    return team.destination;
  return 'Location unknown';
}

function TeamCard({ team }) {
  const navigate = useNavigate();
  const [loading, setLoading] =
    useState(false);
  const { isFavorite, toggle } =
    useFavorites();

  const isLive =
    team.status === 'ACTIVE';
  const isFav =
    isFavorite(team.callsign);
  // Get team's primary color
  const headerColor =
    getTeamColor(team.team);

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const response =
        await teamService.checkStatus(
          team.callsign
        );
      const statusData =
        response[team.callsign];
      if (statusData?.raw) {
        navigate(
          `/flight/${team.callsign}`,
          {
            state: {
              flightData: statusData
            }
          }
        );
      } else {
        navigate(
          `/flight/${team.callsign}`
        );
      }
    } catch {
      navigate(
        `/flight/${team.callsign}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracking = async () => {
    if (!team.team) {
      return;
    }

    try {
      const trackedItems = await trackingService.getTracking();
      const alreadyTracked = Array.isArray(trackedItems) && trackedItems.some(
        item => (
          item?.team && item.team.toLowerCase() === team.team.toLowerCase()
        ) || (
          item?.callsign && team.callsign && item.callsign.toLowerCase() === team.callsign.toLowerCase()
        )
      );

      if (alreadyTracked) {
        alert(`Team is already tracked: ${team.team} (${team.callsign})`);
        return;
      }

      await trackingService.addTracking({
        team: team.team,
        callsign: team.callsign,
        notificationEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      alert(`Added to tracking: ${team.team} (${team.callsign})`);
    } catch {
      alert('Failed to add team to tracking.');
    }
  };

  return (
    <div
      className="team-card"
      style={{ position: 'relative' }}
    >
      <div
        className={`status-dot ${
          isLive ? 'live' : 'offline'
        }`}
        title={
          isLive ? 'Live' : 'Not flying'
        }
      />

      <button
        onClick={() =>
          toggle(team.callsign)
        }
        aria-label={
          isFav
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
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
          filter: isFav
            ? 'none'
            : 'grayscale(1) opacity(0.45)',
        }}
        onMouseEnter={e =>
          e.currentTarget.style.transform
            = 'scale(1.25)'
        }
        onMouseLeave={e =>
          e.currentTarget.style.transform
            = 'scale(1)'
        }
      >
        ⭐
      </button>

      {/* TEAM-COLORED HEADER BAR */}
      <div
        className="card-header"
        style={{
          paddingRight: 36,
          backgroundColor: headerColor,
        }}
      >
        <h3 className="card-team-name">
          {team.team}
        </h3>
        <span className="category-badge">
          {team.category}
        </span>
      </div>

      {team.callsign && (
        <div style={{
          padding: '6px 16px 0',
          fontSize: 12,
          color: '#8a98a8',
          fontFamily: 'monospace',
        }}>
          {team.callsign}
        </div>
      )}

      <div className="card-body">
        <div className="card-location">
          <span className="location-icon">
            {isLive ? '✈️' : '📍'}
          </span>
          <div>
            <span className="location-label">
              {isLive
                ? 'In Flight'
                : 'Location'}
            </span>
            <span className="location-value">
              {getLocationDisplay(team)}
            </span>
          </div>
        </div>
        <FlightStatus
          status={team.status}
        />
      </div>

      <div className="card-actions">
        <button
          className="btn btn-primary"
          onClick={handleCheckStatus}
          disabled={loading}
        >
          {loading
            ? 'Loading…'
            : 'Show Details'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleAddToTracking}
        >
          + Track
        </button>
      </div>
    </div>
  );
}

export default TeamCard;