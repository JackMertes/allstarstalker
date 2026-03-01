import React from 'react';
import FlightCard from './FlightCard';

/**
 * FlightList - renders a list of FlightCards with count summary and empty state.
 *
 * Props:
 *   flights     - array of flight objects to display
 *   searchTerm  - (optional) current search query, used in the results label
 */
function FlightList({ flights = [], searchTerm = '' }) {
  return (
    <div className="flight-list">
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          {flights.length} flight{flights.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {flights.length > 0 ? (
        <div className="search-results">
          {flights.map(flight => (
            <FlightCard key={flight.flightId} flight={flight} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🔍</p>
          <h3>No flights found</h3>
          <p style={{ color: '#7f8c8d' }}>
            Try searching for a different flight number, tail number, or airport code.
          </p>
        </div>
      )}
    </div>
  );
}

export default FlightList;
