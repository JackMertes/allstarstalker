import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TeamGridSkeleton } from '../components/common/TeamCardSkeleton';
import { TeamCard } from '../components/flight';
import { mockTeams } from '../utils/mockData';
import { useCountUp } from '../hooks/useCountUp';
import logo from '../assets/logo.png';

const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const USE_MOCK = false;

// ── Animated floating dots on hero ───────────────────────────────────────────
function FlightDots() {
  const dots = [
    { top: '20%', left: '5%',  delay: '0s',   dur: '8s'  },
    { top: '60%', left: '15%', delay: '1.5s', dur: '10s' },
    { top: '35%', left: '30%', delay: '3s',   dur: '7s'  },
    { top: '75%', left: '50%', delay: '0.8s', dur: '9s'  },
    { top: '15%', left: '65%', delay: '2.2s', dur: '6s'  },
    { top: '50%', left: '80%', delay: '4s',   dur: '11s' },
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
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.3); }
          50%       { box-shadow: 0 0 0 7px rgba(34,197,94,0.1); }
        }
        @keyframes floatPlane {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50%       { opacity: 0.5;  transform: translateY(-6px); }
        }
      `}</style>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', top: d.top, left: d.left,
          width: 5, height: 5, borderRadius: '50%',
          background: 'rgba(251,191,36,0.55)',
          animation: `floatDot ${d.dur} ease-in-out ${d.delay} infinite`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

// ── Animated stat pill ────────────────────────────────────────────────────────
function StatPill({ icon, value, label }) {
  const { value: displayed, ref } = useCountUp(value, 1400);
  return (
    <div ref={ref} style={S.statPill}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={S.statValue}>{displayed}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
    </div>
  );
}

// ── Feature block ─────────────────────────────────────────────────────────────
function FeatureBlock({ icon, title, desc, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ ...S.featureBlock, ...(hov ? S.featureBlockHov : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ ...S.featureBar, background: accent }} />
      <span style={{ fontSize: 28, marginBottom: 12, display: 'block' }}>{icon}</span>
      <h3 style={S.featureTitle}>{title}</h3>
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
function HomePage() {
  const [flyingTeams,   setFlyingTeams]   = useState([]);
  const [flyingLoading, setFlyingLoading] = useState(true);

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
        setFlyingTeams(Array.isArray(data) ? data : []);
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
              Real-time flight data for professional sports teams. Know where your team is, 24/7.
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

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.eyebrow}>WHAT WE OFFER</div>
        <h2 style={S.sectionTitle}>Everything you need to<br />track team travel</h2>
        <div style={S.featGrid}>
          <FeatureBlock icon="🔍" title="Team Search"        desc="Find any professional team by name, league, or flight callsign."                    accent="#1D4ED8" />
          <FeatureBlock icon="📍" title="Real-time Position" desc="Live map positions updated continuously — see exactly where they are."               accent="#C8102E" />
          <FeatureBlock icon="✈️" title="Flight Status"      desc="Instantly know if a team is airborne, at the gate, or already landed."              accent="#FBBF24" />
          <FeatureBlock icon="⭐" title="My Tracking List" desc="Save your favourite teams and get a personalised view of their flight status." accent="#22c55e" />
        </div>
      </div>
      {/* ── TEAMS IN THE AIR ─────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.eyebrow}>
          {!flyingLoading && flyingTeams.length > 0
            ? <><LiveDot green /> LIVE NOW</>
            : 'LIVE NOW'
          }
        </div>
        <h2 style={S.sectionTitle}>Teams In The Air</h2>

        {flyingLoading ? (
          <TeamGridSkeleton count={3} />
        ) : flyingTeams.length > 0 ? (
          <>
            <div style={S.teamsGrid}>
              {flyingTeams.map((team, i) => (
                <TeamCard key={team.callsign || i} team={{ ...team, status: 'ACTIVE' }} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/search" style={S.viewAll}>View All Teams →</Link>
            </div>
          </>
        ) : (
          <div style={S.emptyAir}>
            <div style={{ fontSize: 56, animation: 'floatPlane 3s ease-in-out infinite' }}>✈️</div>
            <h3 style={S.emptyTitle}>No teams currently in the air</h3>
            <p style={S.emptyBody}>
              Flight data refreshes every 10 minutes. Check back soon, or browse all teams below.
            </p>
            <Link to="/search" style={S.viewAll}>Browse All Teams →</Link>
          </div>
        )}
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
    background:'#0B2545', padding:'12px 24px',
    display:'flex', alignItems:'center', gap:4,
    overflowX:'auto', whiteSpace:'nowrap',
    fontSize:12, fontWeight:700, letterSpacing:'2px', color:'rgba(255,255,255,0.5)',
    borderRadius:8, margin:'16px 0',
  },
  section:     { margin:'48px 0' },
  eyebrow:     { fontSize:11, fontWeight:700, letterSpacing:'3px', color:'#FBBF24', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center' },
  sectionTitle:{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:800, color:'#0B2545', margin:'0 0 32px', lineHeight:1.2 },
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
