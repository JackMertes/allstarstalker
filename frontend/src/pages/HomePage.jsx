import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { TeamGridSkeleton } from '../components/common/TeamCardSkeleton';
import { TeamCard } from '../components/flight';
import { mockTeams } from '../utils/mockData';
import { normalizeTeamsFromApi } from '../utils/teamApiMapper';
import AllTeamsMap from '../components/flight/AllTeamsMap'; // all-28-teams map

const USE_MOCK = false;
const BASE     = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// ── Animated flight dots (decorative) ────────────────────────────────────────
function FlightDots() {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} aria-hidden>
      {[
        { cx:'15%', cy:'30%', r:2,   dur:'8s',  dx:120, dy:-40  },
        { cx:'70%', cy:'20%', r:1.5, dur:'11s', dx:-80, dy:60   },
        { cx:'40%', cy:'70%', r:2,   dur:'9s',  dx:100, dy:-30  },
        { cx:'85%', cy:'60%', r:1.5, dur:'13s', dx:-60, dy:-50  },
        { cx:'55%', cy:'45%', r:1,   dur:'7s',  dx:80,  dy:40   },
      ].map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="rgba(251,191,36,0.5)">
          <animateMotion dur={d.dur} repeatCount="indefinite" path={`M0,0 l${d.dx},${d.dy} l${-d.dx},${-d.dy}`} />
        </circle>
      ))}
    </svg>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon, value, label }) {
  return (
    <div style={S.statPill}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={S.statValue}>{value}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
    </div>
  );
}

// ── Feature block ─────────────────────────────────────────────────────────────
function FeatureBlock({ icon, title, desc, accent }) {
  const [hov, setHov] = useState(false);
  const isDark = useDarkMode();
  return (
    <div
      style={{ ...S.featureBlock, ...(hov ? S.featureBlockHov : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ ...S.featureBar, background: accent }} />
      <span style={{ fontSize: 28, marginBottom: 12, display: 'block' }}>{icon}</span>
      <h3 style={{
        ...S.featureTitle,
        color: `${isDark ? 'white' : '#0B2545'} !important`,
      }}>{title}</h3>
      <p style={S.featureDesc}>{desc}</p>
    </div>
  );
}

// ── Live dot ──────────────────────────────────────────────────────────────────
function LiveDot({ green }) {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: green ? '#22c55e' : '#ef4444',
      marginRight: 8, flexShrink: 0,
      animation: green ? 'pulseGreen 1.5s ease-in-out infinite' : 'pulseRed 1.5s ease-in-out infinite',
    }} />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDark;
}

