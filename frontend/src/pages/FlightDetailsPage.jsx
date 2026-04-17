import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FlightDetails from '../components/flight/FlightDetails';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import teamService from '../services/teamService';
import { getFlightStatus } from '../utils/mockData';

// Toggle this to false once the backend is live
const USE_MOCK = false;
const isNoDataYetState = (statusData) => {
  if (!statusData) {
    return false;
  }
  const ac = statusData?.raw?.ac;
  return !statusData.is_flying && (!Array.isArray(ac) || ac.length === 0);
};

function FlightDetailsPage() {
  const { flightId } = useParams();
  const callsign = String(flightId || '').trim().toUpperCase();
  const navigate = useNavigate();
  const location = useLocation();

  const [flightData, setFlightData] = useState(location.state?.flightData || null);
  const [loading, setLoading] = useState(!location.state?.flightData);
  const [error, setError] = useState(null);
  const [hasNoDataYet, setHasNoDataYet] = useState(
    isNoDataYetState(location.state?.flightData)
  );

  useEffect(() => {
    // If we don't have flight data from navigation state, fetch it
    if (!flightData) {
      fetchFlightStatus();
      return;
    }
    setHasNoDataYet(isNoDataYetState(flightData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callsign]);

  const fetchFlightStatus = async () => {
    setLoading(true);
    setError(null);
    setHasNoDataYet(false);

    try {
      let statusData;
      if (USE_MOCK) {
        await new Promise(res => setTimeout(res, 300));
        statusData = getFlightStatus(callsign);
      } else {
        const response = await teamService.checkStatus(callsign);
        statusData = response[callsign];
      }

      if (!statusData) {
        setError('Could not load flight data for this team.');
      } else if (isNoDataYetState(statusData)) {
        setFlightData(statusData);
        setHasNoDataYet(true);
      } else {
        setFlightData(statusData);
      }
    } catch (err) {
      console.error('Error fetching flight status:', err);
      setError('Could not load flight details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading flight details..." />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <ErrorMessage message={error} />
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/search')} 
          style={{ marginTop: '16px' }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  if (hasNoDataYet) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '10px', color: '#1a2233' }}>
          No flight information available yet
        </h2>
        <p style={{ color: '#5f6b7a', marginBottom: '10px', lineHeight: 1.6 }}>
          Nothing is wrong with this team page. We just have not collected flight tracking
          data for <strong>{flightData?.team || callsign}</strong> yet.
        </p>
        <p style={{ color: '#5f6b7a', marginBottom: '24px', lineHeight: 1.6 }}>
          Check back later after the next refresh, or pick another team to explore.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>
          Back to Search
        </button>
      </div>
    );
  }

  if (!flightData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Flight not found</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
          No flight data available for this team.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="flight-details-page">
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          background: 'none',
          border: 'none',
          color: '#3498db',
          cursor: 'pointer',
          fontSize: '16px',
          padding: 0,
        }}
      >
        ← Back
      </button>

      <FlightDetails flightData={flightData} />
    </div>
  );
}

export default FlightDetailsPage;