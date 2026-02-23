import React, { useEffect } from 'react';
import FlightSearch from '../components/flight/FlightSearch';
import FlightList from '../components/flight/FlightList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import flightService from '../services/flightService';
import { useApp } from '../context/AppContext';
import { mockFlights, searchFlights } from '../utils/mockData';
import '../styles/Flight.css';

// ─── Toggle this to false once the backend /flights/search endpoint is live ───
const USE_MOCK = true;

function SearchPage() {
  const {
    loading, setLoading,
    error, setError, clearError,
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
  } = useApp();

  // On first mount, show all mock flights (or all real flights) if nothing searched yet
  useEffect(() => {
    if (searchResults === null) {
      if (USE_MOCK) {
        setSearchResults(mockFlights);
      } else {
        handleSearch('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setLoading(true);
    clearError();

    try {
      let results;
      if (USE_MOCK) {
        // Simulate network delay so the spinner is visible
        await new Promise(res => setTimeout(res, 400));
        results = searchFlights(query);
      } else {
        // Real API call - GET /api/flights/search?flightNumber=<query>
        results = await flightService.searchByFlightNumber(query);
      }
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Flights</h1>
      <FlightSearch onSearch={handleSearch} initialValue={searchTerm} />

      {error && <ErrorMessage message={error} onRetry={clearError} />}

      {loading ? (
        <LoadingSpinner message="Searching flights..." />
      ) : (
        <FlightList flights={searchResults || []} searchTerm={searchTerm} />
      )}
    </div>
  );
}

export default SearchPage;
