import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackingPage from './TrackingPage';
import teamService from '../services/teamService';
import trackingService from '../services/trackingService';

jest.mock('../services/teamService', () => ({
  __esModule: true,
  default: {
    getAllTeams: jest.fn(),
  },
}));

jest.mock('../services/trackingService', () => ({
  __esModule: true,
  default: {
    getTrackings: jest.fn(),
    getUserTrackings: jest.fn(),
    addTracking: jest.fn(),
    removeTracking: jest.fn(),
    updateTracking: jest.fn(),
  },
}));

const initialTrackings = [
  {
    trackingId: '1',
    type: 'team',
    team: 'Denver Nuggets',
    callsign: 'DAL8924',
    category: 'NBA',
    notificationEnabled: true,
  },
];

const allTeams = [
  { team: 'Denver Nuggets', callsign: 'DAL8924', category: 'NBA' },
  { team: 'Boston Celtics', callsign: 'DAL8919', category: 'NBA' },
];

describe('TrackingPage', () => {
  beforeEach(() => {
    trackingService.getTrackings.mockResolvedValue(initialTrackings);
    teamService.getAllTeams.mockResolvedValue(allTeams);
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads and renders tracked items', async () => {
    render(<TrackingPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText('Denver Nuggets')).toBeInTheDocument();
    expect(screen.getByText(/your tracked items \(1\)/i)).toBeInTheDocument();
  });

  it('shows a load error message and empty state when loading fails', async () => {
    trackingService.getTrackings.mockRejectedValue(new Error('boom'));

    render(<TrackingPage />);

    expect(await screen.findByText(/could not load tracking data/i)).toBeInTheDocument();
    expect(screen.getByText(/no tracked items yet/i)).toBeInTheDocument();
  });

  it('adds a new tracking when a valid untracked team is submitted', async () => {
    const user = userEvent.setup();
    trackingService.addTracking.mockResolvedValue({
      trackingId: '2',
      type: 'team',
      team: 'Boston Celtics',
      callsign: 'DAL8919',
      category: 'NBA',
      notificationEnabled: true,
    });

    render(<TrackingPage />);
    await screen.findByText('Denver Nuggets');

    await user.type(screen.getByPlaceholderText(/enter flight number, tail number, or team name/i), 'Boston Celtics');
    await user.click(screen.getByRole('button', { name: /add tracking/i }));

    expect(trackingService.addTracking).toHaveBeenCalledWith(expect.objectContaining({
      team: 'Boston Celtics',
      callsign: 'DAL8919',
      category: 'NBA',
      notificationEnabled: true,
    }));
    expect(await screen.findByText('Boston Celtics')).toBeInTheDocument();
  });

  it('blocks duplicate team tracking', async () => {
    const user = userEvent.setup();

    render(<TrackingPage />);
    await screen.findByText('Denver Nuggets');

    await user.type(screen.getByPlaceholderText(/enter flight number, tail number, or team name/i), 'DAL8924');
    await user.click(screen.getByRole('button', { name: /add tracking/i }));

    expect(window.alert).toHaveBeenCalledWith('Team: Denver Nuggets (DAL8924) is already being tracked.');
    expect(trackingService.addTracking).not.toHaveBeenCalled();
  });

  it('removes a tracking when remove succeeds', async () => {
    const user = userEvent.setup();
    trackingService.removeTracking.mockResolvedValue({});

    render(<TrackingPage />);
    await screen.findByText('Denver Nuggets');

    await user.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(screen.queryByText('Denver Nuggets')).not.toBeInTheDocument();
    });
  });

  it('toggles notification state when update succeeds', async () => {
    const user = userEvent.setup();
    trackingService.updateTracking.mockResolvedValue({
      ...initialTrackings[0],
      notificationEnabled: false,
    });

    render(<TrackingPage />);
    await screen.findByText('Denver Nuggets');

    await user.click(screen.getByTitle(/disable notifications/i));

    expect(trackingService.updateTracking).toHaveBeenCalledWith('1', {
      notificationEnabled: false,
    });
    expect(await screen.findByText(/paused/i)).toBeInTheDocument();
  });

  it('shows an alert when update fails', async () => {
    const user = userEvent.setup();
    trackingService.updateTracking.mockRejectedValue(new Error('nope'));

    render(<TrackingPage />);
    await screen.findByText('Denver Nuggets');

    await user.click(screen.getByTitle(/disable notifications/i));

    expect(window.alert).toHaveBeenCalledWith('Failed to update notification settings.');
  });
});
