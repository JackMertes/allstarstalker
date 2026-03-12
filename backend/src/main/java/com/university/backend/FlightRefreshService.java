package com.university.backend;

import com.university.backend.airplanes.AircraftData;
import com.university.backend.airplanes.AirplanesLiveResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class FlightRefreshService {

    private static final Logger log = LoggerFactory.getLogger(FlightRefreshService.class);

    private static final DateTimeFormatter LOG_TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy h:mm a");

    private final AtomicBoolean refreshAllInProgress = new AtomicBoolean(false);
    private final AirplanesLiveClient airplanesLiveClient;
    private final FlightRepository flightRepository;
    private final TeamRepository teamRepository;
    private final long delayBetweenTeamsMs;
    private final String logPath;

    public FlightRefreshService(AirplanesLiveClient airplanesLiveClient,
                                FlightRepository flightRepository,
                                TeamRepository teamRepository,
                                @Value("${ingestion.delay-between-teams-ms:10000}") long delayBetweenTeamsMs,
                                @Value("${ingestion.log-path:database/flight_refresh.log}") String logPath) {
        this.airplanesLiveClient = airplanesLiveClient;
        this.flightRepository = flightRepository;
        this.teamRepository = teamRepository;
        this.delayBetweenTeamsMs = delayBetweenTeamsMs;
        this.logPath = logPath;
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
        refreshOneTeamWithLogLine(team, -1, -1);
    }

    /**
     * Refreshes flight data for one team with optional progress logging.
     *
     * @param index 1-based index for logging (e.g. [3/28]); use -1 to skip
     * @param total total count for logging; use -1 to skip
     * @return log line for flight_refresh.log when team is flying, empty otherwise
     */
    public Optional<String> refreshOneTeamWithLogLine(Team team, int index, int total) {
        if (team == null || team.getCallsign() == null || team.getCallsign().isBlank()) {
            return Optional.empty();
        }
        String callsign = team.getCallsign().trim();
        String teamName = team.getName();
        String prefix = (index >= 0 && total > 0) ? "[" + index + "/" + total + "] " : "";

        AirplanesLiveResponse response = airplanesLiveClient.fetchByCallsign(callsign);
        Optional<Flight> existingOpt = flightRepository.findByCallsign(callsign);

        if (response == null) {
            log.warn("{} {} ({}): ERROR - API returned no data", prefix, teamName, callsign);
        }

        if (isFlying(response)) {
            Flight flight = mapToFlight(teamName, callsign, response, existingOpt.orElse(null));
            flightRepository.save(flight);
            boolean wasFlying = existingOpt.isPresent() && "ACTIVE".equals(existingOpt.get().getStatus());
            log.info("{} {} ({}): flying - {}", prefix, teamName, callsign, wasFlying ? "updated" : "now flying");
            String logLine = wasFlying ? teamName + " updated flying position" : teamName + " now flying";
            return Optional.of(logLine);
        } else {
            if (existingOpt.isPresent()) {
                Flight existing = existingOpt.get();
                existing.setStatus("UNKNOWN");
                flightRepository.save(existing);
                log.info("{} {} ({}): not flying - kept last known", prefix, teamName, callsign);
            } else {
                Flight flight = new Flight();
                flight.setCallsign(callsign);
                flight.setStatus("UNKNOWN");
                flight.setExternalFlightId(callsign);
                flightRepository.save(flight);
                log.info("{} {} ({}): not flying - no prior data", prefix, teamName, callsign);
            }
            return Optional.empty();
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

    /**
     * Refreshes all teams with callsigns. Waits {@code ingestion.delay-between-teams-ms} (default 10s)
     * between each team to respect rate limits. Only one full refresh can run at a time.
     *
     * @return number of teams refreshed, or -1 if a refresh is already in progress
     */
    public int refreshAllTeams() {
        if (!refreshAllInProgress.compareAndSet(false, true)) {
            return -1;
        }
        try {
            return doRefreshAllTeams();
        } finally {
            refreshAllInProgress.set(false);
        }
    }

    /**
     * Starts a full refresh in the background. Returns immediately with 202.
     *
     * @return number of teams to refresh, or -1 if a refresh is already in progress
     */
    public int startRefreshAllAsync() {
        if (!refreshAllInProgress.compareAndSet(false, true)) {
            return -1;
        }
        List<Team> teams = teamRepository.findByCallsignIsNotNull();
        int count = teams.size();
        CompletableFuture.runAsync(() -> {
            try {
                log.info("Full refresh started for {} teams", count);
                List<String> logLines = runRefreshLoop();
                appendToLogFile(logLines);
                log.info("Full refresh completed for {} teams", count);
            } finally {
                refreshAllInProgress.set(false);
            }
        });
        return count;
    }

    private int doRefreshAllTeams() {
        List<String> logLines = runRefreshLoop();
        appendToLogFile(logLines);
        return teamRepository.findByCallsignIsNotNull().size();
    }

    private List<String> runRefreshLoop() {
        List<Team> teams = teamRepository.findByCallsignIsNotNull();
        int count = teams.size();
        List<String> logLines = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            refreshOneTeamWithLogLine(teams.get(i), i + 1, count).ifPresent(logLines::add);
            if (i < count - 1 && delayBetweenTeamsMs > 0) {
                try {
                    Thread.sleep(delayBetweenTeamsMs);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
        return logLines;
    }

    private void appendToLogFile(List<String> logLines) {
        try {
            String ts = LocalDateTime.now().format(LOG_TIMESTAMP_FORMAT);
            String content = logLines.isEmpty() ? "No teams currently flying" : String.join(". ", logLines);
            String line = ts + " " + content + ".";
            Path path = Paths.get(logPath);
            Path parent = path.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }
            Files.write(path, (line + "\n").getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            log.warn("Failed to write to flight_refresh.log: {}", e.getMessage());
        }
    }
}
