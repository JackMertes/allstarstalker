# Spring Boot Flight Ingestion Plan

## Goal

Add the Spring Boot ingestion path that polls Airplanes.live and stores current team flight status in MySQL using the `flights` table, with scheduling, JUnit coverage, and documentation planned as follow-up steps.

---

## Completed (Tasks 1–5)

| Task | Description | Status |
|------|-------------|--------|
| **1** | Flights table schema: nullable airport IDs, live position columns, unique callsign for upserts | Done |
| **2** | Flight entity and FlightRepository with JPA | Done |
| **3** | Teams from MySQL: `callsign` column, seed data in `flighttracker.sql`, Team entity and TeamRepository | Done |
| **4** | Airplanes.live client: RestTemplate, DTOs (AirplanesLiveResponse, AircraftData), HTTPS base URL | Done |
| **5** | One-team refresh: FlightRefreshService, IngestController, `POST /api/ingest/refresh/{callsign}` | Done |

### Additional fixes

- **Docker Compose**: MySQL init script (`flighttracker.sql`), schema auto-applied on first run
- **Backend restart**: `restart: on-failure` for startup race with MySQL
- **HTTPS**: Airplanes.live client uses `https://` (HTTP was failing from Docker)

---

## Remaining Tasks

| Task | Description | Points |
|------|-------------|--------|
| **6** | Add retry and rate-limit handling (per `fetchFlightData.ps1`: 10s delay, retry on failure) | 3 |
| **7** | Full refresh across all teams, upserts to `flights` | 3 |
| **8** | Ingestion logging and failure visibility | 2 |
| **9** | JUnit tests for mapping, client, persistence flow | 3 |
| **10** | Spring scheduling: full refresh every 2h, flying teams every 10min | 4 |
| **11** | Documentation: setup, ingestion, testing, scheduling | 2 |

---

## Data Flow

```
teams (MySQL) → FlightRefreshService → AirplanesLiveClient (HTTPS)
                                              ↓
                                    Airplanes.live API
                                              ↓
                                    mapToFlight() → flights (MySQL)
```

---

## Key Files

- `database/flighttracker.sql` — Schema, seed data, views
- `backend/.../Flight.java`, `FlightRepository.java` — Flight entity and repository
- `backend/.../Team.java`, `TeamRepository.java` — Team entity and repository
- `backend/.../AirplanesLiveClient.java` — API client (HTTPS)
- `backend/.../FlightRefreshService.java` — Refresh logic and mapping
- `backend/.../IngestController.java` — `POST /api/ingest/refresh/{callsign}`
- `docker-compose.yml` — MySQL + backend, init script, restart policy
