import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useFavourites } from '../../hooks/useFavourites';
import '../../styles/Common.css';

function Header() {
  const [isDark, toggleDark] = useDarkMode();
  const { count: favCount } = useFavourites();
  const location = useLocation();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="header">
      <div className="header-container">
        {/* Brand */}
        <Link to="/" className="logo">
          <img src={logo} alt="All Star Stalker logo" className="logo-img" />
          <span className="logo-name">
            All Star <span>Stalker</span>
          </span>
        </Link>

        {/* Nav + controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <nav className="nav">
            <Link to="/"         className={`nav-link ${isActive('/')        ? 'active' : ''}`}>Home</Link>
            <Link to="/search"   className={`nav-link ${isActive('/search')  ? 'active' : ''}`}>
              Search
              {favCount > 0 && (
                <span style={{
                  marginLeft: 5,
                  background: '#FBBF24',
                  color: '#0B2545',
                  borderRadius: '999px',
                  padding: '1px 6px',
                  fontSize: '11px',
                  fontWeight: '800',
                  verticalAlign: 'middle',
                }}>
                  {favCount}★
                </span>
              )}
            </Link>
            <Link to="/tracking" className={`nav-link ${isActive('/tracking') ? 'active' : ''}`}>Tracking</Link>
          </nav>

          {/* Dark mode toggle */}
          <button
            className="dark-toggle"
            onClick={toggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
            <span className="dark-toggle-label">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
