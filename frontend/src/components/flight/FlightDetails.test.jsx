import React from 'react';
import { render, screen } from '@testing-library/react';
import FlightDetails from './FlightDetails';

// Minimal complete flight data matching what FlightDetails expects
const baseFlight = {
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

describe('FlightDetails', () => {
  it('shows fallback when no flightData prop is given', () => {
    render(<FlightDetails />);
    expect(screen.getByText('No Flight Data Available')).toBeInTheDocument();

  });

  it('shows fallback when raw is null', () => {
    render(<FlightDetails flightData={{ ...baseFlight, raw: null }} />);
    expect(screen.getByText('No Flight Data Available')).toBeInTheDocument();
  });

  it('shows fallback when raw.ac is an empty array', () => {
    render(<FlightDetails flightData={{ ...baseFlight, raw: { ac: [] } }} />);
    expect(screen.getByText('No Flight Data Available')).toBeInTheDocument();
  });

  it('renders the team name', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getByText('Denver Nuggets')).toBeInTheDocument();
  });

  it('renders the live in-flight status badge', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getByText('🟢 LIVE — IN FLIGHT')).toBeInTheDocument();
  });

  it('renders the flight number in flight information', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getAllByText('DAL8924').length).toBeGreaterThanOrEqual(1);
  });

  it('renders decoded aircraft type', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getByText('Boeing 757-200')).toBeInTheDocument();
  });

  it('renders formatted ground speed', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getAllByText('559.9 knots').length).toBeGreaterThan(0);
  });

  it('renders formatted altitude (barometric)', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getAllByText(/33[,.]?000 ft/).length).toBeGreaterThan(0);
  });

  it('renders latitude and longitude', () => {
    render(<FlightDetails flightData={baseFlight} />);
    expect(screen.getByText('37.7298°')).toBeInTheDocument();
    expect(screen.getByText('-102.7764°')).toBeInTheDocument();
  });

  it('renders Unavailable for missing optional aircraft fields', () => {
    const sparse = {
      ...baseFlight,
      raw: {
        ac: [{ lat: 37.72, lon: -102.77 }],
      },
    };
    render(<FlightDetails flightData={sparse} />);
    const unavailableItems = screen.getAllByText('Unavailable');
    expect(unavailableItems.length).toBeGreaterThan(0);
  });
});
