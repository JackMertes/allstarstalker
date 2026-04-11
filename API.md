# Ingestion API

Documentation for the flight data ingestion API: setup, endpoints, scheduling, and logs.

---

## Setup

### Prerequisites

- Docker Compose
- `.env.local` file at project root (copy from `.env.local.example`):

```
DB_HOST=mysql
DB_PORT=3306
DB_NAME=nba_flight_tracker
DB_USER=your_user
DB_PASSWORD=your_password
```

### Run with Docker

```bash
docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml up -d
```

Backend: http://localhost:8080  
MySQL: localhost:3306

---

## Ingestion Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ingest/refresh/{callsign}` | Refresh one team by callsign (e.g. `DAL8930`) |
| POST | `/api/ingest/refresh-all` | Full refresh of all teams (runs in background, returns 202) |

### Examples (PowerShell)

```powershell
# Single team
Invoke-RestMethod -Uri http://localhost:8080/api/ingest/refresh/DAL8930 -Method POST

# Full refresh
Invoke-RestMethod -Uri http://localhost:8080/api/ingest/refresh-all -Method POST
```

### Responses

- **refresh-all**: Returns `202 Accepted` with `teamsCount`. Returns `409` if a full refresh is already in progress.
- **refresh/{callsign}**: Returns `200 OK` if team found; `404` if callsign unknown.

---

## Scheduling

| Job | Schedule | Description |
|-----|----------|-------------|
| Full refresh | Every 2 hours at :00 | Refreshes all 28 teams (12s between each) |
| Flying refresh | Every 10 min at :05,:15,:25,:35,:45,:55 | Refreshes only teams with ACTIVE flights |

Flying refresh skips when a full refresh is in progress.

---

## Logs

| Location | Description |
|----------|-------------|
| `database/flight_refresh.log` | One line per refresh: timestamp + flying teams or "No teams currently flying" |
| `docker compose logs -f backend` | Live backend logs (SLF4J, errors, retries) |
