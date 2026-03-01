package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @GetMapping("/search")
    public ResponseEntity<String> search(@RequestParam(required = false) String flightNumber) {
        return ResponseEntity.ok("Implement /search. FlightNumber: " + flightNumber);
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<String> getByFlightID(@PathVariable String flightId) {
        return ResponseEntity.ok("Implement /{flightId}");
    }

    @GetMapping("/{flightId}/details")
    public ResponseEntity<String> getDetails(@PathVariable String flightId) {
        return ResponseEntity.ok("Implement /{flightId}/details");
    }

    @GetMapping("/active")
    public ResponseEntity<String> getActive() {
        return ResponseEntity.ok("Implement /active. Return all active flights");
    }

    @GetMapping("/{flightId}/positions")
    public ResponseEntity<String> getPositions(@PathVariable String flightId) {
        return ResponseEntity.ok("Implement /{flightId}/positions");
    }
}
