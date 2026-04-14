package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureRestTestClient
class FlightControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private FlightController controller;

    @MockitoBean
    private FlightRepository repo;

    @Test
    void contextLoad() {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
    }

    @Test
    void getAllFlights_returnsMappedResults() {
        Flight flight = new Flight();
        flight.setId(1L);
        flight.setCallsign("DAL8924");
        flight.setFlightNumber("DAL8924");
        flight.setTailNumber("N662DN");
        flight.setAircraftType("B752");
        flight.setDepartureScheduledUtc(LocalDateTime.of(2025, 1, 1, 12, 0));

        when(repo.findAll()).thenReturn(List.of(flight));

        ResponseEntity<List<Map<String, String>>> response = controller.getAllFlights();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).containsEntry("callSign", "DAL8924");
    }

    @Test
    void search_returnsBadRequest_whenSearchTermMissing() {
        ResponseEntity<Map<String, String>> response = controller.search(null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getByFlightId_returnsNotFound_whenFlightMissing() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<Map<String, String>> response = controller.getByFlightID(99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
