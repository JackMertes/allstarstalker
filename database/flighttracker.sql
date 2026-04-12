-- ============================================================
-- NBA Team Flight Tracker - FULL CLEAN INIT FILE
-- Idempotent (safe to rerun)
-- MySQL 8+
-- ============================================================

CREATE DATABASE IF NOT EXISTS nba_flight_tracker -- create database if it does not already exist
  DEFAULT CHARACTER SET utf8mb4 -- use full Unicode support
  DEFAULT COLLATE utf8mb4_0900_ai_ci; -- case-insensitive sorting/comparison

USE nba_flight_tracker; -- switch to this database so all following objects are created here

-- ============================================================
-- DROP (ORDER MATTERS)
-- ============================================================

DROP PROCEDURE IF EXISTS sp_get_team_flights; -- remove stored procedure if it exists
DROP PROCEDURE IF EXISTS sp_get_flight_details; -- remove stored procedure if it exists

DROP VIEW IF EXISTS v_team_flight_list; -- drop view so it can be recreated
DROP VIEW IF EXISTS v_flight_details; -- drop view so it can be recreated

DROP TABLE IF EXISTS flight_positions; -- drop tables starting with those that depend on others
DROP TABLE IF EXISTS ingestion_events;
DROP TABLE IF EXISTS data_sources;
DROP TABLE IF EXISTS team_flights;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS tracked_items; -- tracked_items can be dropped before teams since it has no FK to teams
DROP TABLE IF EXISTS teams; -- parent tables dropped last

-- ============================================================
-- TRACKED ITEMS (user tracking list)
-- ============================================================

CREATE TABLE tracked_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- unique tracked item ID
  user_id BIGINT UNSIGNED, -- dummy column for future user support
  team VARCHAR(80),
  callsign VARCHAR(16),
  notification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TEAMS
-- ============================================================

CREATE TABLE teams (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- internal unique identifier
  nba_team_id VARCHAR(32), -- optional external ID (from NBA API or other source)
  name VARCHAR(80) NOT NULL, -- full team name
  abbreviation VARCHAR(8) NOT NULL, -- short team code (MIL, LAL, etc)
  city VARCHAR(80) NOT NULL, -- home city
  conference ENUM('East','West'), -- NBA conference
  division VARCHAR(40), -- NBA division
  callsign VARCHAR(16) NULL, -- charter aircraft callsign often associated with team
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- when row was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- last update time
  UNIQUE KEY uq_team_abbrev (abbreviation), -- ensure each abbreviation is unique
  UNIQUE KEY uq_team_name (name), -- ensure team names are unique
  UNIQUE KEY uq_team_callsign (callsign) -- prevent duplicate callsigns
) ENGINE=InnoDB; -- InnoDB supports transactions and foreign keys

-- ============================================================
-- AIRPORTS
-- ============================================================

CREATE TABLE airports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- internal airport ID
  iata_code CHAR(3) NOT NULL, -- 3-letter airport code (LAX, MKE)
  icao_code CHAR(4), -- 4-letter ICAO airport code
  name VARCHAR(120), -- airport name
  city VARCHAR(80), -- city where airport is located
  region VARCHAR(80), -- state/region
  country VARCHAR(80), -- country
  latitude DECIMAL(9,6), -- geographic latitude
  longitude DECIMAL(9,6), -- geographic longitude
  timezone VARCHAR(64), -- airport timezone
  UNIQUE KEY uq_airport_iata (iata_code) -- prevent duplicate IATA codes
) ENGINE=InnoDB;

-- ============================================================
-- FLIGHTS
-- ============================================================

