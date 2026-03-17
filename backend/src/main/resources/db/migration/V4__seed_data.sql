-- ============================================================
-- V4: Initial seed data for development/demo.
-- Depends on V1 (tables). Safe to run once; Flyway records it in flyway_schema_history.
-- ============================================================

-- Two NBA teams (used for team–flight demo).
INSERT INTO teams (nba_team_id, name, abbreviation, city, conference)
VALUES
('MIL','Milwaukee Bucks','MIL','Milwaukee','East'),
('GSW','Golden State Warriors','GSW','San Francisco','West');

-- Three airports (MKE, SFO, LAX) for demo flight.
INSERT INTO airports (iata_code, name, city, country)
VALUES
('MKE','Milwaukee Mitchell Intl','Milwaukee','US'),
('SFO','San Francisco Intl','San Francisco','US'),
('LAX','Los Angeles Intl','Los Angeles','US');

-- One demo flight: MKE -> SFO, scheduled 2026-02-26.
INSERT INTO flights (
  external_flight_id, departure_airport_id, arrival_airport_id,
  scheduled_departure_utc, scheduled_arrival_utc, status)
SELECT 'demo1', d.id, a.id, '2026-02-26 01:00:00', '2026-02-26 04:00:00', 'SCHEDULED'
FROM airports d JOIN airports a WHERE d.iata_code='MKE' AND a.iata_code='SFO';

-- Link MIL to the demo flight as TEAM_CHARTER (confidence 95).
INSERT INTO team_flights (team_id, flight_id, role, confidence)
SELECT t.id, f.id, 'TEAM_CHARTER', 95
FROM teams t JOIN flights f
WHERE t.abbreviation='MIL' AND f.external_flight_id='demo1';
