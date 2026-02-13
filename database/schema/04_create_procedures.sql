DELIMITER //

-- Procedure to clean old flight positions (keep last 7 days)
CREATE PROCEDURE cleanup_old_positions()
BEGIN
    DELETE FROM flight_position 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL 7 DAY);
END //

-- Procedure to clean old API logs (keep last 30 days)
CREATE PROCEDURE cleanup_old_api_logs()
BEGIN
    DELETE FROM api_request_log 
    WHERE request_timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
END //

-- Procedure to get flight statistics
CREATE PROCEDURE get_flight_statistics(
    IN start_date DATETIME,
    IN end_date DATETIME
)
BEGIN
    SELECT 
        COUNT(*) AS total_flights,
        COUNT(CASE WHEN flight_status = 'LANDED' THEN 1 END) AS landed,
        COUNT(CASE WHEN flight_status = 'ACTIVE' THEN 1 END) AS active,
        COUNT(CASE WHEN flight_status = 'CANCELLED' THEN 1 END) AS cancelled,
        COUNT(CASE WHEN flight_status = 'DELAYED' THEN 1 END) AS delayed
    FROM flight
    WHERE departure_time BETWEEN start_date AND end_date;
END //

DELIMITER ;