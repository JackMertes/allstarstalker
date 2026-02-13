-- Insert sample flight data
INSERT INTO flight (flight_number, aircraft_id, origin_airport, destination_airport, 
                   departure_time, estimated_arrival_time, flight_status) VALUES
('TS001', 1, 'LAX', 'JFK', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW(), 'ACTIVE'),
('AMZ123', 2, 'SEA', 'IAD', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 20 HOUR), 'LANDED'),
('AF1', 3, 'JBA', 'LAX', NOW(), DATE_ADD(NOW(), INTERVAL 5 HOUR), 'SCHEDULED');