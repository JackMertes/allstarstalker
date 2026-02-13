-- View for active flights with entity information
CREATE OR REPLACE VIEW active_flights_view AS
SELECT 
    f.flight_id,
    f.flight_number,
    f.origin_airport,
    f.destination_airport,
    f.departure_time,
    f.estimated_arrival_time,
    f.flight_status,
    a.tail_number,
    a.aircraft_type,
    te.name AS entity_name,
    te.entity_type
FROM flight f
LEFT JOIN aircraft a ON f.aircraft_id = a.aircraft_id
LEFT JOIN entity_aircraft ea ON a.aircraft_id = ea.aircraft_id AND ea.is_active = TRUE
LEFT JOIN tracked_entity te ON ea.entity_id = te.entity_id
WHERE f.flight_status IN ('SCHEDULED', 'ACTIVE', 'DELAYED');

-- View for flight history with positions
CREATE OR REPLACE VIEW flight_history_view AS
SELECT 
    f.flight_id,
    f.flight_number,
    f.origin_airport,
    f.destination_airport,
    f.departure_time,
    f.arrival_time,
    f.flight_status,
    a.tail_number,
    COUNT(fp.position_id) AS position_count,
    MAX(fp.timestamp) AS last_position_time
FROM flight f
LEFT JOIN aircraft a ON f.aircraft_id = a.aircraft_id
LEFT JOIN flight_position fp ON f.flight_id = fp.flight_id
GROUP BY f.flight_id, f.flight_number, f.origin_airport, f.destination_airport,
         f.departure_time, f.arrival_time, f.flight_status, a.tail_number;