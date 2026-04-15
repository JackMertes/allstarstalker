import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // for navigating to flight details page
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import teamService from '../../services/teamService';
import { getTeamColor } from '../../constants/teamColors'; // reuse Akhil's team color lookup

// All 28 NBA teams with their callsigns (matches database/teams.json)
const ALL_TEAMS = [
  { team: 'Atlanta Hawks',           callsign: 'DAL8918' },
  { team: 'Boston Celtics',          callsign: 'DAL8919' },
  { team: 'Brooklyn Nets',           callsign: 'DAL8920' },
  { team: 'Charlotte Hornets',       callsign: 'DAL8921' },
  { team: 'Chicago Bulls',           callsign: 'DAL8922' },
  { team: 'Cleveland Cavaliers',     callsign: 'DAL8923' },
  { team: 'Denver Nuggets',          callsign: 'DAL8924' },
  { team: 'Detroit Pistons',         callsign: 'DAL8925' },
  { team: 'Golden State Warriors',   callsign: 'DAL8926' },
  { team: 'Indiana Pacers',          callsign: 'DAL8927' },
  { team: 'Los Angeles Clippers',    callsign: 'DAL8928' },
  { team: 'Los Angeles Lakers',      callsign: 'DAL8929' },
  { team: 'Memphis Grizzlies',       callsign: 'DAL8930' },
  { team: 'Miami Heat',              callsign: 'DAL8931' },
  { team: 'Milwaukee Bucks',         callsign: 'DAL8932' },
  { team: 'Minnesota Timberwolves',  callsign: 'DAL8933' },
  { team: 'New Orleans Pelicans',    callsign: 'DAL8934' },
  { team: 'New York Knicks',         callsign: 'DAL8935' },
  { team: 'Oklahoma City Thunder',   callsign: 'DAL8936' },
  { team: 'Orlando Magic',           callsign: 'DAL8937' },
  { team: 'Philadelphia 76ers',      callsign: 'DAL8938' },
  { team: 'Phoenix Suns',            callsign: 'DAL8939' },
  { team: 'Portland Trail Blazers',  callsign: 'DAL8940' },
  { team: 'Sacramento Kings',        callsign: 'DAL8941' },
  { team: 'San Antonio Spurs',       callsign: 'DAL8942' },
  { team: 'Toronto Raptors',         callsign: 'DAL8943' },
  { team: 'Utah Jazz',               callsign: 'DAL8944' },
  { team: 'Washington Wizards',      callsign: 'DAL8945' },
];

// Plane colored by team primary color, with a green dot (live) or red dot (last known) overlaid
const planeIcon = (color, isLive, track) => new L.DivIcon({
  html: `
    <div style="position: relative; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center;">
      <div style="transform: rotate(${track || 0}deg); display: flex; justify-content: center; align-items: center;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="${color}"
          xmlns="http://www.w3.org/2000/svg"
          style="filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.4));">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      <div style="
        position: absolute; top: 2px; right: 2px;
        width: 9px; height: 9px; border-radius: 50%;
        background: ${isLive ? '#22c55e' : '#94a3b8'};
        border: 1.5px solid white;
        box-shadow: ${isLive ? '0 0 6px 2px #22c55e' : 'none'};">
      </div>
    </div>`,
  className: 'custom-airplane-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapBehavior({ interactive, onMapClick }) {
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
  });

  return null;
}

