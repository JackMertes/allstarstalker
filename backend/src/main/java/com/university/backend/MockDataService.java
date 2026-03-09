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
    private final Map<String, Map<String, Object>> statusData = new HashMap<>();

    public MockDataService() {
    System.out.println("MockDataService constructor started");

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

        {
            Map<String, Object> ut1 = new HashMap<>();
            ut1.put("trackingId", "1");
            ut1.put("callsign", "DAL8924");
            ut1.put("team", "Denver Nuggets (back-end)");
            ut1.put("category", "NBA");
            ut1.put("type", "team");
            ut1.put("notificationEnabled", true);
            ut1.put("createdAt", "2024-02-01T10:00:00");
            userTrackings.add(ut1);
        }
        {
            Map<String, Object> ut2 = new HashMap<>();
            ut2.put("trackingId", "2");
            ut2.put("callsign", "DAL9001");
            ut2.put("team", "Dallas Cowboys (back-end)");
            ut2.put("category", "NFL");
            ut2.put("type", "team");
            ut2.put("notificationEnabled", false);
            ut2.put("createdAt", "2024-02-05T14:30:00");
            userTrackings.add(ut2);
        }
        {
            Map<String, Object> ut3 = new HashMap<>();
            ut3.put("trackingId", "3");
            ut3.put("callsign", "DAL8918");
            ut3.put("team", "Atlanta Hawks (back-end)");
            ut3.put("category", "NBA");
            ut3.put("type", "team");
            ut3.put("notificationEnabled", true);
            ut3.put("createdAt", "2024-02-10T08:15:00");
            userTrackings.add(ut3);
        }


            // NBA Teams mock data
            teams.add(Map.of("team", "Atlanta Hawks", "callsign", "DAL8918", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Boston Celtics", "callsign", "DAL8919", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Brooklyn Nets", "callsign", "DAL8920", "category", "NBA","status", "ACTIVE"));
            teams.add(Map.of("team", "Charlotte Hornets", "callsign", "DAL8921", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Chicago Bulls", "callsign", "DAL8922", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Cleveland Cavaliers", "callsign", "DAL8923", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Denver Nuggets", "callsign", "DAL8924", "category", "NBA","status", "ACTIVE"));
            teams.add(Map.of("team", "Detroit Pistons", "callsign", "DAL8925", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Golden State Warriors", "callsign", "DAL8926", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Indiana Pacers", "callsign", "DAL8927", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Los Angeles Clippers", "callsign", "DAL8928", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Los Angeles Lakers", "callsign", "DAL8929", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Memphis Grizzlies", "callsign", "DAL8930", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Miami Heat", "callsign", "DAL8931", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Milwaukee Bucks", "callsign", "DAL8932", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Minnesota Timberwolves", "callsign", "DAL8933", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "New Orleans Pelicans", "callsign", "DAL8934", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "New York Knicks", "callsign", "DAL8935", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Oklahoma City Thunder", "callsign", "DAL8936", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Orlando Magic", "callsign", "DAL8937", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Philadelphia 76ers", "callsign", "DAL8938", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Phoenix Suns", "callsign", "DAL8939", "category","NBA","status", "LANDED"));
            teams.add(Map.of("team", "Portland Trail Blazers", "callsign", "DAL8940", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Sacramento Kings", "callsign", "DAL8941", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "San Antonio Spurs", "callsign", "DAL8942", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Toronto Raptors", "callsign", "DAL8943 ", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Utah Jazz", "callsign", "DAL8944", "category", "NBA","status", "LANDED"));
            teams.add(Map.of("team", "Washington Wizards", "callsign", "DAL8945", "category", "NBA","status", "LANDED"));
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

    public Map<String, Object> getStatusByCallsign(String callsign) {
        return statusData.get(callsign);
    }
    // Helper methods for large nested maps
    private Map<String, Object> createDAL8924Raw() {
            System.out.println("createDAL8924Raw called");
        Map<String, Object> ac = new HashMap<>();
        ac.put("hex", "a8bbff");
        ac.put("type", "adsb_icao");
        ac.put("flight", "DAL8924 ");
        ac.put("r", "N662DN");
        ac.put("t", "B752");
        ac.put("desc", "BOEING 757-200");
        ac.put("ownOp", "BANK OF UTAH TRUSTEE");
        ac.put("year", "1991");
        ac.put("alt_baro", 33000);
        ac.put("alt_geom", 33500);
        ac.put("gs", 559.9);
        ac.put("track", 125.99);
        ac.put("baro_rate", 64);
        ac.put("squawk", "2722");
        ac.put("emergency", "none");
        ac.put("category", "A4");
        ac.put("nav_qnh", 1013.6);
        ac.put("nav_altitude_mcp", 32992);
        ac.put("nav_heading", 113.20);
        ac.put("lat", 37.729844);
        ac.put("lon", -102.776443);
        ac.put("nic", 8);
        ac.put("rc", 186);
        ac.put("seen_pos", 0.289);
        ac.put("version", 2);
        ac.put("nic_baro", 1);
        ac.put("nac_p", 10);
        ac.put("nac_v", 2);
        ac.put("sil", 3);
        ac.put("sil_type", "perhour");
        ac.put("gva", 2);
        ac.put("sda", 2);
        ac.put("alert", 0);
        ac.put("spi", 0);
        ac.put("mlat", List.of());
        ac.put("tisb", List.of());
        ac.put("messages", 40013);
        ac.put("seen", 0.2);
        ac.put("rssi", -22.3);
        Map<String, Object> raw = new HashMap<>();
        raw.put("ac", List.of(ac));
        raw.put("msg", "No error");
        raw.put("now", 1772142652001L);
        raw.put("total", 1);
        raw.put("ctime", 1772142652001L);
        raw.put("ptime", 0);
        return raw;
    }

    private Map<String, Object> createDAL8931Raw() {
            System.out.println("createDAL8931Raw called");
            System.out.println("MockDataService constructor finished");
        Map<String, Object> ac = new HashMap<>();
        ac.put("hex", "a8cadb");
        ac.put("type", "adsb_icao");
        ac.put("flight", "DAL8931 ");
        ac.put("r", "N666DN");
        ac.put("t", "B752");
        ac.put("desc", "BOEING 757-200");
        ac.put("ownOp", "BANK OF UTAH TRUSTEE");
        ac.put("year", "1991");
        ac.put("alt_baro", 13025);
        ac.put("alt_geom", 12350);
        ac.put("gs", 404.0);
        ac.put("track", 100.70);
        ac.put("baro_rate", -1536);
        ac.put("squawk", "5624");
        ac.put("emergency", "none");
        ac.put("category", "A4");
        ac.put("nav_qnh", 1004.0);
        ac.put("nav_altitude_mcp", 8000);
        ac.put("nav_heading", 111.80);
        ac.put("lat", 40.148026);
        ac.put("lon", -76.207092);
        ac.put("nic", 8);
        ac.put("rc", 186);
        ac.put("seen_pos", 0.003);
        ac.put("version", 2);
        ac.put("nic_baro", 1);
        ac.put("nac_p", 10);
        ac.put("nac_v", 2);
        ac.put("sil", 3);
        ac.put("sil_type", "perhour");
        ac.put("gva", 2);
        ac.put("sda", 2);
        ac.put("alert", 0);
        ac.put("spi", 0);
        ac.put("mlat", List.of());
        ac.put("tisb", List.of());
        ac.put("messages", 132448);
        ac.put("seen", 0.0);
        ac.put("rssi", -7.4);
        Map<String, Object> raw = new HashMap<>();
        raw.put("ac", List.of(ac));
        raw.put("msg", "No error");
        raw.put("now", 1772046629001L);
        raw.put("total", 1);
        raw.put("ctime", 1772046629001L);
        raw.put("ptime", 0);
        return raw;
    }
}