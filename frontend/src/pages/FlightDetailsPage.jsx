import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlightDetails from '../components/flight/FlightDetails';
import AircraftDetails from '../components/aircraft/AircraftDetails';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import flightService from '../services/flightService';
import { getFlightById, mockAircraft } from '../utils/mockData';

// ─── Toggle this to false once the backend /flights/:id endpoint is live ──────
const USE_MOCK = true;

function FlightDetailsPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [aircraft, setAircraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlight = async () => {
      setLoading(true);
      setError(null);

      try {
        let flightData;
        if (USE_MOCK) {
          // Simulate network delay
          await new Promise(res => setTimeout(res, 300));
          flightData = getFlightById(flightId);

          // Resolve aircraft from mock data
          if (flightData) {
            const matchedAircraft = mockAircraft.find(
              a => a.aircraftId === flightData.aircraftId
            );
            setAircraft(matchedAircraft || null);
          }
        } else {
          // Real API call - GET /api/flights/:id
          flightData = await flightService.getFlightById(flightId);

          // Optionally fetch aircraft details separately if the response doesn't embed them
          // const aircraftData = await aircraftService.getById(flightData.aircraftId);
          // setAircraft(aircraftData);
        }

        setFlight(flightData || null);
      } catch (err) {
        setError('Could not load flight details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId]);

  if (loading) {
    return <LoadingSpinner message="Loading flight details..." />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <ErrorMessage message={error} />
        <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '16px' }}>
          Back to Search
        </button>
      </div>
    );
  }

  if (!flight) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Flight not found</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
          The flight you're looking for doesn't exist or may have been removed.
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

      <FlightDetails flight={flight} />
      <AircraftDetails aircraft={aircraft} />
    </div>
  );
}

export default FlightDetailsPage;
