package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Directs HTTP requests to "/api/teams/..." to the proper endpoints
 * Services in this module respond to GET requests.
 */
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamRepository repo;
    private final FlightRepository flightRepo;
    private final AirportRepository airportRepo;

    public TeamController(TeamRepository repo, FlightRepository flightRepo, AirportRepository airportRepo) {
        this.repo = repo;
        this.flightRepo = flightRepo;
        this.airportRepo = airportRepo;
    }

    protected static String formatAirport(Airport a) {
        if (a == null) {
            return null;
        }
        String iata = a.getIataCode();
        String city = a.getCity();
        if (city != null && !city.isBlank() && iata != null && !iata.isBlank()) {
            return city + " (" + iata + ")";
        }
        if (iata != null && !iata.isBlank()) {
            return iata;
        }
        return a.getName() != null ? a.getName() : "";
    }

    protected String airportLabel(Long airportId) {
        if (airportId == null) {
            return null;
        }
        Optional<Airport> ap = airportRepo.findById(airportId);
        return ap.map(TeamController::formatAirport).filter(s -> !s.isEmpty()).orElse(null);
    }

    /** Ingestion does not populate airport IDs; use live position from Airplanes.live when present. */
    protected static String formatLivePosition(BigDecimal lat, BigDecimal lon) {
        if (lat == null || lon == null) {
            return null;
        }
        return String.format("%.4f°, %.4f°", lat.doubleValue(), lon.doubleValue());
    }

    protected static boolean hasLocationLine(Map<String, String> row) {
        String o = row.get("origin");
        String d = row.get("destination");
        return (o != null && !o.isBlank()) || (d != null && !d.isBlank());
    }

    /**
     * Handles GET requests to "/api/teams/flying" and returns only teams with an ACTIVE flight.
     * Uses the same shape as /api/teams so the frontend can render TeamCards directly.
     *
     * @return ResponseEntity<?> holding a status code and encapsulated body
     */
    @GetMapping("/flying")
    public ResponseEntity<List<Map<String, String>>> getFlyingTeams() {
        List<Flight> activeFlights = flightRepo.findByStatus("ACTIVE");
        if (activeFlights.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Map<String, String>> teamMappings = new ArrayList<>();

        for (Flight f : activeFlights) {
            Optional<Team> teamOpt = (f.getCallsign() != null && !f.getCallsign().isBlank())
                    ? repo.findByCallsign(f.getCallsign().trim())
                    : Optional.empty();
            if (teamOpt.isEmpty()) continue;

            Team t = teamOpt.get();
            Map<String, String> row = new HashMap<>();
            row.put("teamName", t.getName());
            row.put("teamId", t.getNbaTeamId());
            row.put("division", t.getDivision());
            row.put("city", t.getCity());
            row.put("callSign", f.getCallsign());
            row.put("status", "ACTIVE");

            if (f.getAircraftType() != null && !f.getAircraftType().isBlank()) {
                row.put("aircraftType", f.getAircraftType());
            }

            String origin = airportLabel(f.getDepartureAirportId());
            String dest   = airportLabel(f.getArrivalAirportId());
            if (origin != null) row.put("origin", origin);
            if (dest   != null) row.put("destination", dest);

            if (origin == null && dest == null) {
                String pos = formatLivePosition(f.getLiveLatitude(), f.getLiveLongitude());
                if (pos != null) row.put("origin", "In flight · " + pos);
            }

            teamMappings.add(row);
        }

        return ResponseEntity.ok(teamMappings);
    }

    /**
     * Handles GET requests to "/api/teams" and provides a ResonseEntity
     * encapsulating a list where each member is the mapped data of a team.
     * 
     * @return RespnseEntity<?> holding a status code and encapsulated body
     */
    @GetMapping("")
    public ResponseEntity<List<Map<String, String>>> getTeams() {
        // all flights from FlightRepository,
        List<Team> teams = repo.findAll();
        if (teams.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Map<String, String>> teamMappings = new ArrayList<>();

        for (Team t : teams) {
            final Map<String, String> teamDataSet = new HashMap<>();
            teamDataSet.put("teamName", t.getName());
            teamDataSet.put("teamId", t.getNbaTeamId());
            teamDataSet.put("division", t.getDivision());
            teamDataSet.put("city", t.getCity());
            teamDataSet.put("callSign", t.getCallsign());

            String cs = t.getCallsign();
            Optional<Flight> flightOpt = (cs != null && !cs.isBlank())
                    ? flightRepo.findByCallsign(cs.trim())
                    : Optional.empty();

            flightOpt.ifPresent(f -> {
                if (f.getStatus() != null) {
                    String status = f.getStatus();
                    // Distinguish "not flying but has last known position" from "truly no data"
                    boolean hasPosition = f.getLiveLatitude() != null && f.getLiveLongitude() != null;
                    if ("UNKNOWN".equals(status) && hasPosition) {
                        status = "NOT_FLYING";
                    }
                    teamDataSet.put("status", status);
                }
                String origin = airportLabel(f.getDepartureAirportId());
                String dest = airportLabel(f.getArrivalAirportId());
                if (origin != null) {
                    teamDataSet.put("origin", origin);
                }
                if (dest != null) {
                    teamDataSet.put("destination", dest);
                }
                if (f.getAircraftType() != null && !f.getAircraftType().isBlank()) {
                    teamDataSet.put("aircraftType", f.getAircraftType());
                }
            });

            if (!hasLocationLine(teamDataSet)) {
                flightOpt.ifPresent(f -> {
                    String pos = formatLivePosition(f.getLiveLatitude(), f.getLiveLongitude());
                    if (pos != null) {
                        boolean airborne = "ACTIVE".equals(f.getStatus());
                        teamDataSet.put("origin", airborne ? ("In flight · " + pos) : ("Last position · " + pos));
                    }
                });
            }

            if (!hasLocationLine(teamDataSet)) {
                String home = t.getCity();
                if (home != null && !home.isBlank()) {
                    teamDataSet.put("origin", "Home city · " + home);
                }
            }

            teamMappings.add(teamDataSet);
        }
        // encapsulate list of team mappings into a response body, with code 200 
        return ResponseEntity.ok(teamMappings);
    }
}
