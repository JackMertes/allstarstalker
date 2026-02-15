import React from 'react';
import '../../styles/Common.css';
import { STATUS_COLORS } from '../../utils/constants';
import { FlightStatus} from './'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

import { formatDateTime, formatTime, formatAltitude, formatSpeed } from '../../utils/formatters';


function FlightCard({ flight }) {
  const navigate = useNavigate();

  return (
    <div className="flight-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>{flight.flightNumber}</h3>
        <FlightStatus status={flight.status} />
      </div>

      <div className="flight-info">
        <p><strong>Aircraft:</strong> {flight.tailNumber} ({flight.aircraftType})</p>
        <p><strong>Route:</strong> {flight.origin} → {flight.destination}</p>
        <p><strong>Departure:</strong> {formatTime(flight.departureTime)}</p>
        <p><strong>Arrival:</strong> {flight.arrivalTime ? formatTime(flight.arrivalTime) : formatTime(flight.estimatedArrivalTime)} (EST)</p>
        {flight.entityName && (
          <p><strong>Owner:</strong> {flight.entityName} ({flight.entityType})</p>
        )}
        {flight.currentPosition && (
          <p><strong>Current:</strong> {formatAltitude(flight.currentPosition.altitude)}, {formatSpeed(flight.currentPosition.groundSpeed)}</p>
        )}
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => navigate(`/flight/${flight.flightId}`)}
        style={{ marginTop: '12px' }}
      >
        View Details
      </button>
    </div>
  );
}


export default FlightCard;