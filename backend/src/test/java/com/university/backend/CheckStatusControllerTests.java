package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class CheckStatusControllerTests {

    @Autowired
    private CheckStatusController controller;

    @MockitoBean
    private TeamRepository teamRepository;

    @MockitoBean
    private FlightRepository flightRepository;

    @Test
    void checkStatus_returnsNotFound_forUnknownCallsign() {
        when(teamRepository.findByCallsign("UNKNOWN999")).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = controller.checkStatus("UNKNOWN999");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void checkStatus_returnsFlyingPayload_withRawAircraftData() {
        Team team = new Team();
        team.setName("Denver Nuggets");
        team.setCallsign("DAL8924");

        Flight flight = new Flight();
        flight.setCallsign("DAL8924");
        flight.setStatus("ACTIVE");
        flight.setAircraftType("B752");
        flight.setTailNumber("N662DN");
        flight.setFlightNumber("DAL8924");
        flight.setLiveLatitude(new BigDecimal("37.729844"));
        flight.setLiveLongitude(new BigDecimal("-102.776443"));
        flight.setLiveHeadingDeg(new BigDecimal("125.99"));
        flight.setLastSeenUtc(LocalDateTime.of(2025, 1, 1, 12, 0));

        when(teamRepository.findByCallsign("DAL8924")).thenReturn(Optional.of(team));
        when(flightRepository.findByCallsign("DAL8924")).thenReturn(Optional.of(flight));

        ResponseEntity<Map<String, Object>> response = controller.checkStatus("DAL8924");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> payload = (Map<String, Object>) response.getBody().get("DAL8924");
        assertThat(payload).containsEntry("team", "Denver Nuggets");
        assertThat(payload).containsEntry("is_flying", true);
        assertThat(payload).containsKey("raw");
    }
}
