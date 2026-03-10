import React, { useEffect, useState } from 'react';
import FlightSearch from '../components/flight/FlightSearch';
import TeamList from '../components/flight/TeamList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApp } from '../context/AppContext';
import teamService from '../services/teamService';
import { mockTeams, searchTeams } from '../utils/mockData';
import '../styles/Flight.css';

// Toggle to false once backend /api/teams is live
const USE_MOCK = false;

// Sort options
const SORT_OPTIONS = [
  { value: 'active',  label: 'Active First'  },
  { value: 'recent',  label: 'Least Recent'  },
  { value: 'az',      label: 'A → Z'         },
  { value: 'za',      label: 'Z → A'         },
];

// Status priority: ACTIVE ranks first
const STATUS_RANK = { ACTIVE: 0, LANDED: 1, UNKNOWN: 2 };

function sortTeams(teams, mode) {
  const copy = [...teams];
  if (mode === 'active') {
    // ACTIVE first, then by name within each group
    return copy.sort((a, b) => {
      const ra = STATUS_RANK[a.status] ?? 2;
      const rb = STATUS_RANK[b.status] ?? 2;
      if (ra !== rb) return ra - rb;
      return a.team.localeCompare(b.team);
    });
  }
  if (mode === 'recent') {
    // ACTIVE last — reverse of active-first (least recently flying = LANDED first)
    return copy.sort((a, b) => {
      const ra = STATUS_RANK[a.status] ?? 2;
      const rb = STATUS_RANK[b.status] ?? 2;
      return rb - ra;
    });
  }
  if (mode === 'az') return copy.sort((a, b) => a.team.localeCompare(b.team));
  if (mode === 'za') return copy.sort((a, b) => b.team.localeCompare(a.team));
  return copy;
}

function SearchPage() {
  const {
    loading, setLoading,
    error, setError, clearError,
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
  } = useApp();

  const [sortMode, setSortMode]       = useState('active');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load all teams on first visit
  useEffect(() => {
    if (searchResults === null) {
      USE_MOCK ? setSearchResults(mockTeams) : fetchAllTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllTeams = async () => {
    setLoading(true);
    clearError();
    try {
      const teams = await teamService.getAllTeams();
      setSearchResults(teams);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
      setSearchResults(mockTeams); // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setLoading(true);
    clearError();
    try {
      let results;
      if (USE_MOCK) {
        await new Promise(res => setTimeout(res, 400));
        results = searchTeams(query);
      } else {
        const allTeams = await teamService.getAllTeams();
        if (!query) {
          results = allTeams;
        } else {
          const q = query.toLowerCase();
          results = allTeams.filter(t =>
            t.team.toLowerCase().includes(q)     ||
            t.category.toLowerCase().includes(q) ||
            t.callsign.toLowerCase().includes(q) ||
            t.status.toLowerCase().includes(q)
          );
        }
      }
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search teams. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply sort to current results
  const displayTeams = sortTeams(searchResults || [], sortMode);
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortMode)?.label;

  return (
    <div className="search-page">
      <h1>Search Teams</h1>
      <FlightSearch onSearch={handleSearch} initialValue={searchTerm} />

      {error && <ErrorMessage message={error} onRetry={() => handleSearch(searchTerm)} />}

      {/* ── Sort control ── */}
      {!loading && displayTeams.length > 0 && (
        <div style={S.sortBar}>
          <span style={S.resultCount}>
            {displayTeams.length} team{displayTeams.length !== 1 ? 's' : ''}{searchTerm ? ` for "${searchTerm}"` : ''}
          </span>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              style={S.sortBtn}
              onClick={() => setShowSortMenu(p => !p)}
            >
              {/* sort icon */}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Sort: {activeSortLabel}
              <span style={{ fontSize: '10px', marginLeft: '2px' }}>▾</span>
            </button>

            {showSortMenu && (
              <div style={S.dropdown}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    style={{
                      ...S.dropdownItem,
                      ...(sortMode === opt.value ? S.dropdownItemActive : {}),
                    }}
                    onClick={() => { setSortMode(opt.value); setShowSortMenu(false); }}
                  >
                    {sortMode === opt.value && <span style={{ marginRight: 6 }}>✓</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Searching teams…" />
      ) : (
        <TeamList teams={displayTeams} searchTerm={searchTerm} />
      )}
    </div>
  );
}

const S = {
  sortBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  resultCount: {
    fontSize: '13px',
    color: 'var(--runway-gray)',
  },
  sortBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#fff',
    border: '1.5px solid var(--cloud-gray)',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px', fontWeight: '600',
    color: 'var(--jet-navy)',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
    background: '#fff',
    border: '1px solid var(--cloud-gray)',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(11,37,69,0.12)',
    zIndex: 100,
    minWidth: '160px',
    overflow: 'hidden',
    padding: '4px',
  },
  dropdownItem: {
    display: 'block', width: '100%', textAlign: 'left',
    background: 'none', border: 'none',
    padding: '9px 14px', fontSize: '13px',
    color: 'var(--charcoal)', cursor: 'pointer',
    borderRadius: '7px',
    fontWeight: '500',
  },
  dropdownItemActive: {
    background: 'var(--off-white)',
    color: 'var(--jet-navy)',
    fontWeight: '700',
  },
};

export default SearchPage;
