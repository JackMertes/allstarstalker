package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MockDataService {

    private final List<Map<String, Object>> flights = new ArrayList<>();
    private final List<Map<String, Object>> aircraft = new ArrayList<>();
    private final List<Map<String, Object>> userTrackings = new ArrayList<>();

    public MockDataService() {

        flights.add(Map.of(
                "flightId", 1,
                "flightNumber", "TS001",
                "tailNumber", "N628TS",
                "status", "ACTIVE"
        ));

        flights.add(Map.of(
                "flightId", 2,
                "flightNumber", "NK100",
                "tailNumber", "N1KE",
                "status", "ACTIVE"
        ));

        aircraft.add(Map.of(
                "aircraftId", 1,
                "tailNumber", "N628TS",
                "aircraftType", "Gulfstream G650"
        ));

        aircraft.add(Map.of(
                "aircraftId", 4,
                "tailNumber", "N1KE",
                "aircraftType", "Gulfstream G-V"
        ));

        userTrackings.add(Map.of(
            "trackingId", 1,
            "type", "entity",
            "entityId", 1,
            "entityName", "Taylor Swift_backend",
            "entityType", "CELEBRITY",
            "notificationEnabled", true,
            "createdAt", "2024-02-01T10:00:00"
        ));

        userTrackings.add(Map.of(
            "trackingId", 2,
            "type", "aircraft",
            "aircraftId", 4,
            "tailNumber", "N1KE",
            "aircraftType", "Gulfstream G-V_backend",
            "notificationEnabled", false,
            "createdAt", "2024-02-05T14:30:00"
        ));

        userTrackings.add(Map.of(
            "trackingId", 3,
            "type", "flight",
            "flightNumber", "AF1_backend",
            "notificationEnabled", true,
            "createdAt", "2024-02-10T08:15:00"
        ));

        userTrackings.add(Map.of(
            "trackingId", 4,
            "type", "entity",
            "entityId", 2,
            "entityName", "Scott Swanson_backend",
            "entityType", "TEACHING_FACULTY",
            "notificationEnabled", true,
            "createdAt", "2024-02-01T10:00:00"
        ));
    }

    public List<Map<String, Object>> getAllFlights() {
        return flights;
    }

    public Map<String, Object> getFlightById(String id) {
        return flights.stream()
                .filter(f -> f.get("flightId").toString().equals(id))
                .findFirst()
                .orElse(Map.of("error", "Flight not found"));
    }

    public List<Map<String, Object>> getActiveFlights() {
        return flights.stream()
                .filter(f -> "ACTIVE".equals(f.get("status")))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> searchFlights(String flightNumber) {
        if (flightNumber == null) return flights;

        return flights.stream()
                .filter(f -> f.get("flightNumber").toString().contains(flightNumber))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllAircraft() {
        return aircraft;
    }

    public Map<String, Object> getAircraftById(String id) {
        return aircraft.stream()
                .filter(a -> a.get("aircraftId").toString().equals(id))
                .findFirst()
                .orElse(Map.of("error", "Aircraft not found"));
    }

    public Map<String, Object> getAircraftByTail(String tail) {
        return aircraft.stream()
                .filter(a -> a.get("tailNumber").toString().equalsIgnoreCase(tail))
                .findFirst()
                .orElse(Map.of("error", "Aircraft not found"));
    }

    public List<Map<String, Object>> getUserTrackings() {
        return userTrackings;
    }
}