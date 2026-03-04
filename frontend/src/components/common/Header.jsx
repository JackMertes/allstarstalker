import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Common.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>✈️ Sports Team Tracker</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/tracking" className="nav-link">Tracking</Link>
        </nav>
      </div>
    </header>
  );
}


export default Header;
