import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from './SearchPage';
import { AppProvider } from '../context/AppContext';
import teamService from '../services/teamService';

// Mock teamService so tests don't hit the network
jest.mock('../services/teamService', () => ({
  __esModule: true,
  default: {
    getAllTeams: jest.fn(),
  },
}));

const mockTeams = [
  { callsign: 'DAL8924', team: 'Denver Nuggets',   category: 'NBA', status: 'ACTIVE' },
  { callsign: 'DAL9001', team: 'Dallas Cowboys',    category: 'NFL', status: 'LANDED' },
  { callsign: 'DAL8920', team: 'Brooklyn Nets',     category: 'NBA', status: 'ACTIVE' },
];

/** Wraps SearchPage with all required providers */
function renderSearchPage() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    </AppProvider>
  );
}

describe('SearchPage', () => {
  beforeEach(() => {
    teamService.getAllTeams.mockResolvedValue(mockTeams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page heading', () => {
    renderSearchPage();
    expect(screen.getByText('Search Teams')).toBeInTheDocument();
  });

  it('renders the search input and button', () => {
    renderSearchPage();
    expect(
      screen.getByPlaceholderText(/search by team name/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls getAllTeams on mount', async () => {
    renderSearchPage();
    await waitFor(() => {
      expect(teamService.getAllTeams).toHaveBeenCalledTimes(1);
    });
  });

  it('shows skeleton placeholders while teams are being fetched', () => {
    teamService.getAllTeams.mockReturnValue(new Promise(() => {}));
    renderSearchPage();
    expect(document.querySelector('.sk-shimmer')).toBeInTheDocument();
  });

  it('displays fetched teams after loading', async () => {
    renderSearchPage();
    expect(await screen.findByText('Denver Nuggets')).toBeInTheDocument();
    expect(screen.getByText('Dallas Cowboys')).toBeInTheDocument();
    expect(screen.getByText('Brooklyn Nets')).toBeInTheDocument();
  });

  it('shows the result count after loading', async () => {
    renderSearchPage();
    // TeamList renders "X teams found" — use this unique text to avoid matching the sort bar
    expect(await screen.findByText(/3 teams found/i)).toBeInTheDocument();
  });

  it('shows the sort control once results are available', async () => {
    renderSearchPage();
    expect(await screen.findByRole('button', { name: /active first/i })).toBeInTheDocument();
  });

  it('shows sort options when the sort control is clicked', async () => {
    const user = userEvent.setup();
    renderSearchPage();

    const sortBtn = await screen.findByRole('button', { name: /active first/i });
    await user.click(sortBtn);

    expect(screen.getByText('A → Z')).toBeInTheDocument();
    expect(screen.getByText('Z → A')).toBeInTheDocument();
    expect(screen.getByText('Active First')).toBeInTheDocument();
    expect(screen.getByText('Least Recent')).toBeInTheDocument();
  });

  it('filters teams when a search query is submitted', async () => {
    teamService.getAllTeams.mockResolvedValue(mockTeams);

    const user = userEvent.setup();
    renderSearchPage();

    // Wait for initial load
    await screen.findByText('Denver Nuggets');

    const input = screen.getByPlaceholderText(/search by team name/i);
    await user.clear(input);
    await user.type(input, 'Cowboys');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    expect(await screen.findByText('Dallas Cowboys')).toBeInTheDocument();
    // Non-matching team should not be visible after filter
    expect(screen.queryByText('Denver Nuggets')).not.toBeInTheDocument();
    // Search filters the cached list; no second fetch
    expect(teamService.getAllTeams).toHaveBeenCalledTimes(1);
  });

  it('does not refetch teams when filtering after initial load', async () => {
    teamService.getAllTeams.mockResolvedValue(mockTeams);
    const user = userEvent.setup();
    renderSearchPage();
    await screen.findByText('Denver Nuggets');
    expect(teamService.getAllTeams).toHaveBeenCalledTimes(1);

    const input = screen.getByPlaceholderText(/search by team name/i);
    await user.type(input, 'Nets');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    await screen.findByText('Brooklyn Nets');
    expect(teamService.getAllTeams).toHaveBeenCalledTimes(1);
  });
});
