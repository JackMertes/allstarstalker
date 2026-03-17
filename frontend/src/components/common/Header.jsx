import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../styles/Common.css';

// Persistent top nav — logo + brand name on the left, routes on the right
function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="All Star Stalker logo" className="logo-img" />
          <span className="logo-name">
            All Star <span>Stalker</span>
          </span>
        </Link>

        <nav className="nav">
          <Link to="/"         className="nav-link">Home</Link>
          <Link to="/search"   className="nav-link">Search</Link>
          <Link to="/tracking" className="nav-link">Tracking</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
