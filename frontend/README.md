# Flight Tracker Frontend

Frontend application for the Flight Tracker system - P_07 Big Old Jet Airliner.

## Prerequisites

- Node.js 16+ and npm
- Backend API: default target is the class VM (`docs/DEVELOPER_ACCESS.md`); use local `http://localhost:8080` when running Docker backend only

## Setup Instructions

1. **Install dependencies:**
```bash
   npm install
```

2. **Configure environment:**
```bash
   cp .env.example .env
   # Edit .env with your configuration
```

3. **Start development server:**
```bash
   npm start
```

   The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Project Structure
```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── services/      # API service layer
├── hooks/         # Custom React hooks
├── context/       # React Context providers
├── utils/         # Utility functions
└── styles/        # CSS stylesheets
```

## Features

- Flight search by flight number, aircraft, or entity
- Real-time flight tracking
- Aircraft database
- User tracking preferences

## Technologies

- React 18
- React Router 6
- Axios for HTTP requests
- CSS3 for styling

## API Integration

The frontend connects to the Spring Boot backend at the URL specified in `.env`:
```
REACT_APP_API_BASE_URL=http://34.134.223.201:8080/api
```

## Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Handle loading and error states
- Write clean, readable code

## Troubleshooting

**CORS errors:**
- Ensure backend has CORS enabled for `http://localhost:3000`

**API connection issues:**
- Verify backend is running
- Check `.env` file has correct API URL

**Build errors:**
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
