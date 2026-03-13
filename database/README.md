# /database

This directory contains static data files used for development and seeding.

## Files

**`teams.json`** — list of tracked teams and their charter flight callsigns. Use this to seed the MySQL `teams` table.

**`flights_snapshot.json`** — a real snapshot of flight data captured from the Airplanes.live API. Use this as mock data when building the frontend before the backend is ready. Each entry preserves the last known flight data for a team even when the plane is not currently flying.

**`flight_refresh.log`** — one line per script run. Example: `2025-03-09T12:00:00Z fetchFlightData.ps1: Dallas Mavericks not flying. Miami Heat flying. Orlando Magic not flying.` (or `refreshFlyingOnly.ps1: ...` for the flying-only run). Created automatically; ignored by git (`*.log`).

## How the API Works

Flight data comes from the [Airplanes.live REST API](http://api.airplanes.live/v2/). You query it by charter callsign and it returns live ADS-B data for that flight if the plane is currently in the air.

```
GET http://api.airplanes.live/v2/callsign/DAL8931
```

If the plane is flying you get back position, altitude, speed, and heading. If it is not flying you get back `total: 0` and an empty array — this is normal. The snapshot file handles this by preserving the last known data rather than overwriting it with an empty response.

No authentication is required. Wait at least 10 seconds between requests to avoid rate limiting.

## Refresh scripts (see also project README)
- **Full refresh:** `../scripts/fetchFlightData.ps1` (Windows) or `../scripts/fetchFlightData.sh` (Linux). Fetches all teams, writes `flights_snapshot.json`. Run every 2 hours.
- **Flying-only refresh:** `../scripts/refreshFlyingOnly.ps1` (Windows) or `../scripts/refreshFlyingOnly.sh` (Linux). Re-fetches only teams currently marked as flying. Run every 10 minutes.
- **Scheduling:** Windows — `../scripts/scheduleFlightRefresh.ps1`. Linux — `../scripts/install-cron.sh` then add the printed lines to crontab (`crontab -e`). Linux scripts require `curl` and `jq`.