function HomePage() {
  const [flyingTeams,   setFlyingTeams]   = useState([]);
  const [flyingLoading, setFlyingLoading] = useState(true);
  const isDark = useDarkMode();

  useEffect(() => { fetchFlyingTeams(); }, []);

  const fetchFlyingTeams = async () => {
    setFlyingLoading(true);
    try {
      if (USE_MOCK) {
        const flying = mockTeams.filter(t => ['DAL8924', 'DAL8920'].includes(t.callsign));
        setFlyingTeams(flying);
      } else {
        const res = await fetch(`${BASE}/teams/flying`);
        const data = await res.json();
        setFlyingTeams(normalizeTeamsFromApi(Array.isArray(data) ? data : []));
      }
    } catch {
      setFlyingTeams([]);
    } finally {
      setFlyingLoading(false);
    }
  };

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={S.hero}>
        <div style={S.grid} />
        <div style={S.ring1} />
        <div style={S.ring2} />
        <FlightDots />

        <div style={S.heroInner}>
          <div style={S.heroLeft}>
            <div style={S.liveBadge}>
              <LiveDot />
              LIVE TRACKING
            </div>

            <h1 style={S.heroTitle}>
              Track Every<br />
              <span style={S.titleGold}>Team Flight</span>
            </h1>

            <p style={S.heroSub}>
              Real-time flight data for professional basketball teams. Know where your team is, 24/7.
            </p>

            <div style={S.ctaRow}>
              <Link to="/search"   style={S.ctaRed}>Search Teams ✈️</Link>
              <Link to="/tracking" style={S.ctaGhost}>My Tracking</Link>
            </div>

            {/* Animated stat pills */}
            <div style={S.statsRow}>
              <StatPill icon="🏀" value={1}    label="League"   />
              <StatPill icon="✈️" value={28}   label="Teams"    />
              <StatPill icon="📍" value="Live" label="Tracking" />
            </div>
          </div>

          <div style={S.heroRight}>
            <div style={S.glowRing}>
              <img src={logo} alt="All Star Stalker" style={S.heroLogo} />
            </div>
            <span style={S.logoCaption}>ALL STAR STALKER</span>
          </div>
        </div>
      </div>

      {/* ── TICKER ───────────────────────────────────────────── */}
      <div style={S.ticker}>
        {['NBA','REAL-TIME FLIGHT DATA','NBA','REAL-TIME FLIGHT DATA','NBA','REAL-TIME FLIGHT DATA'].map((t, i) => (
          <React.Fragment key={i}>
            <span style={{ letterSpacing: '2px' }}>{t}</span>
            <span style={{ color: '#FBBF24', fontSize: 18, margin: '0 6px' }}>·</span>
          </React.Fragment>
        ))}
      </div>

      {/* ── ALL TEAMS MAP ────────────────────────────────────── */}
      <div style={S.section}>
        <AllTeamsMap />
      </div>

      {/* ── TEAMS IN THE AIR ─────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.eyebrow}>
          {!flyingLoading && flyingTeams.length > 0
            ? <><LiveDot green /> LIVE NOW</>
            : 'LIVE NOW'
          }
        </div>
        <h2 style={{
          ...S.sectionTitle,
          color: `${isDark ? 'white' : '#0B2545'} !important`,
        }}>
          Teams In The Air
        </h2>

        {flyingLoading ? (
          <TeamGridSkeleton count={3} />
        ) : flyingTeams.length > 0 ? (
          <div style={S.teamsGrid}>
            {flyingTeams.map((team, i) => (
              <TeamCard key={team.callsign || i} team={team} />
            ))}
          </div>
        ) : (
          <div style={S.emptyAir}>
            <span style={{ fontSize: 40 }}>🛬</span>
            <p style={{
              ...S.emptyTitle,
              color: `${isDark ? 'white' : '#0B2545'} !important`,
            }}>No teams currently in the air</p>
            <p style={S.emptyBody}>
              Check back soon, or browse all teams below.
            </p>
            <Link to="/search" style={S.viewAll}>Browse All Teams →</Link>
          </div>
        )}
      </div>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.eyebrow}>WHAT WE OFFER</div>
        <h2 style={{
          ...S.sectionTitle,
          color: `${isDark ? 'white' : '#0B2545'} !important`,
        }}>
          Everything you need to<br />track team travel
        </h2>
        <div style={S.featGrid}>
          <FeatureBlock icon="🔍" title="Team Search"        desc="Find any professional basketball team by name, league, or flight callsign."          accent="#1D4ED8" />
          <FeatureBlock icon="📍" title="Real-time Position" desc="Live map positions updated continuously — see exactly where they are."               accent="#C8102E" />
          <FeatureBlock icon="✈️" title="Flight Status"      desc="Instantly know if a team is airborne, at the gate, or already landed."              accent="#FBBF24" />
          <FeatureBlock icon="⭐" title="My Tracking List"   desc="Save your favorite teams and get a personalized view of their flight status."       accent="#22c55e" />
        </div>
      </div>

    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────────*/
const S = {
  hero: {
    background: 'linear-gradient(135deg, #04091a 0%, #0B2545 50%, #0e3068 100%)',
    borderRadius: 16,
    padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,56px)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 460,
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
  ring1: { position:'absolute', borderRadius:'50%', width:520, height:520, border:'1px solid rgba(251,191,36,0.07)', top:'50%', right:-100, transform:'translateY(-50%)', pointerEvents:'none' },
  ring2: { position:'absolute', borderRadius:'50%', width:340, height:340, border:'1px solid rgba(251,191,36,0.13)', top:'50%', right:-10,  transform:'translateY(-50%)', pointerEvents:'none' },
  heroInner: { position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', gap:40, flexWrap:'wrap' },
  heroLeft:  { flex: '1 1 320px' },
  heroRight: { flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:12 },
  liveBadge: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 999, padding: '6px 14px',
    fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#fca5a5', marginBottom: 20,
  },
  heroTitle: { fontSize:'clamp(32px,5vw,52px)', fontWeight:900, color:'white', margin:'0 0 16px', lineHeight:1.1, letterSpacing:'-1px' },
  titleGold: { color: '#FBBF24' },
  heroSub:   { color:'rgba(255,255,255,0.7)', fontSize:'clamp(14px,2vw,17px)', lineHeight:1.6, margin:'0 0 28px', maxWidth:460 },
  ctaRow:    { display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 },
  ctaRed: {
    background: 'linear-gradient(135deg,#C8102E,#a00d25)', color:'white',
    padding:'14px 28px', borderRadius:10, textDecoration:'none', fontWeight:700, fontSize:15,
    boxShadow:'0 4px 16px rgba(200,16,46,0.35)',
  },
  ctaGhost: {
    background:'rgba(255,255,255,0.08)', color:'white', border:'1px solid rgba(255,255,255,0.2)',
    padding:'14px 28px', borderRadius:10, textDecoration:'none', fontWeight:700, fontSize:15,
  },
  statsRow: { display:'flex', gap:20, flexWrap:'wrap' },
  statPill: {
    display:'flex', alignItems:'center', gap:10,
    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:10, padding:'10px 16px',
  },
  statValue: { fontSize:18, fontWeight:800, color:'#FBBF24', lineHeight:1 },
  statLabel: { fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 },
  glowRing: {
    width:180, height:180, borderRadius:'50%',
    background:'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
    border:'2px solid rgba(251,191,36,0.2)', display:'flex', alignItems:'center', justifyContent:'center',
  },
  heroLogo:    { width:130, height:130, objectFit:'contain' },
  logoCaption: { fontSize:10, fontWeight:700, letterSpacing:'3px', color:'rgba(255,255,255,0.35)' },
  ticker: {
    background:'#0B2545',
    color: 'white',
    padding:'12px 24px',
    display:'flex', alignItems:'center', gap:4,
    overflow:'hidden', margin:'20px 0',
    borderRadius:8,
  },
  section:     { margin:'48px 0' },
  eyebrow:     { fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FBBF24', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center' },
  sectionTitle: {
    fontSize: 'clamp(22px,3.5vw,32px)',
    fontWeight: 800,
    margin: '0 0 32px',
    lineHeight: 1.2,
  },
  featGrid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:20 },
  featureBlock:{ background:'white', borderRadius:12, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', border:'1px solid #e8ecf0', position:'relative', overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s' },
  featureBlockHov: { transform:'translateY(-3px)', boxShadow:'0 8px 24px rgba(0,0,0,0.10)' },
  featureBar:  { position:'absolute', top:0, left:0, width:4, height:'100%', borderRadius:'0 0 0 12px' },
  featureTitle:{ fontSize:16, fontWeight:700, color:'#0B2545', margin:'0 0 8px' },
  featureDesc: { fontSize:14, color:'#5a6a7e', lineHeight:1.6, margin:0 },
  teamsGrid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20 },
  viewAll:     { color:'#C8102E', fontWeight:700, textDecoration:'none', fontSize:15, display:'inline-block' },
  emptyAir:    { textAlign:'center', padding:'56px 24px', background:'white', borderRadius:16, border:'2px dashed #e2e8f0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 },
  emptyTitle:  { fontSize:20, fontWeight:700, color:'#0B2545', margin:0 },
  emptyBody:   { color:'#8a98a8', fontSize:15, maxWidth:380, lineHeight:1.6, margin:0 },
};

export default HomePage;
