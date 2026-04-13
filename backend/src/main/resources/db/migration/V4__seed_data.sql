-- ============================================================
-- V4: Initial seed data for development/demo.
-- Depends on V1 (tables). Safe to run once; Flyway records it in flyway_schema_history.
-- ============================================================

-- Seed all NBA teams.
INSERT INTO teams (nba_team_id, name, abbreviation, city, conference)
VALUES
('ATL','Atlanta Hawks','ATL','Atlanta','East'),
('BOS','Boston Celtics','BOS','Boston','East'),
('BKN','Brooklyn Nets','BKN','Brooklyn','East'),
('CHA','Charlotte Hornets','CHA','Charlotte','East'),
('CHI','Chicago Bulls','CHI','Chicago','East'),
('CLE','Cleveland Cavaliers','CLE','Cleveland','East'),
('DEN','Denver Nuggets','DEN','Denver','West'),
('DET','Detroit Pistons','DET','Detroit','East'),
('GSW','Golden State Warriors','GSW','San Francisco','West'),
('IND','Indiana Pacers','IND','Indianapolis','East'),
('LAC','Los Angeles Clippers','LAC','Los Angeles','West'),
('LAL','Los Angeles Lakers','LAL','Los Angeles','West'),
('MEM','Memphis Grizzlies','MEM','Memphis','West'),
('MIA','Miami Heat','MIA','Miami','East'),
('MIL','Milwaukee Bucks','MIL','Milwaukee','East'),
('MIN','Minnesota Timberwolves','MIN','Minneapolis','West'),
('NOP','New Orleans Pelicans','NOP','New Orleans','West'),
('NYK','New York Knicks','NYK','New York','East'),
('OKC','Oklahoma City Thunder','OKC','Oklahoma City','West'),
('ORL','Orlando Magic','ORL','Orlando','East'),
('PHI','Philadelphia 76ers','PHI','Philadelphia','East'),
('PHX','Phoenix Suns','PHX','Phoenix','West'),
('POR','Portland Trail Blazers','POR','Portland','West'),
('SAC','Sacramento Kings','SAC','Sacramento','West'),
('SAS','San Antonio Spurs','SAS','San Antonio','West'),
('TOR','Toronto Raptors','TOR','Toronto','East'),
('UTA','Utah Jazz','UTA','Salt Lake City','West'),
('WAS','Washington Wizards','WAS','Washington','East')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  city = VALUES(city),
  conference = VALUES(conference);

-- Populate callsigns when teams.callsign exists (some schemas add this in later versions).
SET @has_callsign := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'teams'
    AND COLUMN_NAME = 'callsign'
);
SET @callsign_sql := IF(
  @has_callsign > 0,
  "UPDATE teams SET callsign = CASE abbreviation
    WHEN 'ATL' THEN 'DAL8918'
    WHEN 'BOS' THEN 'DAL8919'
    WHEN 'BKN' THEN 'DAL8920'
    WHEN 'CHA' THEN 'DAL8921'
    WHEN 'CHI' THEN 'DAL8922'
    WHEN 'CLE' THEN 'DAL8923'
    WHEN 'DEN' THEN 'DAL8924'
    WHEN 'DET' THEN 'DAL8925'
    WHEN 'GSW' THEN 'DAL8926'
    WHEN 'IND' THEN 'DAL8927'
    WHEN 'LAC' THEN 'DAL8928'
    WHEN 'LAL' THEN 'DAL8929'
    WHEN 'MEM' THEN 'DAL8930'
    WHEN 'MIA' THEN 'DAL8931'
    WHEN 'MIL' THEN 'DAL8932'
    WHEN 'MIN' THEN 'DAL8933'
    WHEN 'NOP' THEN 'DAL8934'
    WHEN 'NYK' THEN 'DAL8935'
    WHEN 'OKC' THEN 'DAL8936'
    WHEN 'ORL' THEN 'DAL8937'
    WHEN 'PHI' THEN 'DAL8938'
    WHEN 'PHX' THEN 'DAL8939'
    WHEN 'POR' THEN 'DAL8940'
    WHEN 'SAC' THEN 'DAL8941'
    WHEN 'SAS' THEN 'DAL8942'
    WHEN 'TOR' THEN 'DAL8943'
    WHEN 'UTA' THEN 'DAL8944'
    WHEN 'WAS' THEN 'DAL8945'
    ELSE callsign END
   WHERE abbreviation IN (
    'ATL','BOS','BKN','CHA','CHI','CLE','DEN','DET','GSW','IND',
    'LAC','LAL','MEM','MIA','MIL','MIN','NOP','NYK','OKC','ORL',
    'PHI','PHX','POR','SAC','SAS','TOR','UTA','WAS'
   )",
  "SELECT 1"
);
PREPARE callsign_stmt FROM @callsign_sql;
EXECUTE callsign_stmt;
DEALLOCATE PREPARE callsign_stmt;

-- Three airports (MKE, SFO, LAX) for demo flight.
INSERT INTO airports (iata_code, name, city, country)
VALUES
('MKE','Milwaukee Mitchell Intl','Milwaukee','US'),
('SFO','San Francisco Intl','San Francisco','US'),
('LAX','Los Angeles Intl','Los Angeles','US')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  city = VALUES(city),
  country = VALUES(country);

-- One demo flight: MKE -> SFO, scheduled 2026-02-26.
INSERT INTO flights (
  external_flight_id, departure_airport_id, arrival_airport_id,
  scheduled_departure_utc, scheduled_arrival_utc, status)
SELECT 'demo1', d.id, a.id, '2026-02-26 01:00:00', '2026-02-26 04:00:00', 'SCHEDULED'
FROM airports d JOIN airports a WHERE d.iata_code='MKE' AND a.iata_code='SFO'
ON DUPLICATE KEY UPDATE
  scheduled_departure_utc = VALUES(scheduled_departure_utc),
  scheduled_arrival_utc = VALUES(scheduled_arrival_utc),
  status = VALUES(status);

-- Link MIL to the demo flight as TEAM_CHARTER (confidence 95).
INSERT INTO team_flights (team_id, flight_id, role, confidence)
SELECT t.id, f.id, 'TEAM_CHARTER', 95
FROM teams t JOIN flights f
WHERE t.abbreviation='MIL' AND f.external_flight_id='demo1'
ON DUPLICATE KEY UPDATE
  role = VALUES(role),
  confidence = VALUES(confidence);
