import React from 'react';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamService from '../services/teamService';
import LoadingSpinner from '../components/common/LoadingSpinner';

import { TeamCard,} from './../components/flight';// FLIGHT COMPONENTS
import {
  getActiveFlights
} from './../utils/mockData';
import { mockTeams } from '../utils/mockData';

// Toggle to false when backend is ready
const USE_MOCK = false;

function HomePage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      let teamsData;
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));
        teamsData = mockTeams.slice(0, 4); // Show first 4 teams on homepage
      } else {
        const allTeams = await teamService.getAllTeams();
        teamsData = allTeams.slice(0, 6); // Show first 6 teams
      }
      setTeams(teamsData);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setTeams(mockTeams.slice(0, 4)); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Sports Team Flight Tracker</h1>
        <p className="subtitle">Track professional sports teams' flights in real-time</p>
        <div className="cta-buttons">
          <Link to="/search" className="btn btn-primary">
            Search Teams
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
            <h3>🔍 Team Search</h3>
            <p>Search for any professional sports team</p>
          </div>
          <div className="feature-card">
            <h3>📍 Real-time Tracking</h3>
            <p>Get live updates on team flight positions</p>
          </div>
          <div className="feature-card">
            <h3>✈️ Flight Status</h3>
            <p>Check if a team is currently flying</p>
          </div>
          <div className="feature-card">
            <h3>⭐ Tracking List</h3>
            <p>Save and track your favorite teams</p>
          </div>
        </div>
      </div>

      {/* Featured Teams Section */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Few of the Featured Teams</h2>
        {loading ? (
          <LoadingSpinner message="Loading teams..." />
        ) : teams.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {teams.map((team, index) => (
              <TeamCard key={team.callsign || index} team={team} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No teams available</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;