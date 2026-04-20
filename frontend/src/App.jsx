import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './styles/App.css';
import './styles/Common.css';
import './styles/Flight.css';
import './styles/dark-mode.css';  // ← dark mode tokens + toggle styles
import { Header, Footer } from './components/common';
import { HomePage, SearchPage, TrackingPage, NotFoundPage, FlightDetailsPage } from './pages';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/"           element={<HomePage />} />
              <Route path="/search"     element={<SearchPage />} />
              <Route path="/flight/:callsign" element={<FlightDetailsPage />} />
              <Route path="/tracking"   element={<TrackingPage />} />
              <Route path="*"           element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
