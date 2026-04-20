import { FLIGHT_STATUS } from './constants';

const SUPPORTED_STATUSES = new Set(Object.values(FLIGHT_STATUS));

const STATUS_RANK = {
  [FLIGHT_STATUS.ACTIVE]: 0,
  [FLIGHT_STATUS.DIVERTED]: 1,
  [FLIGHT_STATUS.DELAYED]: 2,
  [FLIGHT_STATUS.SCHEDULED]: 3,
  [FLIGHT_STATUS.LANDED]: 4,
  [FLIGHT_STATUS.CANCELLED]: 5,
  [FLIGHT_STATUS.NOT_FLYING]: 6,
  [FLIGHT_STATUS.UNKNOWN]: 7,
};

export function normalizeFlightStatus(status) {
  const normalized = String(status || '').trim().toUpperCase();
  if (!normalized) {
    return FLIGHT_STATUS.UNKNOWN;
  }

  if (SUPPORTED_STATUSES.has(normalized)) {
    return normalized;
  }

  return FLIGHT_STATUS.UNKNOWN;
}

export function getStatusRank(status) {
  return STATUS_RANK[normalizeFlightStatus(status)] ?? STATUS_RANK[FLIGHT_STATUS.UNKNOWN];
}

export function isLiveStatus(status) {
  const normalized = normalizeFlightStatus(status);
  return normalized === FLIGHT_STATUS.ACTIVE || normalized === FLIGHT_STATUS.DIVERTED;
}
