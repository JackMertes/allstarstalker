# /database

Static data files, schema, and ingestion logs.

## Files

**`flighttracker.sql`** — MySQL schema, seed data, and views. Used by Docker as the init script for the database.

**`teams.json`** — List of tracked teams and their charter flight callsigns. Use to seed the MySQL `teams` table.

**`flights_snapshot.json`** — Snapshot of flight data from the Airplanes.live API. Mock data for the frontend. Preserves last known flight data when a plane is not currently flying.

**`flight_refresh.log`** — Written by the Spring Boot backend on each full or flying refresh. One line per run: timestamp + flying teams or "No teams currently flying."

**`flight_refresh.log`** — one line per script run. Example: `2025-03-09T12:00:00Z fetchFlightData.ps1: Dallas Mavericks not flying. Miami Heat flying. Orlando Magic not flying.` (or `refreshFlyingOnly.ps1: ...` for the flying-only run). Created automatically; ignored by git (`*.log`).

## How the API Works

Flight data comes from the [Airplanes.live REST API](http://api.airplanes.live/v2/). Query by charter callsign:

```
GET http://api.airplanes.live/v2/callsign/DAL8931
```

If the plane is flying you get position, altitude, speed, and heading. If not flying you get `total: 0` and an empty array — that is normal. The backend preserves last known data when the plane is not in the air.

No authentication required. The backend waits 12 seconds between requests to avoid rate limiting.
