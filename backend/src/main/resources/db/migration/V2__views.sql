-- ============================================================
-- V2: Views for flight details and team–flight listing.
-- Depends on V1 (tables).
-- ============================================================

-- One row per flight with departure/arrival airport info and computed duration (minutes).
CREATE VIEW v_flight_details AS
SELECT
  f.id AS flight_id,
  f.external_flight_id,
  f.tail_number,
  f.callsign,
  f.flight_number,
  f.aircraft_type,
  dep.iata_code AS departure_iata,
  dep.city AS departure_city,
  arr.iata_code AS arrival_iata,
  arr.city AS arrival_city,
  f.scheduled_departure_utc,
  f.scheduled_arrival_utc,
  f.actual_departure_utc,
  f.actual_arrival_utc,
  f.status,
  f.distance_km,
  TIMESTAMPDIFF(MINUTE, f.scheduled_departure_utc, f.scheduled_arrival_utc) AS scheduled_duration_min,
  TIMESTAMPDIFF(MINUTE, f.actual_departure_utc, f.actual_arrival_utc) AS actual_duration_min
FROM flights f
JOIN airports dep ON dep.id = f.departure_airport_id
JOIN airports arr ON arr.id = f.arrival_airport_id;

-- One row per team–flight with team info and full flight details (uses v_flight_details).
CREATE VIEW v_team_flight_list AS
SELECT
  t.abbreviation AS team_abbreviation,
  t.name AS team_name,
  tf.role,
  tf.confidence,
  d.*
FROM team_flights tf
JOIN teams t ON t.id = tf.team_id
JOIN v_flight_details d ON d.flight_id = tf.flight_id;
