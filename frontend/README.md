# All Star Stalker — Frontend

React frontend for All Star Stalker, a real-time NBA team flight tracker. Displays live flight status, positions, and team travel data pulled from the backend API.

---

## Features

**Home page** — Hero section with live tracking badge, stat pills showing league and team counts, and a live feed of teams currently in the air. Includes a feature overview grid.

**Search** — Browse and search all 28 NBA teams by name or callsign. Teams are sorted by flight status by default (active first), with options to sort A-Z, Z-A, or least recent. Starred teams appear in a pinned favorites strip at the top.

**Favorites** — Star any team from the search page or team card. Favorites persist across sessions via localStorage and show a count badge on the nav link.

**Flight status** — Each team card shows live/offline status, current location or route, aircraft type, and callsign. Clicking "Check Status" navigates to a dedicated flight details page with full ADS-B data.

**Tracking list** — A personal tracking page for managing followed teams and flights.

**Dark mode** — Full dark mode support via a toggle in the header. Preference is persisted in localStorage.

---

## Tech stack

- React 18
- React Router v6
- CSS custom properties (no component library)
- Create React App

---

## Running locally

**Prerequisites:** Node.js 18+ and npm.

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000` and proxies API requests to the backend at `http://localhost:8080`.

To point at a different backend, set the `REACT_APP_API_URL` environment variable:

```bash
REACT_APP_API_URL=http://your-backend:8080/api npm start
```

To run against mock data without a backend, set `USE_MOCK = true` at the top of `SearchPage.jsx` and `HomePage.jsx`.

---

## Project structure

```
src/
  assets/          Static assets (logo, images)
  components/
    common/        Header, Footer, skeletons, error messages
    flight/        TeamCard, TeamList, FlightSearch, FlightStatus, FlightMap
  context/         AppContext (shared loading/error/search state)
  hooks/           useFavorites, useDarkMode
  pages/           HomePage, SearchPage, FlightDetailsPage, TrackingPage, NotFoundPage
  services/        teamService (API calls)
  styles/          App.css, Common.css, Flight.css, dark-mode.css
  utils/           mockData, teamApiMapper
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:8080/api` | Backend API base URL |

---

## Building for production

```bash
npm run build
```

Output goes to `build/`. Serve with any static file server or configure your backend to serve the build directory.
