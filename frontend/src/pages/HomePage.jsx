import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamService from '../services/teamService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TeamCard } from '../components/flight';
import { mockTeams } from '../utils/mockData';
import logo from '../assets/logo.png';

// Toggle to false when backend is ready
const USE_MOCK = false;

// Animated flight path dots floating across the hero
function FlightDots() {
  const dots = [
    { top: '20%', left: '5%',  delay: '0s',    dur: '8s'  },
    { top: '60%', left: '15%', delay: '1.5s',  dur: '10s' },
    { top: '35%', left: '30%', delay: '3s',    dur: '7s'  },
    { top: '75%', left: '50%', delay: '0.8s',  dur: '9s'  },
    { top: '15%', left: '65%', delay: '2.2s',  dur: '6s'  },
    { top: '50%', left: '80%', delay: '4s',    dur: '11s' },
  ];
  return (
    <>
      <style>{`
        @keyframes floatDot {
          0%   { transform: translateX(0) translateY(0) scale(1); opacity: 0.7; }
          50%  { transform: translateX(30px) translateY(-20px) scale(1.4); opacity: 1; }
          100% { transform: translateX(60px) translateY(0) scale(1); opacity: 0.7; }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.3); }
          50%       { box-shadow: 0 0 0 7px rgba(239,68,68,0.1); }
        }
      `}</style>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: d.top, left: d.left,
          width: '5px', height: '5px',
          borderRadius: '50%',
          background: 'rgba(251,191,36,0.55)',
          animation: `floatDot ${d.dur} ease-in-out ${d.delay} infinite`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div style={S.statPill}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <div>
        <div style={S.statValue}>{value}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function FeatureBlock({ icon, title, desc, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ ...S.featureBlock, ...(hov ? S.featureBlockHov : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ ...S.featureBar, background: accent }} />
      <span style={{ fontSize: '28px', marginBottom: '12px', display: 'block' }}>{icon}</span>
      <h3 style={S.featureTitle}>{title}</h3>
      <p style={S.featureDesc}>{desc}</p>
    </div>
  );
}

function HomePage() {
  const [teams, setTeams]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTeams(); }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const all = USE_MOCK
        ? mockTeams.slice(0, 6)
        : (await teamService.getAllTeams()).slice(0, 6);
      setTeams(all);
    } catch (e) {
      console.error('Failed to fetch teams:', e);
      setTeams(mockTeams.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* ── HERO ────────────────────────────────────────────── */}
      <div style={S.hero}>
        <div style={S.grid} />
        <div style={S.ring1} />
        <div style={S.ring2} />
        <FlightDots />

        <div style={S.heroInner}>

          {/* Left: text + CTA */}
          <div style={S.heroLeft}>
            <div style={S.liveBadge}>
              <span style={{
                display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
                background: '#ef4444', marginRight: 8,
                animation: 'pulseRed 1.5s ease-in-out infinite',
              }} />
              LIVE TRACKING
            </div>

            <h1 style={S.heroTitle}>
              Track Every<br />
              <span style={S.titleGold}>Team Flight</span>
            </h1>

            <p style={S.heroSub}>
              Real-time flight data for professional sports teams. Know where your team is, 24/7.
            </p>

            <div style={S.ctaRow}>
              <Link to="/search"   style={S.ctaRed}>Search Teams ✈️</Link>
              <Link to="/tracking" style={S.ctaGhost}>My Tracking</Link>
            </div>

            <div style={S.statsRow}>
              <StatPill icon="🏀" value="1"     label="League"   />
              <StatPill icon="✈️" value="28"  label="Teams"    />
              <StatPill icon="📍" value="Live"  label="Tracking" />
            </div>
          </div>

          {/* Right: logo */}
          <div style={S.heroRight}>
            <div style={S.glowRing}>
              <img src={logo} alt="All Star Stalker" style={S.heroLogo} />
            </div>
            <span style={S.logoCaption}>ALL STAR STALKER</span>
          </div>

        </div>
      </div>

      {/* ── LEAGUE TICKER ─────────────────────────────────── */}
      <div style={S.ticker}>
        {['NBA','REAL-TIME FLIGHT DATA','NBA','REAL-TIME FLIGHT DATA','NBA','REAL-TIME FLIGHT DATA'].map((t, i) => (
          <React.Fragment key={i}>
            <span style={{ letterSpacing: '2px' }}>{t}</span>
            <span style={{ color: '#FBBF24', fontSize: '18px', margin: '0 6px' }}>·</span>
          </React.Fragment>
        ))}
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.eyebrow}>WHAT WE OFFER</div>
        <h2 style={S.sectionTitle}>Everything you need to<br />track team travel</h2>
        <div style={S.featGrid}>
          <FeatureBlock icon="🔍" title="Team Search"        desc="Find any professional team by name, league, or flight callsign."               accent="#1D4ED8" />
          <FeatureBlock icon="📍" title="Real-time Position" desc="Live map positions updated continuously — see exactly where they are."          accent="#C8102E" />
          <FeatureBlock icon="✈️" title="Flight Status"      desc="Instantly know if a team is airborne, at the gate, or already landed."         accent="#FBBF24" />
          <FeatureBlock icon="⭐" title="My Tracking List"   desc="Save favorites and get a personalised dashboard every time you visit."         accent="#22c55e" />
        </div>
      </div>

      {/* ── FEATURED TEAMS ────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.eyebrow}>TEAMS</div>
        <h2 style={S.sectionTitle}>Featured Teams</h2>

        {loading ? (
          <LoadingSpinner message="Loading teams…" />
        ) : teams.length > 0 ? (
          <div style={S.teamsGrid}>
            {teams.map((team, i) => <TeamCard key={team.callsign || i} team={team} />)}
          </div>
        ) : (
          <p style={{ color: 'var(--runway-gray)', textAlign: 'center' }}>No teams available</p>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/search" style={S.viewAll}>View All Teams →</Link>
        </div>
      </div>

    </div>
  );
}

/* ── Style map ──────────────────────────────────────────────── */
const S = {
  hero: {
    background: 'linear-gradient(135deg, #04091a 0%, #0B2545 50%, #0e3068 100%)',
    borderRadius: '16px',
    padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 56px)',
    marginBottom: 0,
    position: 'relative',
    overflow: 'hidden',
    minHeight: '460px',
    display: 'flex',
    alignItems: 'center',
  },
  grid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
      'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '52px 52px',
  },
  ring1: {
    position: 'absolute', borderRadius: '50%',
    width: '520px', height: '520px',
    border: '1px solid rgba(251,191,36,0.07)',
    top: '50%', right: '-100px',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  ring2: {
    position: 'absolute', borderRadius: '50%',
    width: '340px', height: '340px',
    border: '1px solid rgba(251,191,36,0.13)',
    top: '50%', right: '-10px',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  heroInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', gap: '40px', zIndex: 1, position: 'relative', flexWrap: 'wrap',
  },
  heroLeft:  { flex: 1, minWidth: '280px' },
  heroRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },

  liveBadge: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(200,16,46,0.18)',
    border: '1px solid rgba(200,16,46,0.45)',
    color: '#ff8093',
    padding: '5px 14px', borderRadius: '100px',
    fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
    marginBottom: '20px',
  },
  heroTitle: {
    fontSize: 'clamp(30px, 5vw, 52px)',
    fontWeight: '900', color: '#fff',
    lineHeight: '1.05', marginBottom: '16px', letterSpacing: '-0.8px',
  },
  titleGold: { color: '#FBBF24' },
  heroSub: {
    fontSize: '15px', color: 'rgba(255,255,255,0.60)',
    lineHeight: '1.65', marginBottom: '30px', maxWidth: '400px',
  },
  ctaRow: { display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' },
  ctaRed: {
    background: '#C8102E', color: '#fff',
    padding: '13px 26px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: '700', fontSize: '14px',
    boxShadow: '0 4px 18px rgba(200,16,46,0.4)', letterSpacing: '0.3px',
  },
  ctaGhost: {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.2)',
    color: '#fff', padding: '13px 26px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: '700', fontSize: '14px',
  },
  statsRow: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
  statPill: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '10px', padding: '10px 16px',
  },
  statValue: { color: '#fff', fontWeight: '700', fontSize: '15px', lineHeight: 1 },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px', letterSpacing: '0.4px' },

  glowRing: {
    width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    border: '1px solid rgba(251,191,36,0.18)',
    boxShadow: '0 0 60px rgba(251,191,36,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  heroLogo: {
    width: '165px', height: '165px', objectFit: 'contain',
    filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.5))',
  },
  logoCaption: {
    color: 'rgba(255,255,255,0.25)', fontSize: '10px',
    letterSpacing: '3px', fontWeight: '700',
  },

  ticker: {
    background: '#0B2545',
    color: 'rgba(255,255,255,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexWrap: 'wrap', gap: '0',
    padding: '12px 24px',
    fontSize: '11px', fontWeight: '700', letterSpacing: '2px',
    borderRadius: '0 0 14px 14px', marginBottom: '56px',
  },

  section: { marginBottom: '60px' },
  eyebrow: {
    fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px',
    color: '#C8102E', marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '800',
    color: '#0B2545', marginBottom: '28px',
    lineHeight: '1.2', letterSpacing: '-0.4px',
  },

  featGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '18px',
  },
  featureBlock: {
    background: '#fff', borderRadius: '12px', padding: '26px 22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 4px rgba(11,37,69,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative', overflow: 'hidden', cursor: 'default',
  },
  featureBlockHov: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(11,37,69,0.12)',
  },
  featureBar: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
  },
  featureTitle: {
    fontSize: '15px', fontWeight: '700', color: '#0B2545', marginBottom: '7px',
  },
  featureDesc: {
    fontSize: '13px', color: '#6B7280', lineHeight: '1.6',
  },

  teamsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '16px',
  },

  viewAll: {
    display: 'inline-block',
    padding: '11px 26px',
    border: '1.5px solid #0B2545',
    borderRadius: '8px',
    color: '#0B2545', textDecoration: 'none',
    fontWeight: '700', fontSize: '14px',
    transition: 'all 0.2s',
  },
};

export default HomePage;