function AllTeamsMap() {
  const [teamPositions, setTeamPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);
  const [mapInteractive, setMapInteractive] = useState(false);

  useEffect(() => {
    fetchAllPositions();
  }, []);

  // Fetch status for all 28 teams in parallel, collect those with position data
  const fetchAllPositions = async () => {
    setLoading(true);
    const results = await Promise.allSettled(
      ALL_TEAMS.map(async (t) => {
        const res = await teamService.checkStatus(t.callsign);
        return { meta: t, data: res[t.callsign] };
      })
    );

    const positions = [];
    let live = 0;

    results.forEach((result) => {
      if (result.status !== 'fulfilled') return;
      const { meta, data } = result.value;
      if (!data?.raw?.ac?.[0]) return; // skip teams with no position data

      const ac = data.raw.ac[0];
      if (!ac.lat || !ac.lon) return;

      positions.push({
        team:     meta.team,
        callsign: meta.callsign,
        isLive:   data.is_flying,
        lat:      ac.lat,
        lon:      ac.lon,
        track:    ac.track || 0,
        lastSeen: data.last_seen,
        flight:   ac.flight?.trim() || meta.callsign,
      });

      if (data.is_flying) live++;
    });

    setTeamPositions(positions);
    setLiveCount(live);
    setLoading(false);
  };

  return (
    <div style={S.wrapper}>

      {/* Section header with live/not-live indicator */}
      <div style={S.header}>
        <div style={S.eyebrow}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: liveCount > 0 ? '#22c55e' : '#ef4444',
            marginRight: 8, flexShrink: 0,
            animation: liveCount > 0 ? 'pulseGreen 1.5s ease-in-out infinite' : 'pulseRed 1.5s ease-in-out infinite',
          }} />
          {liveCount > 0 ? `LIVE — ${liveCount} IN FLIGHT` : 'ALL TEAMS — LAST KNOWN POSITION'}
        </div>
        <h2 style={S.title}>League Flight Map</h2>
        <p style={S.subtitle}>
          All 28 NBA teams • {liveCount > 0 ? `${liveCount} currently airborne` : 'No teams airborne right now'} •{' '}
          Planes are team colors •{' '}
          <span style={{ color: '#22c55e', fontWeight: 600 }}>● Airborne</span>{' '}
          <span style={{ color: '#94a3b8', fontWeight: 600, marginLeft: 8 }}>● Last Known</span>
        </p>
      </div>

      {/* Map container */}
      <div style={S.mapWrap}>
        {loading ? (
          // Simple loading state while fetching all 28 statuses
          <div style={S.loadingBox}>
            <span style={{ fontSize: 32, marginBottom: 12, display: 'block' }}>✈️</span>
            <p style={{ color: '#5a6a7e', margin: 0 }}>Loading all team positions…</p>
          </div>
        ) : (
          <>
            {!mapInteractive && (
              <button
                type="button"
                style={S.mapInteractionHint}
                onClick={() => setMapInteractive(true)}
              >
                Click map to enable zoom
              </button>
            )}
            <MapContainer
              center={[38, -96]}
              zoom={4}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBehavior
                interactive={mapInteractive}
                onMapClick={() => setMapInteractive(true)}
              />

              {/* One marker per team that has position data */}
              {teamPositions.map((tp) => (
                <Marker
                  key={tp.callsign}
                  position={[tp.lat, tp.lon]}
                  icon={planeIcon(getTeamColor(tp.team), tp.isLive, tp.track)}
                >
                  <Popup>
                    <div style={{ minWidth: 160 }}>
                      {/* Clicking the team name goes to the full flight details page */}
                      <Link
                        to={`/flight/${tp.callsign}`}
                        style={{ fontSize: 14, fontWeight: 700, color: '#1a73e8', textDecoration: 'none' }}
                      >
                        {tp.team} →
                      </Link>
                      <br />
                      <span style={{
                        display: 'inline-block', marginTop: 4,
                        background: tp.isLive ? '#2ecc71' : '#e67e22',
                        color: 'white', padding: '2px 8px', borderRadius: 4,
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {tp.isLive ? 'LIVE' : 'LAST KNOWN'}
                      </span>
                      <br />
                      <span style={{ fontSize: 12, color: '#555', marginTop: 4, display: 'block' }}>
                        {tp.flight}
                      </span>
                      {tp.lastSeen && (
                        <span style={{ fontSize: 11, color: '#888' }}>
                          {new Date(tp.lastSeen).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </>
        )}
      </div>

      {/* Footer note */}
      {!loading && teamPositions.length < ALL_TEAMS.length && (
        <p style={S.note}>
          {ALL_TEAMS.length - teamPositions.length} team{ALL_TEAMS.length - teamPositions.length !== 1 ? 's' : ''} have no position data yet.
        </p>
      )}
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────────*/
const S = {
  wrapper: {
    margin: '0 0 48px',
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: '3px',
    color: '#FBBF24', textTransform: 'uppercase',
    marginBottom: 8, display: 'flex', alignItems: 'center',
  },
  title: {
    fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 800,
    margin: '0 0 8px', lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14, color: '#5a6a7e', margin: 0,
  },
  mapWrap: {
    height: 420,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    position: 'relative',
  },
  mapInteractionHint: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 1000,
    border: 'none',
    borderRadius: 999,
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
    background: 'rgba(255,255,255,0.92)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    cursor: 'pointer',
  },
  loadingBox: {
    height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#f8fafc',
  },
  note: {
    marginTop: 8, fontSize: 12, color: '#8a98a8', textAlign: 'right',
  },
};

export default AllTeamsMap;
