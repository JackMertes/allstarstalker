package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ingest")
public class IngestController {

    private final FlightRefreshService refreshService;

    public IngestController(FlightRefreshService refreshService) {
        this.refreshService = refreshService;
    }

    /**
     * Triggers a one-team refresh for the given callsign. For demo/testing.
     */
    @PostMapping("/refresh/{callsign}")
    public ResponseEntity<?> refreshByCallsign(@PathVariable String callsign) {
        boolean done = refreshService.refreshByCallsign(callsign);
        if (done) {
            return ResponseEntity.ok(Map.of("callsign", callsign, "status", "refreshed"));
        }
        return ResponseEntity.notFound().build();
    }
}
