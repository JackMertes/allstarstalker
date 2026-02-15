import React, { useState } from 'react';
import '../../styles/Flight.css';

function FlightSearch({ onSearch, initialValue = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="flight-search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by flight number, tail number, entity, or airport..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
}

export default FlightSearch;
