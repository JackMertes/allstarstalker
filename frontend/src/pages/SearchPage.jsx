import React, { useEffect, useState } from 'react';
import FlightSearch from '../components/flight/FlightSearch';
import TeamList from '../components/flight/TeamList';
import { TeamGridSkeleton } from '../components/common/TeamCardSkeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApp } from '../context/AppContext';
import { useFavorites } from '../hooks/useFavorites';
import teamService from '../services/teamService';
import { mockTeams, searchTeams } from '../utils/mockData';
import { filterTeamsBySearchTerm } from '../utils/teamApiMapper';
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

function teamSortKey(t) {
  return (t && t.team) ? String(t.team) : '';
}

function sortTeams(teams, mode) {
  const copy = [...teams];
  if (mode === 'active') {
    return copy.sort((a, b) => {
      const ra = STATUS_RANK[a.status] ?? 2;
      const rb = STATUS_RANK[b.status] ?? 2;
      if (ra !== rb) return ra - rb;
      return teamSortKey(a).localeCompare(teamSortKey(b));
    });
  }
  if (mode === 'recent') return copy.sort((a, b) => (STATUS_RANK[b.status] ?? 2) - (STATUS_RANK[a.status] ?? 2));
  if (mode === 'az')     return copy.sort((a, b) => teamSortKey(a).localeCompare(teamSortKey(b)));
  if (mode === 'za')     return copy.sort((a, b) => teamSortKey(b).localeCompare(teamSortKey(a)));
  return copy;
}

function SearchPage() {
  const {
    loading, setLoading,
    error, setError, clearError,
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
  } = useApp();

  const { isFavorite } = useFavorites();
  const [sortMode, setSortMode]         = useState('active');
  const [showSortMenu, setShowSortMenu] = useState(false);
  /** Full list from API (or mock); search filters this without re-fetching */
  const [allTeamsCache, setAllTeamsCache] = useState(null);

  useEffect(() => {
    if (searchResults === null) {
      if (USE_MOCK) {
        setAllTeamsCache(mockTeams);
        setSearchResults(mockTeams);
      } else {
        loadTeams();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    clearError();
    try {
      const teams = await teamService.getAllTeams();
      setAllTeamsCache(teams);
      setSearchResults(teams);
    } catch {
      setError('Could not load teams. Showing local data.');
      setAllTeamsCache(mockTeams);
      setSearchResults(mockTeams);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      if (USE_MOCK) {
        setSearchResults(mockTeams);
      } else if (allTeamsCache != null) {
        setSearchResults(allTeamsCache);
      } else {
        loadTeams();
      }
      return;
    }
    const source = USE_MOCK ? mockTeams : (allTeamsCache ?? []);
    const filtered = USE_MOCK
      ? searchTeams(term)
      : filterTeamsBySearchTerm(source, term);
    setSearchResults(filtered);
  };

  const sorted = sortTeams(searchResults || [], sortMode);

  // Teams the user has starred
  const favoriteTeams = sorted.filter(t => isFavorite(t.callsign));
  const otherTeams    = sorted.filter(t => !isFavorite(t.callsign));

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
          </span>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortMenu(prev => !prev)}
              style={{
                fontSize: 13, fontWeight: 600, padding: '6px 14px',
                border: '1px solid var(--cloud-gray)', borderRadius: 8,
                background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Sort: {SORT_OPTIONS.find(o => o.value === sortMode)?.label}
              <span style={{ fontSize: 10 }}>▼</span>
            </button>

            {showSortMenu && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 50,
                background: 'white', border: '1px solid var(--cloud-gray)',
                borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                minWidth: 160, overflow: 'hidden',
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortMode(opt.value); setShowSortMenu(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 16px', border: 'none', cursor: 'pointer',
                      fontSize: 14,
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

      {/* ── Favorites strip ── */}
      {!loading && favoriteTeams.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', color: '#FBBF24', textTransform: 'uppercase' }}>
              ⭐ FAVORITES
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#FBBF2440,transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {favoriteTeams.map((team, i) => (
              <TeamCard key={team.callsign || i} team={team} />
            ))}
          </div>
        </div>
      )}

      {/* ── All other teams ── */}
      {!loading && (
        <>
          {favoriteTeams.length > 0 && otherTeams.length > 0 && (
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
