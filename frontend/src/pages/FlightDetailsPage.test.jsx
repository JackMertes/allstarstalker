import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FlightDetailsPage from './FlightDetailsPage';
import { getFlightStatus } from '../utils/mockData';

// Mock the mockData module so we control what getFlightStatus returns in each test
jest.mock('../utils/mockData', () => ({
  getFlightStatus: jest.fn(),
}));

const flyingData = {
  team: 'Denver Nuggets',
  callsign: 'DAL8924',
  is_flying: true,
  last_seen: 1772142652001,
  raw: {
    ac: [
      {
        flight: 'DAL8924 ',
        r: 'N662DN',
        t: 'B752',
        desc: 'BOEING 757-200',
        ownOp: 'BANK OF UTAH TRUSTEE',
        year: '1991',
        alt_baro: 33000,
        alt_geom: 33500,
        gs: 559.9,
        track: 125.99,
        baro_rate: 64,
        squawk: '2722',
        lat: 37.729844,
        lon: -102.776443,
        seen: 0.2,
      },
    ],
  },
};

/** Renders FlightDetailsPage inside a router with the /flight/:callsign route */
function renderPage(callsign = 'DAL8924', locationState = undefined) {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: `/flight/${callsign}`, state: locationState }]}
    >
      <Routes>
        <Route path="/flight/:callsign" element={<FlightDetailsPage />} />
        {/* Stub for /search so back-navigation tests don't 404 */}
        <Route path="/search" element={<div>Search Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FlightDetailsPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders FlightDetails immediately when flightData is passed via location state', () => {
    renderPage('DAL8924', { flightData: flyingData });

    expect(screen.getByText('Denver Nuggets')).toBeInTheDocument();
    expect(screen.getByText('FLYING')).toBeInTheDocument();
  });

  it('shows a back button when flight data is available', () => {
    renderPage('DAL8924', { flightData: flyingData });
    expect(screen.getByText(/← Back/i)).toBeInTheDocument();
  });

  it('shows the loading spinner when no location state and fetch is pending', () => {
    // Make getFlightStatus return a value but the 300 ms delay means loading is
    // still true on the very first render frame
    getFlightStatus.mockReturnValue(flyingData);

    renderPage('DAL8924'); // no location.state → loading = true initially

    expect(screen.getByText(/loading flight details/i)).toBeInTheDocument();
  });

  it('displays flight details after fetching a flying team', async () => {
    getFlightStatus.mockReturnValue(flyingData);

    renderPage('DAL8924');

    // findByText waits for async state updates (incl. the 300 ms mock delay)
    expect(await screen.findByText('Denver Nuggets')).toBeInTheDocument();
    expect(screen.getByText('FLYING')).toBeInTheDocument();
  });

  it('shows an error when the fetched team is not currently flying', async () => {
    getFlightStatus.mockReturnValue({ is_flying: false, callsign: 'DAL8924' });

    renderPage('DAL8924');

    expect(
      await screen.findByText(/not currently flying/i)
    ).toBeInTheDocument();
  });

  it('shows "Back to Search" button after a not-flying error', async () => {
    getFlightStatus.mockReturnValue({ is_flying: false, callsign: 'DAL8924' });

    renderPage('DAL8924');

    expect(await screen.findByText('Back to Search')).toBeInTheDocument();
  });

  it('shows "Flight not found" when getFlightStatus returns null', async () => {
    getFlightStatus.mockReturnValue(null);

    renderPage('DAL8924');

    // null statusData triggers the not-flying error path
    expect(
      await screen.findByText(/not currently flying/i)
    ).toBeInTheDocument();
  });
});
