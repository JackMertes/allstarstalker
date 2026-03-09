
import '../../styles/Common.css';
import { STATUS_COLORS } from '../../utils/constants';
import { FlightStatus} from '.'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

import { formatDateTime, formatTime, formatAltitude, formatSpeed } from '../../utils/formatters';

import React, { useState } from 'react';
import teamService from '../../services/teamService';
import { getFlightStatus } from '../../utils/mockData';
import '../../styles/Flight.css';

// Toggle to false when backend is ready
const USE_MOCK = true;

function TeamCard({ team }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      let statusData;
      
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));
        statusData = getFlightStatus(team.callsign);
      } else {
        // Real API call
        const response = await teamService.checkStatus(team.callsign);
        // API returns an object with callsign as key
        statusData = response[team.callsign];
      }
      console.log('Status data for', team.callsign, ':', statusData);

      if (statusData && statusData.is_flying) {
        // Navigate to flight details page
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
        // Simulate success
        await new Promise(res => setTimeout(res, 300));
        alert(`${team.team} added to tracking!`);
      } else {
        // Real API call
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
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>{team.team}</h3>
        <span style={{ 
          backgroundColor: '#3498db', 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {team.category}
        </span>
      </div>

      <div className="flight-info">
        <p><strong>Callsign:</strong> {team.callsign}</p>
      </div>
      <FlightStatus status={team.status} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          className="btn btn-primary"
          onClick={handleCheckStatus}
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleAddToTracking}
          style={{ flex: 1 }}
        >
          Add to Tracking
        </button>
      </div>
    </div>
  );
}

export default TeamCard;