import React, { useEffect, useState } from 'react';
import FlightSearch from '../components/flight/FlightSearch';
import TeamList from '../components/flight/TeamList';
import { TeamGridSkeleton } from '../components/common/TeamCardSkeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApp } from '../context/AppContext';
import { useFavourites } from '../hooks/useFavourites';
import teamService from '../services/teamService';
import { mockTeams, searchTeams } from '../utils/mockData';
import { TeamCard } from '../components/flight';
import '../styles/Flight.css';

const USE_MOCK = false;

const SORT_OPTIONS = [
  { value: 'active', label: 'Active First' },
  { value: 'recent', label: 'Least Recent' },
  { value: 'az',     label: 'A → Z'        },
  { value: 'za',     label: 'Z → A'        },
];

const STATUS_RANK = { ACTIVE: 0, LANDED: 1, UNKNOWN: 2 };

function sortTeams(teams, mode) {
  const copy = [...teams];
  if (mode === 'active') {
    return copy.sort((a, b) => {
      const ra = STATUS_RANK[a.status] ?? 2;
      const rb = STATUS_RANK[b.status] ?? 2;
      if (ra !== rb) return ra - rb;
      return a.team.localeCompare(b.team);
    });
  }
  if (mode === 'recent') return copy.sort((a, b) => (STATUS_RANK[b.status] ?? 2) - (STATUS_RANK[a.status] ?? 2));
  if (mode === 'az')     return copy.sort((a, b) => a.team.localeCompare(b.team));
  if (mode === 'za')     return copy.sort((a, b) => b.team.localeCompare(a.team));
  return copy;
}

function SearchPage() {
  const {
    loading, setLoading,
    error, setError, clearError,
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
  } = useApp();

  const { isFavourite } = useFavourites();
  const [sortMode, setSortMode]       = useState('active');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load all teams on first visit
  useEffect(() => {
    if (searchResults === null) {
      USE_MOCK
        ? setSearchResults(mockTeams)
        : loadTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    clearError();
    try {
      const data = await teamService.getAllTeams();
      setSearchResults(data?.length ? data : mockTeams);
    } catch {
      setError('Could not load teams. Showing local data.');
      setSearchResults(mockTeams);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      USE_MOCK ? setSearchResults(mockTeams) : loadTeams();
      return;
    }
    const filtered = searchTeams(term);
    setSearchResults(filtered);
  };

  const sorted = sortTeams(searchResults || [], sortMode);

  // Teams the user has starred
  const favouriteTeams = sorted.filter(t => isFavourite(t.callsign));
  const otherTeams     = sorted.filter(t => !isFavourite(t.callsign));

  return (
    <div className="search-page">
      <h1 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, color: 'var(--jet-navy)', marginBottom: 4 }}>
        Search Teams
      </h1>
      <p style={{ color: 'var(--runway-gray)', marginBottom: 24, fontSize: 15 }}>
        Find any NBA team and check their current flight status.
      </p>

      <FlightSearch onSearch={handleSearch} initialValue={searchTerm} />

      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      {/* ── Sort controls ── */}
      {!loading && sorted.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--runway-gray)', fontWeight: 500 }}>
            {sorted.length} team{sorted.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {favouriteTeams.length > 0 && ` · ${favouriteTeams.length} ⭐`}
          </span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortMenu(p => !p)}
              style={{
                background: 'var(--white, white)',
                border: '1px solid var(--cloud-gray, #e5e7eb)',
                borderRadius: 8,
                padding: '7px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--charcoal, #111)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {SORT_OPTIONS.find(o => o.value === sortMode)?.label} ▾
            </button>
            {showSortMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '110%', zIndex: 50,
                background: 'var(--white, white)',
                border: '1px solid var(--cloud-gray, #e5e7eb)',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                minWidth: 140, overflow: 'hidden',
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setSortMode(opt.value); setShowSortMenu(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: 14,
                      fontWeight: sortMode === opt.value ? 700 : 400,
                      background: sortMode === opt.value ? 'var(--off-white, #e5efff)' : 'transparent',
                      color: 'var(--charcoal, #111)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Skeleton while loading ── */}
      {loading && <TeamGridSkeleton count={8} />}

      {/* ── Favourites strip ── */}
      {!loading && favouriteTeams.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', color: '#FBBF24', textTransform: 'uppercase' }}>
              ⭐ FAVOURITES
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#FBBF2440,transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {favouriteTeams.map((team, i) => (
              <TeamCard key={team.callsign || i} team={team} />
            ))}
          </div>
        </div>
      )}

      {/* ── All other teams ── */}
      {!loading && (
        <>
          {favouriteTeams.length > 0 && otherTeams.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', color: 'var(--runway-gray)', textTransform: 'uppercase' }}>
                ALL TEAMS
              </span>
            </div>
          )}
          <TeamList teams={otherTeams} />
        </>
      )}
    </div>
  );
}

export default SearchPage;
