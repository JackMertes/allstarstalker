package com.university.backend;

import com.university.backend.airplanes.AirplanesLiveResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Handles GET /api/checkStatus/{callsign}
 * Returns live flight status for a team by callsign. When not currently flying,
 * falls back to last known position from the database so the frontend can still
 * display the map and details with a "Not Flying – Last Known Position" banner.
 */
@RestController
@RequestMapping("/api")
public class CheckStatusController {

    private final AirplanesLiveClient airplanesLiveClient;
    private final TeamRepository teamRepository;
    private final FlightRepository flightRepository;

    public CheckStatusController(AirplanesLiveClient airplanesLiveClient,
                                  TeamRepository teamRepository,
                                  FlightRepository flightRepository) {
        this.airplanesLiveClient = airplanesLiveClient;
        this.teamRepository = teamRepository;
        this.flightRepository = flightRepository;
    }

    /**
     * Returns flight status for the given callsign in the shape the frontend expects:
     *   { [callsign]: { is_flying, team, callsign, last_seen, raw: { ac: [...] } } }
     *
     * When the plane is actively flying, raw comes from Airplanes.live.
     * When not flying, raw is built from the last known database record (if lat/lon exist).
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
        } else {
            // Not currently flying — include last known position from DB if available
            Optional<Flight> dbFlight = flightRepository.findByCallsign(callsign);
            if (dbFlight.isPresent()) {
                Flight f = dbFlight.get();
                if (f.getLiveLatitude() != null && f.getLiveLongitude() != null) {
                    // Build a last_seen timestamp
                    String lastSeen = f.getLastSeenUtc() != null
                            ? f.getLastSeenUtc().toInstant(ZoneOffset.UTC).toString()
                            : Instant.now().toString();
                    statusData.put("last_seen", lastSeen);

                    // Construct a synthetic ac entry from DB fields so the
                    // frontend FlightDetails component can render the map and info panel
                    Map<String, Object> acEntry = new HashMap<>();
                    acEntry.put("lat", f.getLiveLatitude());
                    acEntry.put("lon", f.getLiveLongitude());
                    if (f.getLiveHeadingDeg() != null)    acEntry.put("track", f.getLiveHeadingDeg());
                    if (f.getLiveAltitudeFt() != null)    acEntry.put("alt_baro", f.getLiveAltitudeFt());
                    if (f.getLiveGroundSpeedKt() != null) acEntry.put("gs", f.getLiveGroundSpeedKt());
                    if (f.getAircraftType() != null)      acEntry.put("t", f.getAircraftType());
                    if (f.getTailNumber() != null)        acEntry.put("r", f.getTailNumber());
                    if (f.getFlightNumber() != null)      acEntry.put("flight", f.getFlightNumber());
                    else                                   acEntry.put("flight", callsign);

                    List<Map<String, Object>> acList = new ArrayList<>();
                    acList.add(acEntry);

                    Map<String, Object> rawMap = new HashMap<>();
                    rawMap.put("ac", acList);
                    rawMap.put("total", 0);
                    statusData.put("raw", rawMap);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put(callsign, statusData);

        return ResponseEntity.ok(result);
    }
}
