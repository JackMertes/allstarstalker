import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatAltitude, formatSpeed } from '../../utils/formatters';
import '../../styles/Flight.css';

/**
 * Custom Airplane Icon with rotation based on aircraft track
 */
const airplaneIcon = (track) => new L.DivIcon({
  html: `
    <div style="transform: rotate(${track || 0}deg); transition: transform 0.8s ease-in-out; display: flex; justify-content: center; align-items: center;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#1a73e8" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.3));">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>`,
  className: 'custom-airplane-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FlightDetails({ flightData }) {
  if (!flightData || !flightData.raw || !flightData.raw.ac || flightData.raw.ac.length === 0) {
    return <div>No flight data available</div>;
  }

  const aircraft = flightData.raw.ac[0];
  const position = [aircraft.lat, aircraft.lon];

  return (
    <div className="flight-details">
      {/* Header Section */}
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

      {/* Live Map Section */}
      <h2 style={{ marginTop: '32px' }}>Live Flight Map</h2>
      <div style={{ 
        height: '350px', 
        width: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '32px',
        border: '1px solid #ddd'
      }}>
        <MapContainer 
          center={position} 
          zoom={6} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%',zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={airplaneIcon(aircraft.track)}>
            <Popup>
              <strong>{flightData.callsign}</strong><br />
              {aircraft.desc || 'Aircraft'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Flight Information Section (All original fields restored) */}
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

      {/* Current Position Section (All original fields restored) */}
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

      {/* Footer Timestamp */}
      <div style={{ marginTop: '16px', padding: '16px', background: '#e8f4f8', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#2c3e50' }}>
          <strong>Last Updated:</strong> {new Date(flightData.last_seen).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default FlightDetails;