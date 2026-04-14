// Flight statuses
export const FLIGHT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  LANDED: 'LANDED',
  CANCELLED: 'CANCELLED',
  DELAYED: 'DELAYED',
  NOT_FLYING: 'NOT_FLYING',
  UNKNOWN: 'UNKNOWN'
};

// Flight status colors
export const STATUS_COLORS = {
  SCHEDULED: '#3498db',
  ACTIVE: '#2ecc71',
  LANDED: '#95a5a6',
  CANCELLED: '#e74c3c',
  DELAYED: '#f39c12',
  NOT_FLYING: '#6366f1',  // indigo — not flying but has last known position
  UNKNOWN: '#9ca3af',     // gray — no data at all
};

// Human-readable labels for status badges
export const STATUS_LABELS = {
  SCHEDULED: 'Scheduled',
  ACTIVE: 'Flying',
  LANDED: 'Landed',
  CANCELLED: 'Cancelled',
  DELAYED: 'Delayed',
  NOT_FLYING: 'Not Flying',
  UNKNOWN: 'No Data',
};

// Entity types
export const ENTITY_TYPES = {
  CELEBRITY: 'CELEBRITY',
  COMPANY: 'COMPANY',
  GOVERNMENT: 'GOVERNMENT',
  OTHER: 'OTHER'
};

// Polling intervals (milliseconds)
export const POLLING_INTERVALS = {
  FLIGHT_UPDATE: 60000,      // 1 minute
  ACTIVE_FLIGHTS: 30000,     // 30 seconds
  POSITION_UPDATE: 10000     // 10 seconds
};

/**
 * Default API base when REACT_APP_API_BASE_URL is unset.
 * Matches docs/DEVELOPER_ACCESS.md (VM external IP :8080 + /api prefix for axios paths).
 * Override in .env for local Docker: http://localhost:8080/api
 */
export const DEFAULT_API_BASE_URL = 'http://34.134.223.201:8080/api';

// API endpoints
export const API_ENDPOINTS = {
  FLIGHTS: '/flights',
  AIRCRAFT: '/aircraft',
  ENTITIES: '/entities',
  TRACKING: '/tracking'
};
