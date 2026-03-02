package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    private final RestTemplate restTemplate;
    private final MockDataService mock;

    public AircraftController(RestTemplate restTemplate, MockDataService mock) {
        this.restTemplate = restTemplate;
        this.mock = mock;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllAircraft() {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/aircraft",
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAllAircraft());
        }
    }

    @GetMapping("/{aircraftId}")
    public ResponseEntity<?> getAircraftById(@PathVariable String aircraftId) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/aircraft/" + aircraftId,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAircraftById(aircraftId));
        }
    }

    @GetMapping("/tail/{tailNumber}")
    public ResponseEntity<?> getAircraftByTailNumber(@PathVariable String tailNumber) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/aircraft/tail/" + tailNumber,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAircraftByTail(tailNumber));
        }
    }
}