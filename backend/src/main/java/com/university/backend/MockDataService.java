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
        private final List<Map<String, Object>> teams = new ArrayList<>();

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
            // NBA Teams mock data
            teams.add(Map.of("team", "Atlanta Hawks", "callsign", "DAL8918", "category", "NBA"));
            teams.add(Map.of("team", "Boston Celtics", "callsign", "DAL8919", "category", "NBA"));
            teams.add(Map.of("team", "Brooklyn Nets", "callsign", "DAL8920", "category", "NBA"));
            teams.add(Map.of("team", "Charlotte Hornets", "callsign", "DAL8921", "category", "NBA"));
            teams.add(Map.of("team", "Chicago Bulls", "callsign", "DAL8922", "category", "NBA"));
            teams.add(Map.of("team", "Cleveland Cavaliers", "callsign", "DAL8923", "category", "NBA"));
            teams.add(Map.of("team", "Denver Nuggets", "callsign", "DAL8924", "category", "NBA"));
            teams.add(Map.of("team", "Detroit Pistons", "callsign", "DAL8925", "category", "NBA"));
            teams.add(Map.of("team", "Golden State Warriors", "callsign", "DAL8926", "category", "NBA"));
            teams.add(Map.of("team", "Indiana Pacers", "callsign", "DAL8927", "category", "NBA"));
            teams.add(Map.of("team", "Los Angeles Clippers", "callsign", "DAL8928", "category", "NBA"));
            teams.add(Map.of("team", "Los Angeles Lakers", "callsign", "DAL8929", "category", "NBA"));
            teams.add(Map.of("team", "Memphis Grizzlies", "callsign", "DAL8930", "category", "NBA"));
            teams.add(Map.of("team", "Miami Heat", "callsign", "DAL8931", "category", "NBA"));
            teams.add(Map.of("team", "Milwaukee Bucks", "callsign", "DAL8932", "category", "NBA"));
            teams.add(Map.of("team", "Minnesota Timberwolves", "callsign", "DAL8933", "category", "NBA"));
            teams.add(Map.of("team", "New Orleans Pelicans", "callsign", "DAL8934", "category", "NBA"));
            teams.add(Map.of("team", "New York Knicks", "callsign", "DAL8935", "category", "NBA"));
            teams.add(Map.of("team", "Oklahoma City Thunder", "callsign", "DAL8936", "category", "NBA"));
            teams.add(Map.of("team", "Orlando Magic", "callsign", "DAL8937", "category", "NBA"));
            teams.add(Map.of("team", "Philadelphia 76ers", "callsign", "DAL8938", "category", "NBA"));
            teams.add(Map.of("team", "Phoenix Suns", "callsign", "DAL8939", "category", "NBA"));
            teams.add(Map.of("team", "Portland Trail Blazers", "callsign", "DAL8940", "category", "NBA"));
            teams.add(Map.of("team", "Sacramento Kings", "callsign", "DAL8941", "category", "NBA"));
            teams.add(Map.of("team", "San Antonio Spurs", "callsign", "DAL8942", "category", "NBA"));
            teams.add(Map.of("team", "Toronto Raptors", "callsign", "DAL8943", "category", "NBA"));
            teams.add(Map.of("team", "Utah Jazz", "callsign", "DAL8944", "category", "NBA"));
            teams.add(Map.of("team", "Washington Wizards", "callsign", "DAL8945", "category", "NBA"));
    }

    public List<Map<String, Object>> getAllFlights() {
        return flights;
    }
    
        public List<Map<String, Object>> getTeams() {
            return teams;
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

    public List<Map<String, Object>> searchFlights(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return flights;
        }
        
        return flights.stream()
            .filter(f -> (f.get("flightNumber") != null && f.get("flightNumber").toString().toLowerCase().contains(searchTerm.toLowerCase())) ||
                 (f.get("tailNumber") != null && f.get("tailNumber").toString().toLowerCase().contains(searchTerm.toLowerCase())) ||
                 (f.get("status") != null && f.get("status").toString().toLowerCase().contains(searchTerm.toLowerCase())) ||
                 (f.get("flightId") != null && f.get("flightId").toString().contains(searchTerm)))
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