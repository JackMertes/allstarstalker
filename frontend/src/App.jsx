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
import { FlightStatus,TeamCard,FlightSearch,FlightDetails} from './components/flight';// FLIGHT COMPONENTS
import { TrackingList, AddTracking } from './components/tracking';//TRACKING PAGE COMPONENTS
import { HomePage,SearchPage,TrackingPage,NotFoundPage,FlightDetailsPage } from './pages';//GENERAL PAGE COMPONENTS

// These changes to be made in SearchPage.jsx
// Before (Mock):
//const results = searchFlights(query);
// After (Real API):
//const results = await flightService.searchByFlightNumber(query);

//Also changes need be done in TackingPage.jsx to fetch from backend instead of using mock data.

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