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

    /**
     * Triggers a full refresh of all teams in the background. Returns immediately with 202.
     * 10s delay between each; 429 retries with 60s wait.
     * Returns 409 if a refresh is already in progress.
     */
    @PostMapping("/refresh-all")
    public ResponseEntity<?> refreshAll() {
        int count = refreshService.startRefreshAllAsync();
        if (count == -1) {
            return ResponseEntity.status(409).body(Map.of(
                    "status", "already_running",
                    "message", "Full refresh is already in progress"
            ));
        }
        return ResponseEntity.status(202).body(Map.of(
                "status", "refresh_started",
                "teamsCount", count,
                "message", "Full refresh running in background"
        ));
    }
}
