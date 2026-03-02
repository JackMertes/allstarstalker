package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final RestTemplate restTemplate;
    private final MockDataService mock;

    public FlightController(RestTemplate restTemplate, MockDataService mock) {
        this.restTemplate = restTemplate;
        this.mock = mock;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllFlights() {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/flights",
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAllFlights());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String searchTerm) {
        try {
            String url = "https://allanswers.com/api/flights/search";
            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                url += "?searchTerm=" + searchTerm;
            }
            return restTemplate.getForEntity(url, Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.searchFlights(searchTerm));
        }
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<?> getByFlightID(@PathVariable String flightId) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/flights/" + flightId,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getFlightById(flightId));
        }
    }

    @GetMapping("/{flightId}/details")
    public ResponseEntity<?> getDetails(@PathVariable String flightId) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/flights/" + flightId + "/details",
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getFlightById(flightId));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActive() {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/flights/active",
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getActiveFlights());
        }
    }

    @GetMapping("/{flightId}/positions")
    public ResponseEntity<?> getPositions(@PathVariable String flightId) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/flights/" + flightId + "/positions",
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "flightId", flightId,
                    "positions", "Mock positions unavailable"
            ));
        }
    }
}