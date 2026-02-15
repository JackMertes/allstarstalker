import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import {
  mockFlights,
  mockUserTrackings,
  searchFlights,
  getFlightById,
  getActiveFlights
} from './utils/mockData';
import { formatDateTime, formatTime, formatAltitude, formatSpeed } from './utils/formatters';
import { STATUS_COLORS } from './utils/constants';
import './styles/App.css';
import './styles/Common.css';
import './styles/Flight.css';
import { Header,Footer,LoadingSpinner } from './components/common';// COMMON COMPONENTS
import { FlightStatus,FlightCard,FlightSearch,FlightDetails} from './components/flight';// FLIGHT COMPONENTS
import { TrackingList, AddTracking } from './components/tracking';//TRACKING PAGE COMPONENTS


// Before (Mock):
//const results = searchFlights(query);
// After (Real API):
//const results = await flightService.searchByFlightNumber(query);

// ============================================================================
// PAGES
// ============================================================================

function HomePage() {
  const [activeFlights] = useState(getActiveFlights());

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Big Old Jet Airliner</h1>
        <p className="subtitle">Track flights in real-time across the globe</p>
        <div className="cta-buttons">
          <Link to="/search" className="btn btn-primary">
            Search Flights
          </Link>
          <Link to="/tracking" className="btn btn-secondary">
            My Tracking
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔍 Flight Search</h3>
            <p>Search for any flight by number, aircraft, or entity</p>
          </div>
          <div className="feature-card">
            <h3>📍 Real-time Tracking</h3>
            <p>Get live updates on flight positions and status</p>
          </div>
          <div className="feature-card">
            <h3>✈️ Aircraft Database</h3>
            <p>Track specific aircraft and their flight history</p>
          </div>
          <div className="feature-card">
            <h3>⭐ Celebrity Tracking</h3>
            <p>Follow flights of celebrities and public figures</p>
          </div>
        </div>
      </div>

      {/* Active Flights Section */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Active Flights</h2>
        {activeFlights.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {activeFlights.map(flight => (
              <FlightCard key={flight.flightId} flight={flight} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No active flights at the moment</p>
        )}
      </div>
    </div>
  );
}

function SearchPage() {
  const [searchResults, setSearchResults] = useState(mockFlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (query) => {
    setSearchTerm(query);
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const results = searchFlights(query);
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="search-page">
      <h1>Search Flights</h1>
      <FlightSearch onSearch={handleSearch} initialValue={searchTerm} />

      {loading ? (
        <LoadingSpinner message="Searching flights..." />
      ) : (
        <>
          <div style={{ marginTop: '24px', marginBottom: '16px' }}>
            <p style={{ color: '#7f8c8d' }}>
              {searchResults.length} flight{searchResults.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="search-results">
              {searchResults.map(flight => (
                <FlightCard key={flight.flightId} flight={flight} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px' }}>
              <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🔍</p>
              <h3>No flights found</h3>
              <p style={{ color: '#7f8c8d' }}>Try searching for a different flight number or airport</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FlightDetailsPage() {
  const { flightId } = useParams();
  const [flight] = useState(getFlightById(flightId));
  const navigate = useNavigate();

  if (!flight) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Flight not found</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
          The flight you're looking for doesn't exist.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="flight-details-page">
      <button
        onClick={() => navigate('/search')}
        style={{
          marginBottom: '20px',
          background: 'none',
          border: 'none',
          color: '#3498db',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ← Back to Search
      </button>

      <FlightDetails flight={flight} />
    </div>
  );
}

function TrackingPage() {
  const [trackings, setTrackings] = useState(mockUserTrackings);

  const handleAddTracking = (trackingValue) => {
    const newItem = {
      trackingId: trackings.length + 1,
      type: 'flight',
      flightNumber: trackingValue.toUpperCase(),
      notificationEnabled: false,
      createdAt: new Date().toISOString()
    };

    setTrackings([...trackings, newItem]);
  };

  const handleRemoveTracking = (trackingId) => {
    setTrackings(trackings.filter(t => t.trackingId !== trackingId));
  };

  const handleToggleNotification = (trackingId) => {
    setTrackings(trackings.map(t =>
      t.trackingId === trackingId
        ? { ...t, notificationEnabled: !t.notificationEnabled }
        : t
    ));
  };

  return (
    <div className="tracking-page">
      <h1>My Tracking</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '32px' }}>
        Keep track of your favorite flights, aircraft, and entities
      </p>

      <AddTracking onAdd={handleAddTracking} />

      <TrackingList
        trackings={trackings}
        onRemove={handleRemoveTracking}
        onToggleNotification={handleToggleNotification}
      />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="not-found-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/flight/:flightId" element={<FlightDetailsPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;