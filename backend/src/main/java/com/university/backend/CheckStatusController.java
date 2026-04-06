package com.university.backend;

import com.university.backend.airplanes.AirplanesLiveResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Handles GET /api/checkStatus/{callsign}
 * Returns live flight status for a team by callsign, sourced directly from Airplanes.live.
 * Response shape matches what the frontend FlightDetailsPage expects.
 */
@RestController
@RequestMapping("/api")
public class CheckStatusController {

    private final AirplanesLiveClient airplanesLiveClient;
    private final TeamRepository teamRepository;

    public CheckStatusController(AirplanesLiveClient airplanesLiveClient, TeamRepository teamRepository) {
        this.airplanesLiveClient = airplanesLiveClient;
        this.teamRepository = teamRepository;
    }

    /**
     * Fetches live ADS-B data for the given callsign and returns it in the shape
     * the frontend expects: { [callsign]: { is_flying, team, callsign, last_seen, raw } }
     *
     * @param callsign e.g. "DAL8924"
     * @return 200 with status map, or 404 if callsign is not a known team
     */
    @GetMapping("/checkStatus/{callsign}")
    public ResponseEntity<Map<String, Object>> checkStatus(@PathVariable String callsign) {
        Optional<Team> teamOpt = teamRepository.findByCallsign(callsign);
        if (teamOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String teamName = teamOpt.get().getName();

        AirplanesLiveResponse liveResponse = airplanesLiveClient.fetchByCallsign(callsign);

        boolean isFlying = liveResponse != null
                && liveResponse.getTotal() != null
                && liveResponse.getTotal() == 1
                && liveResponse.getAircraft() != null
                && !liveResponse.getAircraft().isEmpty();

        Map<String, Object> statusData = new HashMap<>();
        statusData.put("is_flying", isFlying);
        statusData.put("team", teamName);
        statusData.put("callsign", callsign);

        if (isFlying) {
            long nowMs = liveResponse.getNow() != null ? liveResponse.getNow()
                    : (liveResponse.getCtime() != null ? liveResponse.getCtime() : System.currentTimeMillis());
            statusData.put("last_seen", Instant.ofEpochMilli(nowMs).toString());
            statusData.put("raw", liveResponse);
        }

        Map<String, Object> result = new HashMap<>();
        result.put(callsign, statusData);

        return ResponseEntity.ok(result);
    }
}
