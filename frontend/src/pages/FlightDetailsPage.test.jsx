import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FlightDetailsPage from './FlightDetailsPage';
import teamService from '../services/teamService';

jest.mock('../services/teamService', () => ({
  __esModule: true,
  default: {
    checkStatus: jest.fn(),
  },
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

/** Renders FlightDetailsPage inside a router with the /flight/:flightId route */
function renderPage(callsign = 'DAL8924', locationState = undefined) {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: `/flight/${callsign}`, state: locationState }]}
    >
      <Routes>
        <Route path="/flight/:flightId" element={<FlightDetailsPage />} />
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
    expect(screen.getByText('🟢 LIVE — IN FLIGHT')).toBeInTheDocument();
  });

  it('shows a back button when flight data is available', () => {
    renderPage('DAL8924', { flightData: flyingData });
    expect(screen.getByText(/← Back/i)).toBeInTheDocument();
  });

  it('shows the loading spinner when no location state and fetch is pending', () => {
    // Keep request pending to assert initial loading state.
    teamService.checkStatus.mockReturnValue(new Promise(() => {}));

    renderPage('DAL8924'); // no location.state → loading = true initially

    expect(screen.getByText(/loading flight details/i)).toBeInTheDocument();
  });

  it('displays flight details after fetching a flying team', async () => {
    teamService.checkStatus.mockResolvedValue({ DAL8924: flyingData });

    renderPage('DAL8924');

    expect(await screen.findByText('Denver Nuggets')).toBeInTheDocument();
    expect(screen.getByText('🟢 LIVE — IN FLIGHT')).toBeInTheDocument();
  });

  it('shows a friendly no-data message when the fetched team is not currently flying', async () => {
    teamService.checkStatus.mockResolvedValue({
      DAL8924: { is_flying: false, callsign: 'DAL8924' },
    });

    renderPage('DAL8924');

    expect(
      await screen.findByText(/no flight information available yet/i)
    ).toBeInTheDocument();
  });

  it('shows "Back to Search" button after a no-data response', async () => {
    teamService.checkStatus.mockResolvedValue({
      DAL8924: { is_flying: false, callsign: 'DAL8924' },
    });

    renderPage('DAL8924');

    expect(await screen.findByText('Back to Search')).toBeInTheDocument();
  });

  it('shows a fetch error when checkStatus has no callsign result', async () => {
    teamService.checkStatus.mockResolvedValue({});

    renderPage('DAL8924');

    expect(
      await screen.findByText(/could not load flight data for this team/i)
    ).toBeInTheDocument();
  });
});
