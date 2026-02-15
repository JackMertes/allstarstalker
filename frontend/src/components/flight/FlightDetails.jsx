import React from 'react';
import { formatDateTime, formatAltitude, formatSpeed } from '../../utils/formatters';
import FlightStatus from './FlightStatus';
import '../../styles/Flight.css';

function FlightDetails({ flight }) {
  if (!flight) {
    return <div>No flight data available</div>;
  }

  return (
    <div className="flight-details">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Flight {flight.flightNumber}</h1>
        <FlightStatus status={flight.status} />
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <strong>Aircraft</strong>
          <span>{flight.tailNumber}</span>
        </div>
        <div className="detail-item">
          <strong>Aircraft Type</strong>
          <span>{flight.aircraftType}</span>
        </div>
        <div className="detail-item">
          <strong>Origin</strong>
          <span>{flight.origin} - {flight.originName}</span>
        </div>
        <div className="detail-item">
          <strong>Destination</strong>
          <span>{flight.destination} - {flight.destinationName}</span>
        </div>
        <div className="detail-item">
          <strong>Departure Time</strong>
          <span>{formatDateTime(flight.departureTime)}</span>
        </div>
        <div className="detail-item">
          <strong>Arrival Time</strong>
          <span>
            {flight.arrivalTime
              ? formatDateTime(flight.arrivalTime)
              : `${formatDateTime(flight.estimatedArrivalTime)} (EST)`
            }
          </span>
        </div>
        {flight.entityName && (
          <>
            <div className="detail-item">
              <strong>Owner/Operator</strong>
              <span>{flight.entityName}</span>
            </div>
            <div className="detail-item">
              <strong>Entity Type</strong>
              <span>{flight.entityType}</span>
            </div>
          </>
        )}
      </div>

      {flight.currentPosition && (
        <div style={{ marginTop: '32px', background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>Current Position</h2>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Latitude</strong>
              <span>{flight.currentPosition.latitude.toFixed(4)}°</span>
            </div>
            <div className="detail-item">
              <strong>Longitude</strong>
              <span>{flight.currentPosition.longitude.toFixed(4)}°</span>
            </div>
            <div className="detail-item">
              <strong>Altitude</strong>
              <span>{formatAltitude(flight.currentPosition.altitude)}</span>
            </div>
            <div className="detail-item">
              <strong>Ground Speed</strong>
              <span>{formatSpeed(flight.currentPosition.groundSpeed)}</span>
            </div>
            <div className="detail-item">
              <strong>Heading</strong>
              <span>{flight.currentPosition.heading}°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDetails;