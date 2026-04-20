import React, { useEffect, useRef, useState } from 'react';
import FlightSearch from '../components/flight/FlightSearch';
import TeamList from '../components/flight/TeamList';
import { TeamGridSkeleton } from '../components/common/TeamCardSkeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApp } from '../context/AppContext';
import teamService from '../services/teamService';
import { mockTeams, searchTeams } from '../utils/mockData';
import { filterTeamsBySearchTerm } from '../utils/teamApiMapper';
import '../styles/Flight.css';

const USE_MOCK = false;

const SORT_OPTIONS = [
  { value: 'active', label: 'Active First' },
  { value: 'recent', label: 'Least Recent' },
  { value: 'az',     label: 'A → Z'        },
  { value: 'za',     label: 'Z → A'        },
];

const STATUS_RANK = { ACTIVE: 0, LANDED: 1, NOT_FLYING: 2, UNKNOWN: 3 };

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

  const [sortMode, setSortMode]         = useState('active');
  const [showSortMenu, setShowSortMenu] = useState(false);
  /** Full list from API (or mock); search filters this without re-fetching */
  const [allTeamsCache, setAllTeamsCache] = useState(null);
  const latestSearchTermRef = useRef(searchTerm);

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
      const latestSearchTerm = latestSearchTermRef.current.trim();
      setAllTeamsCache(teams);
      setSearchResults(
        latestSearchTerm
          ? filterTeamsBySearchTerm(teams, latestSearchTerm)
          : teams
      );
    } catch {
      const latestSearchTerm = latestSearchTermRef.current.trim();
      setError('Could not load teams. Showing local data.');
      setAllTeamsCache(mockTeams);
      setSearchResults(
        latestSearchTerm
          ? filterTeamsBySearchTerm(mockTeams, latestSearchTerm)
          : mockTeams
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    latestSearchTermRef.current = term;
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
    if (!USE_MOCK && allTeamsCache == null) {
      if (!loading) loadTeams();
      return;
    }
    const source = USE_MOCK ? mockTeams : allTeamsCache;
    const filtered = USE_MOCK
      ? searchTeams(term)
      : filterTeamsBySearchTerm(source, term);
    setSearchResults(filtered);
  };

  const sorted = sortTeams(searchResults || [], sortMode);

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

      {/* ── Teams list ── */}
      {!loading && (
        <>
          <TeamList teams={sorted} />
        </>
      )}
    </div>
  );
}

export default SearchPage;
