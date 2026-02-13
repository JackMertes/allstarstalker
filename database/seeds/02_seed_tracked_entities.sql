-- Insert sample tracked entities
INSERT INTO tracked_entity (name, entity_type, description) VALUES
('Taylor Swift', 'CELEBRITY', 'American singer-songwriter'),
('Amazon Inc', 'COMPANY', 'E-commerce and technology company'),
('Air Force One', 'GOVERNMENT', 'US Presidential aircraft'),
('SpaceX', 'COMPANY', 'Aerospace manufacturer'),
('Travis Kelce', 'CELEBRITY', 'NFL player');

-- Link entities to aircraft
INSERT INTO entity_aircraft (entity_id, aircraft_id, start_date, is_active) VALUES
(1, 1, '2023-01-01', TRUE),  -- Taylor Swift -> N628TS
(2, 2, '2022-06-01', TRUE),  -- Amazon -> N757AF
(3, 3, '2020-01-01', TRUE),  -- Air Force One -> N1KE
(4, 4, '2023-03-01', TRUE),  -- SpaceX -> N502CA
(5, 5, '2023-09-01', TRUE);  -- Travis Kelce -> N818AL