import React from 'react';
import { formatAltitude, formatSpeed } from '../../utils/formatters';
import '../../styles/Flight.css';
import { FlightStatus} from './'

function FlightDetails({ flightData }) {
  if (!flightData || !flightData.raw || !flightData.raw.ac || flightData.raw.ac.length === 0) {
    return <div>No flight data available</div>;
  }
  console.log('Flight data:', flightData);

  const aircraft = flightData.raw.ac[0];

  return (
    <div className="flight-details">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0' }}>{flightData.team}</h1>
        <span style={{ 
          backgroundColor: '#2ecc71', 
          color: 'white', 
          padding: '6px 12px', 
          borderRadius: '4px',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          FLYING
        </span>
      </div>

      <h2>Flight Information</h2>
      <div className="details-grid">
        <div className="detail-item">
          <strong>Callsign</strong>
          <span>{flightData.callsign}</span>
        </div>
        <div className="detail-item">
          <strong>Flight Number</strong>
          <span>{aircraft.flight?.trim() || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <strong>Registration</strong>
          <span>{aircraft.r || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <strong>Aircraft Type</strong>
          <span>{aircraft.t || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <strong>Description</strong>
          <span>{aircraft.desc || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <strong>Owner/Operator</strong>
          <span>{aircraft.ownOp || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <strong>Year</strong>
          <span>{aircraft.year || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <strong>Squawk</strong>
          <span>{aircraft.squawk || 'N/A'}</span>
        </div>
      </div>

      <h2 style={{ marginTop: '32px' }}>Current Position</h2>
      <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
        <div className="details-grid">
          <div className="detail-item">
            <strong>Latitude</strong>
            <span>{aircraft.lat ? aircraft.lat.toFixed(4) + '°' : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Longitude</strong>
            <span>{aircraft.lon ? aircraft.lon.toFixed(4) + '°' : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Altitude (Barometric)</strong>
            <span>{aircraft.alt_baro ? formatAltitude(aircraft.alt_baro) : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Altitude (Geometric)</strong>
            <span>{aircraft.alt_geom ? formatAltitude(aircraft.alt_geom) : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Ground Speed</strong>
            <span>{aircraft.gs ? formatSpeed(aircraft.gs) : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Track/Heading</strong>
            <span>{aircraft.track ? aircraft.track.toFixed(2) + '°' : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Vertical Rate</strong>
            <span>{aircraft.baro_rate ? `${aircraft.baro_rate} ft/min` : 'N/A'}</span>
          </div>
          <div className="detail-item">
            <strong>Last Seen</strong>
            <span>{aircraft.seen ? `${aircraft.seen.toFixed(1)}s ago` : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '16px', background: '#e8f4f8', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#2c3e50' }}>
          <strong>Last Updated:</strong> {new Date(flightData.last_seen).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default FlightDetails;