CREATE TABLE flights (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- internal flight ID
  external_flight_id VARCHAR(64), -- ID from external tracking service
  tail_number VARCHAR(16), -- aircraft registration number
  callsign VARCHAR(16), -- radio callsign used by aircraft
  airline_icao CHAR(3), -- ICAO airline code
  flight_number VARCHAR(16), -- flight number
  aircraft_type VARCHAR(16), -- aircraft model/type
  departure_airport_id BIGINT UNSIGNED NULL, -- FK reference to departure airport
  arrival_airport_id BIGINT UNSIGNED NULL, -- FK reference to arrival airport

  scheduled_departure_utc DATETIME, -- scheduled departure time (UTC)
  scheduled_arrival_utc DATETIME, -- scheduled arrival time (UTC)
  actual_departure_utc DATETIME, -- actual departure time
  actual_arrival_utc DATETIME, -- actual arrival time

  status ENUM('SCHEDULED','ACTIVE','LANDED','CANCELLED','DIVERTED','UNKNOWN')
         DEFAULT 'UNKNOWN', -- flight status

  live_updated_utc DATETIME(3) NULL, -- last time live tracking updated
  live_latitude DECIMAL(9,6) NULL, -- current latitude
  live_longitude DECIMAL(9,6) NULL, -- current longitude
  live_altitude_ft INT NULL, -- current altitude in feet
  live_ground_speed_kt DECIMAL(8,1) NULL, -- ground speed in knots
  live_heading_deg DECIMAL(6,2) NULL, -- aircraft heading in degrees
  last_seen_utc DATETIME(3) NULL, -- last time aircraft was detected

  distance_km DECIMAL(8,2), -- route distance
  duration_minutes INT, -- flight duration
  notes VARCHAR(255), -- optional notes

  UNIQUE KEY uq_external (external_flight_id), -- prevent duplicate external IDs
  UNIQUE KEY uq_callsign (callsign), -- prevent duplicate callsigns

  KEY idx_dep_time (departure_airport_id, scheduled_departure_utc), -- index for departure searches
  KEY idx_arr_time (arrival_airport_id, scheduled_arrival_utc), -- index for arrival searches

  CONSTRAINT fk_dep_airport FOREIGN KEY (departure_airport_id) REFERENCES airports(id) ON DELETE SET NULL, -- if airport deleted set field NULL
  CONSTRAINT fk_arr_airport FOREIGN KEY (arrival_airport_id) REFERENCES airports(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- TEAM_FLIGHTS
-- ============================================================

CREATE TABLE team_flights (
  team_id BIGINT UNSIGNED, -- reference to teams.id
  flight_id BIGINT UNSIGNED, -- reference to flights.id
  role ENUM('TEAM_CHARTER','SHARED_CHARTER','UNKNOWN') DEFAULT 'TEAM_CHARTER', -- type of charter relationship
  confidence TINYINT UNSIGNED, -- confidence score of match
  PRIMARY KEY (team_id, flight_id), -- composite primary key
  CONSTRAINT fk_tf_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE, -- delete mapping if team deleted
  CONSTRAINT fk_tf_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE -- delete mapping if flight deleted
) ENGINE=InnoDB;

-- ============================================================
-- FLIGHT_POSITIONS
-- ============================================================

CREATE TABLE flight_positions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- unique position record ID
  flight_id BIGINT UNSIGNED NOT NULL, -- flight this position belongs to
  position_utc DATETIME NOT NULL, -- timestamp of position
  latitude DECIMAL(9,6) NOT NULL, -- latitude coordinate
  longitude DECIMAL(9,6) NOT NULL, -- longitude coordinate
  altitude_ft INT, -- altitude at this point
  ground_speed_kt INT, -- speed at this point
  heading_deg SMALLINT, -- aircraft heading
  KEY idx_pos (flight_id, position_utc), -- index for efficient position lookups
  CONSTRAINT fk_pos_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE -- delete positions if flight deleted
) ENGINE=InnoDB;

-- ============================================================
-- DATA SOURCES + INGESTION
-- ============================================================

CREATE TABLE data_sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- source ID
  name VARCHAR(60) UNIQUE -- name of the data provider
) ENGINE=InnoDB;

CREATE TABLE ingestion_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- ingestion event ID
  data_source_id BIGINT UNSIGNED, -- FK to data_sources
  external_id VARCHAR(128), -- event identifier from source
  payload_json JSON, -- raw JSON payload stored for debugging/audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ingestion timestamp
  CONSTRAINT fk_ingest_source FOREIGN KEY (data_source_id) REFERENCES data_sources(id) -- enforce valid source
) ENGINE=InnoDB;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW v_flight_details AS -- view combining flights with airport info
SELECT
  f.id AS flight_id, -- rename ID for clarity
  f.external_flight_id,
  f.tail_number,
  f.callsign,
  f.flight_number,
  f.aircraft_type,

  dep.iata_code AS departure_iata, -- departure airport code
  dep.city AS departure_city,
  arr.iata_code AS arrival_iata, -- arrival airport code
  arr.city AS arrival_city,

  f.scheduled_departure_utc,
  f.scheduled_arrival_utc,
  f.actual_departure_utc,
  f.actual_arrival_utc,
  f.status,
  f.distance_km,

  f.live_updated_utc,
  f.live_latitude,
  f.live_longitude,
  f.live_altitude_ft,
  f.live_ground_speed_kt,
  f.live_heading_deg,
  f.last_seen_utc,

  TIMESTAMPDIFF(MINUTE, f.scheduled_departure_utc, f.scheduled_arrival_utc) AS scheduled_duration_min, -- calculated scheduled duration
  TIMESTAMPDIFF(MINUTE, f.actual_departure_utc, f.actual_arrival_utc) AS actual_duration_min -- calculated real duration

FROM flights f
LEFT JOIN airports dep ON dep.id = f.departure_airport_id -- join departure airport
LEFT JOIN airports arr ON arr.id = f.arrival_airport_id; -- join arrival airport

CREATE VIEW v_team_flight_list AS -- view showing flights associated with teams
SELECT
  t.abbreviation AS team_abbreviation,
  t.name AS team_name,
  tf.role,
  tf.confidence,
  d.*
FROM team_flights tf
JOIN teams t ON t.id = tf.team_id -- join team info
JOIN v_flight_details d ON d.flight_id = tf.flight_id; -- join flight info

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$ -- change delimiter so procedures can contain semicolons

