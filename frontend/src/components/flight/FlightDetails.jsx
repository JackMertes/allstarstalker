import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer, TileLayer,
  Marker, Popup, useMap, useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  formatAltitude, formatSpeed
} from '../../utils/formatters';
import { getTeamColor } from '../../constants/teamColors';
import '../../styles/Flight.css';

/* Airplane icon with rotation */
const airplaneIcon = (track, markerSize = 36) =>
  new L.DivIcon({
    html: `<div style="
      position: relative;
      width: ${markerSize}px;
      height: ${markerSize}px;
      transform: rotate(${track || 0}deg);
      transition: transform 0.8s ease;
      display: flex;
      justify-content: center;
      align-items: center;">
      <div style="
        position:absolute;
        width:${Math.round(markerSize * 0.55)}px;
        height:${Math.round(markerSize * 0.55)}px;
        border-radius:999px;
        background:rgba(26,115,232,0.22);
        box-shadow:0 0 12px rgba(26,115,232,0.45);">
      </div>
      <svg width="${markerSize}" height="${markerSize}"
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
    iconSize: [markerSize, markerSize],
    iconAnchor: [Math.round(markerSize / 2), Math.round(markerSize / 2)],
  });

const getValue = (value) => (
  value === null || value === undefined || value === '' ? 'Unavailable' : value
);

const formatCoordinate = (value) => (
  typeof value === 'number' ? `${value.toFixed(4)}°` : 'Unavailable'
);

const getCompassDirection = (track) => {
  if (typeof track !== 'number') {
    return 'Unavailable';
  }
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round(track / 45) % 8;
  return `${track.toFixed(0)}° ${dirs[i]}`;
};

const decodeAircraftType = (typeCode) => {
  const map = {
    B752: 'Boeing 757-200',
    B753: 'Boeing 757-300',
    B738: 'Boeing 737-800',
    B739: 'Boeing 737-900',
    B77W: 'Boeing 777-300ER',
    A319: 'Airbus A319',
    A320: 'Airbus A320',
    A321: 'Airbus A321'
  };
  return map[typeCode] || getValue(typeCode);
};

const getFreshnessText = (lastSeen) => {
  if (!lastSeen) {
    return 'Updated time unavailable';
  }
  const seenTs = new Date(lastSeen).getTime();
  if (Number.isNaN(seenTs)) {
    return 'Updated time unavailable';
  }
  const diffMs = Date.now() - seenTs;
  if (diffMs < 60000) {
    return 'Updated just now';
  }
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) {
    return `Updated ${diffMin}m ago`;
  }
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) {
    return `Updated ${diffHr}h ago`;
  }
  const diffDay = Math.round(diffHr / 24);
  return `Updated ${diffDay}d ago`;
};

function MapBehavior({ interactive, onMapClick, onZoomChange }) {
  const map = useMap();

  useEffect(() => {
    if (interactive) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [interactive, map]);

  useMapEvents({
    click: () => onMapClick(),
    zoomend: (event) => onZoomChange(event.target.getZoom())
  });

  return null;
}

function FlightDetails({ flightData }) {
  const hasData = !!flightData?.raw?.ac?.length;
  const isFlying = !!flightData?.is_flying;
  const ac = hasData ? flightData.raw.ac[0] : {};
  const pos = [
    typeof ac.lat === 'number' ? ac.lat : 0,
    typeof ac.lon === 'number' ? ac.lon : 0
  ];
  const color = getTeamColor(flightData?.team) || '#0f1b2d';
  const timestamp = flightData?.last_seen
    ? new Date(flightData.last_seen).toLocaleString()
    : 'Unknown';
  const mapTimestamp = flightData?.last_seen
    ? new Date(flightData.last_seen).toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
    : 'Unknown';
  const initialZoom = !isFlying
    ? 6
    : (typeof ac.gs === 'number' && ac.gs > 250 ? 4 : 5);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const aircraftType = decodeAircraftType(ac.t);
  const mapBadgeText = isFlying ? 'Live position' : 'Last known position';
  const freshnessText = getFreshnessText(flightData?.last_seen);
  const markerSize = mapZoom >= 9 ? 46 : mapZoom >= 7 ? 42 : 38;
  const markerIcon = useMemo(
    () => airplaneIcon(ac.track, markerSize),
    [ac.track, markerSize]
  );

  useEffect(() => {
    setMapInteractive(false);
    setMapZoom(initialZoom);
  }, [initialZoom, flightData?.callsign]);

  const quickStats = [
    {
      label: 'Altitude',
      value: typeof ac.alt_baro === 'number'
        ? formatAltitude(ac.alt_baro)
        : 'Unavailable'
    },
    {
      label: 'Ground Speed',
      value: typeof ac.gs === 'number'
        ? formatSpeed(ac.gs)
        : 'Unavailable'
    },
    {
      label: 'Heading',
      value: getCompassDirection(ac.track)
    },
    {
      label: 'Flight Number',
      value: getValue(ac.flight?.trim() || flightData.callsign)
    }
  ];

  if (!hasData) {
    return (
      <div className="flight-empty-state">
        <h3>No flight information available yet</h3>
        <p>This team page is working. We just do not have trackable flight data yet.</p>
      </div>
    );
  }

  return (
    <div className="flight-details">
      <div className="flight-hero" style={{ backgroundColor: color }}>
        <div>
          <p className="flight-hero-label">Team Flight Tracker</p>
          <h1 className="flight-hero-title">{flightData.team}</h1>
        </div>
        <div className="flight-hero-badges">
          <span className={`flight-hero-status ${isFlying ? 'live' : 'grounded'}`}>
            {isFlying ? 'FLYING' : 'NOT FLYING'}
          </span>
        </div>
      </div>

      <section className="flight-section">
        <div className="quick-stats-grid">
          {quickStats.map((stat) => (
            <div key={stat.label} className={`quick-stat-card ${stat.tone || ''}`.trim()}>
              <span className="quick-stat-label">{stat.label}</span>
              <span className="quick-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flight-section">
        <div className="flight-section-header">
          <h2>{isFlying ? 'Live Flight Map' : 'Last Known Location'}</h2>
        </div>
        <div className="flight-map-shell">
          <div className="flight-map-overlay">
            <span>{mapBadgeText}</span>
            <span>{mapTimestamp}</span>
            <span>{freshnessText}</span>
          </div>
          {!mapInteractive && (
            <button
              type="button"
              className="flight-map-interaction-hint"
              onClick={() => setMapInteractive(true)}
            >
              Click map to enable zoom
            </button>
          )}
          <MapContainer
            center={pos}
            zoom={initialZoom}
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
            <MapBehavior
              interactive={mapInteractive}
              onMapClick={() => setMapInteractive(true)}
              onZoomChange={setMapZoom}
            />
            <Marker
              position={pos}
              icon={markerIcon}
            >
              <Popup>
                <strong>
                  {flightData.callsign}
                </strong>
                <br />
                {ac.desc || 'Unavailable'}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>

      <section className="flight-section">
        <div className="flight-section-header">
          <h2>Flight Details</h2>
        </div>
        <h3 className="flight-subsection-title">Aircraft Information</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Flight Number</span>
            <span className="detail-value">{getValue(ac.flight?.trim() || flightData.callsign)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Aircraft</span>
            <span className="detail-value">{aircraftType}</span>
          </div>
        </div>

        <h3 className="flight-subsection-title">
          {isFlying ? 'Current Position' : 'Last Known Position'}
        </h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Latitude</span>
            <span className="detail-value">{formatCoordinate(ac.lat)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Longitude</span>
            <span className="detail-value">{formatCoordinate(ac.lon)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Altitude</span>
            <span className="detail-value">
              {typeof ac.alt_baro === 'number' ? formatAltitude(ac.alt_baro) : 'Unavailable'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Ground Speed</span>
            <span className="detail-value">
              {typeof ac.gs === 'number' ? formatSpeed(ac.gs) : 'Unavailable'}
            </span>
          </div>
        </div>
      </section>

      <div className={`flight-timestamp ${isFlying ? 'live' : 'grounded'}`}>
        <span className="flight-timestamp-label">
          {isFlying ? 'Last Updated' : 'Last Seen'}
        </span>
        <span className="flight-timestamp-value">
          {timestamp}
        </span>
      </div>

    </div>
  );
}

export default FlightDetails;