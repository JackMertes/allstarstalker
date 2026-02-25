# /database

This directory contains static data files used for development and seeding.

## Files

**`teams.json`** — list of tracked teams and their charter flight callsigns. Use this to seed the MySQL `teams` table.

**`flights_snapshot.json`** — a real snapshot of flight data captured from the Airplanes.live API. Use this as mock data when building the frontend before the backend is ready. Each entry preserves the last known flight data for a team even when the plane is not currently flying.

## Notes
- need to develop the script that refreshes `flights_snapshot.json` so we can populate it with the most recent data