CREATE PROCEDURE sp_get_team_flights(
  IN p_team_abbrev VARCHAR(8), -- input team abbreviation
  IN p_start_utc DATETIME, -- optional start date filter
  IN p_end_utc DATETIME -- optional end date filter
)
BEGIN
  SELECT *
  FROM v_team_flight_list
  WHERE team_abbreviation = p_team_abbrev
    AND (p_start_utc IS NULL OR scheduled_departure_utc >= p_start_utc) -- apply start filter if provided
    AND (p_end_utc IS NULL OR scheduled_departure_utc < p_end_utc) -- apply end filter if provided
  ORDER BY scheduled_departure_utc DESC; -- newest flights first
END$$

CREATE PROCEDURE sp_get_flight_details(IN p_flight_id BIGINT) -- return details for a single flight
BEGIN
  SELECT * FROM v_flight_details WHERE flight_id = p_flight_id;
END$$

DELIMITER ; -- restore normal SQL delimiter

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO teams (nba_team_id, name, abbreviation, city, conference, callsign)
VALUES
('ATL','Atlanta Hawks','ATL','Atlanta','East','DAL8918'),
('BOS','Boston Celtics','BOS','Boston','East','DAL8919'),
('BKN','Brooklyn Nets','BKN','Brooklyn','East','DAL8920'),
('CHA','Charlotte Hornets','CHA','Charlotte','East','DAL8921'),
('CHI','Chicago Bulls','CHI','Chicago','East','DAL8922'),
('CLE','Cleveland Cavaliers','CLE','Cleveland','East','DAL8923'),
('DEN','Denver Nuggets','DEN','Denver','West','DAL8924'),
('DET','Detroit Pistons','DET','Detroit','East','DAL8925'),
('GSW','Golden State Warriors','GSW','San Francisco','West','DAL8926'),
('IND','Indiana Pacers','IND','Indianapolis','East','DAL8927'),
('LAC','Los Angeles Clippers','LAC','Los Angeles','West','DAL8928'),
('LAL','Los Angeles Lakers','LAL','Los Angeles','West','DAL8929'),
('MEM','Memphis Grizzlies','MEM','Memphis','West','DAL8930'),
('MIA','Miami Heat','MIA','Miami','East','DAL8931'),
('MIL','Milwaukee Bucks','MIL','Milwaukee','East','DAL8932'),
('MIN','Minnesota Timberwolves','MIN','Minneapolis','West','DAL8933'),
('NOP','New Orleans Pelicans','NOP','New Orleans','West','DAL8934'),
('NYK','New York Knicks','NYK','New York','East','DAL8935'),
('OKC','Oklahoma City Thunder','OKC','Oklahoma City','West','DAL8936'),
('ORL','Orlando Magic','ORL','Orlando','East','DAL8937'),
('PHI','Philadelphia 76ers','PHI','Philadelphia','East','DAL8938'),
('PHX','Phoenix Suns','PHX','Phoenix','West','DAL8939'),
('POR','Portland Trail Blazers','POR','Portland','West','DAL8940'),
('SAC','Sacramento Kings','SAC','Sacramento','West','DAL8941'),
('SAS','San Antonio Spurs','SAS','San Antonio','West','DAL8942'),
('TOR','Toronto Raptors','TOR','Toronto','East','DAL8943'),
('UTA','Utah Jazz','UTA','Salt Lake City','West','DAL8944'),
('WAS','Washington Wizards','WAS','Washington','East','DAL8945')
ON DUPLICATE KEY UPDATE callsign = VALUES(callsign); -- if row exists update callsign

INSERT INTO airports (iata_code, name, city, country)
VALUES
('MKE','Milwaukee Mitchell Intl','Milwaukee','US'),
('SFO','San Francisco Intl','San Francisco','US'),
('LAX','Los Angeles Intl','Los Angeles','US');

INSERT INTO flights (
external_flight_id, departure_airport_id, arrival_airport_id,
scheduled_departure_utc, scheduled_arrival_utc, status)
SELECT 'demo1', d.id, a.id, '2026-02-26 01:00:00', '2026-02-26 04:00:00','SCHEDULED'
FROM airports d JOIN airports a WHERE d.iata_code='MKE' AND a.iata_code='SFO'; -- insert demo flight MKE→SFO

INSERT INTO team_flights
SELECT t.id, f.id, 'TEAM_CHARTER', 95
FROM teams t JOIN flights f
WHERE t.abbreviation='MIL' AND f.external_flight_id='demo1'; -- link demo flight to Milwaukee Bucks

INSERT INTO tracked_items (user_id, team, callsign, notification_enabled)
VALUES
  (1, 'Milwaukee Bucks', 'DAL8932', TRUE),
  (1, 'Boston Celtics', 'DAL8919', TRUE),
  (2, 'Los Angeles Lakers', 'DAL8929', FALSE),
  (2, 'Golden State Warriors', 'DAL8926', TRUE);
-- ============================================================
-- DONE
-- ============================================================