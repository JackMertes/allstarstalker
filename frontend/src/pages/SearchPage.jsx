import React, { useEffect } from 'react';
import FlightSearch from '../components/flight/FlightSearch';
import TeamList from '../components/flight/TeamList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import flightService from '../services/flightService';
import { useApp } from '../context/AppContext';
import teamService from '../services/teamService';
import { mockTeams,searchTeams,mockFlights, searchFlights } from '../utils/mockData';
import '../styles/Flight.css';

// Toggle this to false once the backend /api/teams endpoint is live
const USE_MOCK = false;

function SearchPage() {
  const {
    loading, setLoading,
    error, setError, clearError,
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
  } = useApp();

  // On first mount, show all teams
  useEffect(() => {
    if (searchResults === null) {
      if (USE_MOCK) {
        setSearchResults(mockTeams);
      } else {
        fetchAllTeams();
      }
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
      //setError('Failed to load teams. Using mock data.');
      // Fallback to mock data
      setSearchResults(mockTeams);
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
        // Simulate network delay
        await new Promise(res => setTimeout(res, 400));
        results = searchTeams(query);
      } else {
        // Real API call - if backend supports search, use it
        // Otherwise filter client-side
        const allTeams = await teamService.getAllTeams();
        if (!query) {
          results = allTeams;
        } else {
          const searchTerm = query.toLowerCase();
          results = allTeams.filter(team =>
            team.team.toLowerCase().includes(searchTerm) ||
            team.category.toLowerCase().includes(searchTerm) ||
            team.callsign.toLowerCase().includes(searchTerm)
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

  return (
    <div className="search-page">
      <h1>Search Teams</h1>
      <FlightSearch onSearch={handleSearch} initialValue={searchTerm} />

      {error && <ErrorMessage message={error} onRetry={() => handleSearch(searchTerm)} />}

      {loading ? (
        <LoadingSpinner message="Searching teams..." />
      ) : (
        <TeamList teams={searchResults || []} searchTerm={searchTerm} />
      )}
    </div>
  );
}

export default SearchPage;