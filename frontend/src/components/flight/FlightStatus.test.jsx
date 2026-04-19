import React from 'react';
import { render, screen } from '@testing-library/react';
import FlightStatus from './FlightStatus';

describe('FlightStatus', () => {
  it('renders diverted flights with the diverted label', () => {
    render(<FlightStatus status="DIVERTED" />);

    expect(screen.getByText(/diverted/i)).toBeInTheDocument();
  });

  it('falls back to no data for unsupported statuses', () => {
    render(<FlightStatus status="BOARDING" />);

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
