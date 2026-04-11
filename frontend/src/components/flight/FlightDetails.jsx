import React from 'react';
import {
  MapContainer, TileLayer,
  Marker, Popup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  formatAltitude, formatSpeed
} from '../../utils/formatters';
import '../../styles/Flight.css';

/* Team colors for header */
const TEAM_COLORS = {
  'Atlanta Hawks': '#E03A3E',
  'Boston Celtics': '#007A33',
  'Brooklyn Nets': '#000000',
  'Charlotte Hornets': '#1D1160',
  'Chicago Bulls': '#CE1141',
  'Cleveland Cavaliers': '#860038',
  'Denver Nuggets': '#0E2240',
  'Detroit Pistons': '#C8102E',
  'Golden State Warriors': '#1D428A',
  'Indiana Pacers': '#002D62',
  'LA Clippers': '#C8102E',
  'Los Angeles Lakers': '#552583',
  'Memphis Grizzlies': '#5D76A9',
  'Miami Heat': '#98002E',
  'Milwaukee Bucks': '#00471B',
  'Minnesota Timberwolves': '#0C2340',
  'New Orleans Pelicans': '#0C2340',
  'New York Knicks': '#006BB6',
  'Oklahoma City Thunder': '#007AC1',
  'Orlando Magic': '#0077C0',
  'Philadelphia 76ers': '#006BB6',
  'Phoenix Suns': '#1D1160',
  'Portland Trail Blazers': '#E03A3E',
  'Sacramento Kings': '#5A2D81',
  'San Antonio Spurs': '#C4CED4',
  'Toronto Raptors': '#CE1141',
  'Utah Jazz': '#002B5C',
  'Washington Wizards': '#002B5C',
};

/* Airplane icon with rotation */
const airplaneIcon = (track) =>
  new L.DivIcon({
    html: `<div style="
      transform: rotate(${track || 0}deg);
      transition: transform 0.8s ease;
      display: flex;
      justify-content: center;
      align-items: center;">
      <svg width="32" height="32"
        viewBox="0 0 24 24"
        fill="#1a73e8"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(
        0px 2px 2px rgba(0,0,0,0.3));">
        <path d="M21 16v-2l-8-5V3.5
          c0-.83-.67-1.5-1.5-1.5S10
          2.67 10 3.5V9l-8 5v2l8-2.5
          V19l-2 1.5V22l3.5-1 3.5
          1v-1.5L13 19v-5.5l8
          2.5z"/>
      </svg></div>`,
    className: 'custom-airplane-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

function FlightDetails({ flightData }) {
  /* No data state */
  if (!flightData?.raw?.ac?.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7a8d'
      }}>
        <div style={{
          fontSize: '48px'
        }}>
          ✈️
        </div>
        <h3>No Flight Data Available</h3>
      </div>
    );
  }

  /* Pull out data we need */
  const isFlying = flightData.is_flying;
  const ac = flightData.raw.ac[0];
  const pos = [ac.lat, ac.lon];
  const color =
    TEAM_COLORS[flightData.team]
    || '#0f1b2d';

  return (
    <div className="flight-details">

      {/* Team Color Header */}
      <div style={{
        background: color,
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{
          margin: 0,
          color: '#fff',
          fontSize: '24px'
        }}>
          {flightData.team}
        </h1>
        <span style={{
          background: isFlying
            ? 'rgba(46,204,113,0.9)'
            : 'rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '13px'
        }}>
          {isFlying
            ? '🟢 LIVE — IN FLIGHT'
            : '🛬 NOT FLYING'}
        </span>
      </div>

      {/* Map Section */}
      <h2>
        {isFlying
          ? '🗺️ Live Flight Map'
          : '📍 Last Known Location'}
      </h2>
      <div style={{
        height: '350px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '32px',
        border: '1px solid #ddd'
      }}>
        <MapContainer
          center={pos}
          zoom={6}
          scrollWheelZoom={false}
          style={{
            height: '100%',
            width: '100%',
            zIndex: 1
          }}
        >
          <TileLayer
            attribution={
              '&copy; OpenStreetMap'
            }
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={pos}
            icon={
              airplaneIcon(ac.track)
            }
          >
            <Popup>
              <strong>
                {flightData.callsign}
              </strong>
              <br />
              {ac.desc || 'Aircraft'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Flight Info */}
      <h2>✈️ Flight Information</h2>
      <div className="details-grid">
        <div className="detail-item">
          <strong>
            📡 Callsign
          </strong>
          <span>
            {flightData.callsign}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            ✈️ Flight Number
          </strong>
          <span>
            {ac.flight?.trim()
              || 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            🏷️ Registration
          </strong>
          <span>
            {ac.r || 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            🛩️ Aircraft Type
          </strong>
          <span>
            {ac.t || 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            📋 Description
          </strong>
          <span>
            {ac.desc || 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            🏢 Owner/Operator
          </strong>
          <span>
            {ac.ownOp || 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            📅 Year
          </strong>
          <span>
            {ac.year || 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <strong>
            📻 Squawk
          </strong>
          <span>
            {ac.squawk || 'N/A'}
          </span>
        </div>
      </div>

      {/* Position Info */}
      <h2 style={{ marginTop: '32px' }}>
        {isFlying
          ? '📍 Current Position'
          : '📍 Last Known Position'}
      </h2>
      <div style={{
        background: '#f8f9fa',
        padding: '24px',
        borderRadius: '8px'
      }}>
        <div className="details-grid">
          <div className="detail-item">
            <strong>
              📍 Latitude
            </strong>
            <span>
              {ac.lat
                ? ac.lat.toFixed(4)
                  + '°'
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              🧭 Longitude
            </strong>
            <span>
              {ac.lon
                ? ac.lon.toFixed(4)
                  + '°'
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              ⬆️ Alt (Baro)
            </strong>
            <span>
              {ac.alt_baro
                ? formatAltitude(
                    ac.alt_baro)
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              📐 Alt (Geo)
            </strong>
            <span>
              {ac.alt_geom
                ? formatAltitude(
                    ac.alt_geom)
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              💨 Ground Speed
            </strong>
            <span>
              {ac.gs
                ? formatSpeed(ac.gs)
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              🔄 Track
            </strong>
            <span>
              {ac.track
                ? ac.track.toFixed(2)
                  + '°'
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              📈 Vertical Rate
            </strong>
            <span>
              {ac.baro_rate
                ? `${ac.baro_rate} ft/min`
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <strong>
              🕐 Last Seen
            </strong>
            <span>
              {isFlying && ac.seen
                ? `${ac.seen.toFixed(1)}s ago`
                : flightData.last_seen
                  ? new Date(
                      flightData.last_seen
                    ).toLocaleString()
                  : 'N/A'}
            </span>
          </div>
        </div>
      </div>
            {/* Footer Timestamp */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: isFlying
          ? '#e8f4f8'
          : '#fef3e2',
        borderRadius: '8px'
      }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#2c3e50'
        }}>
          <strong>
            {isFlying
              ? '🕐 Last Updated:'
              : '🕐 Last Seen:'}
          </strong>{' '}
          {flightData.last_seen
            ? new Date(
                flightData.last_seen
              ).toLocaleString()
            : 'Unknown'}
          {!isFlying && (
            <span style={{
              marginLeft: '12px',
              color: '#e67e22',
              fontStyle: 'italic'
            }}>
              (not currently flying)
            </span>
          )}
        </p>
      </div>

    </div>
  );
}

export default FlightDetails;