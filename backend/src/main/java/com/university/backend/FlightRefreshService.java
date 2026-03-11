package com.university.backend;

import com.university.backend.airplanes.AircraftData;
import com.university.backend.airplanes.AirplanesLiveResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class FlightRefreshService {

    private final AirplanesLiveClient airplanesLiveClient;
    private final FlightRepository flightRepository;
    private final TeamRepository teamRepository;

    public FlightRefreshService(AirplanesLiveClient airplanesLiveClient,
                                FlightRepository flightRepository,
                                TeamRepository teamRepository) {
        this.airplanesLiveClient = airplanesLiveClient;
        this.flightRepository = flightRepository;
        this.teamRepository = teamRepository;
    }

    /**
     * Refreshes flight data for one team by callsign. Looks up team, fetches from Airplanes.live,
     * maps to Flight, and upserts. Preserves last known data when the plane is not currently flying.
     */
    public boolean refreshByCallsign(String callsign) {
        return teamRepository.findByCallsign(callsign)
                .map(team -> {
                    refreshOneTeam(team);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Refreshes flight data for one team. Fetches from Airplanes.live, maps to Flight,
     * and upserts. Preserves last known data when the plane is not currently flying.
     */
    public void refreshOneTeam(Team team) {
        if (team == null || team.getCallsign() == null || team.getCallsign().isBlank()) {
            return;
        }
        String callsign = team.getCallsign().trim();
        String teamName = team.getName();

        AirplanesLiveResponse response = airplanesLiveClient.fetchByCallsign(callsign);
        Optional<Flight> existingOpt = flightRepository.findByCallsign(callsign);

        if (isFlying(response)) {
            Flight flight = mapToFlight(teamName, callsign, response, existingOpt.orElse(null));
            flightRepository.save(flight);
        } else {
            if (existingOpt.isPresent()) {
                Flight existing = existingOpt.get();
                existing.setStatus("UNKNOWN");
                flightRepository.save(existing);
            } else {
                Flight flight = new Flight();
                flight.setCallsign(callsign);
                flight.setStatus("UNKNOWN");
                flight.setExternalFlightId(callsign);
                flightRepository.save(flight);
            }
        }
    }

    private boolean isFlying(AirplanesLiveResponse response) {
        if (response == null) return false;
        Integer total = response.getTotal();
        if (total == null || total != 1) return false;
        List<AircraftData> ac = response.getAircraft();
        return ac != null && !ac.isEmpty();
    }

    private Flight mapToFlight(String teamName, String callsign, AirplanesLiveResponse response, Flight existing) {
        Flight flight = existing != null ? existing : new Flight();
        flight.setCallsign(callsign);
        flight.setExternalFlightId(callsign);
        flight.setStatus("ACTIVE");

        long ts = response.getNow() != null ? response.getNow() : (response.getCtime() != null ? response.getCtime() : System.currentTimeMillis());
        LocalDateTime utc = Instant.ofEpochMilli(ts).atZone(ZoneOffset.UTC).toLocalDateTime();
        flight.setLiveUpdatedUtc(utc);
        flight.setLastSeenUtc(utc);

        AircraftData ac = response.getAircraft().get(0);
        flight.setTailNumber(ac.getTailNumber());
        flight.setAircraftType(ac.getAircraftType());
        flight.setLiveLatitude(ac.getLatitude());
        flight.setLiveLongitude(ac.getLongitude());
        flight.setLiveAltitudeFt(ac.getAltitudeBaro());
        flight.setLiveGroundSpeedKt(ac.getGroundSpeed());
        flight.setLiveHeadingDeg(ac.getTrack());

        return flight;
    }
}
