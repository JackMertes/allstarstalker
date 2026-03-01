import React from 'react';

/**
 * AircraftDetails - displays details about the aircraft associated with a flight.
 *
 * Props:
 *   aircraft - object with tailNumber, aircraftType, manufacturer, and entities[]
 */
const AircraftDetails = ({ aircraft }) => {
  if (!aircraft) return null;

  return (
    <div style={{ marginTop: '32px', background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Aircraft</h2>
      <div className="details-grid">
        <div className="detail-item">
          <strong>Tail Number</strong>
          <span>{aircraft.tailNumber}</span>
        </div>
        <div className="detail-item">
          <strong>Aircraft Type</strong>
          <span>{aircraft.aircraftType || aircraft.type}</span>
        </div>
        {aircraft.manufacturer && (
          <div className="detail-item">
            <strong>Manufacturer</strong>
            <span>{aircraft.manufacturer}</span>
          </div>
        )}
        {aircraft.entities && aircraft.entities.length > 0 && (
          <div className="detail-item">
            <strong>Associated With</strong>
            <span>
              {aircraft.entities.map(e => `${e.name} (${e.type})`).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AircraftDetails;
