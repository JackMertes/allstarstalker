import React from 'react';
import logo from '../../assets/logo.png';
import '../../styles/Common.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logo} alt="" className="footer-logo" />
          <span className="footer-name">All Star Stalker</span>
        </div>
        <p>© 2026 P_07 Star Stalker · Academic Project</p>
      </div>
    </footer>
  );
}

export default Footer;
