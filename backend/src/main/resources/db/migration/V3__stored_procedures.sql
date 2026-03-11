-- ============================================================
-- V3: Stored procedures for team flights and flight details.
-- Depends on V2 (views). DELIMITER $$ required for MySQL procedure body.
-- ============================================================

DELIMITER $$

-- Returns flights for a team (by abbreviation) with optional UTC date range filter.
CREATE PROCEDURE sp_get_team_flights(
  IN p_team_abbrev VARCHAR(8),
  IN p_start_utc DATETIME,
  IN p_end_utc DATETIME
)
BEGIN
  SELECT *
  FROM v_team_flight_list
  WHERE team_abbreviation = p_team_abbrev
    AND (p_start_utc IS NULL OR scheduled_departure_utc >= p_start_utc)
    AND (p_end_utc IS NULL OR scheduled_departure_utc < p_end_utc)
  ORDER BY scheduled_departure_utc DESC;
END$$

-- Returns a single flight’s details by flight id (from v_flight_details).
CREATE PROCEDURE sp_get_flight_details(IN p_flight_id BIGINT)
BEGIN
  SELECT * FROM v_flight_details WHERE flight_id = p_flight_id;
END$$

DELIMITER ;
