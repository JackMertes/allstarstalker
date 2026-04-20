package com.university.backend;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class TeamControllerTests {

    @Autowired
    private TeamController controller;

    @MockitoBean
    private TeamRepository repo;

    @MockitoBean
    private FlightRepository flightRepo;

    @MockitoBean
    private AirportRepository airportRepo;

    /**
     * Test that all autowired-annotated fields are correctly initialized
     * by Spring's dependency injection facilities.
    */
    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    @Test
    void getTeams_returnsEmptyList_whenNoTeamsExist() {
        when(repo.findAll()).thenReturn(List.of());

        ResponseEntity<List<Map<String, String>>> response = controller.getTeams();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
    }

    @Test
    void getTeams_mapsFlightDataAndAirportLabels() {
        Team team = createTeam("Denver Nuggets", "DEN", "Denver", "Northwest", "DAL8924");
        Flight flight = createFlight("DAL8924", "ACTIVE");
        flight.setAircraftType("B752");
        flight.setDepartureAirportId(1L);
        flight.setArrivalAirportId(2L);

        Airport departure = createAirport("DEN", "Denver", "Denver International Airport");
        Airport arrival = createAirport("LAX", "Los Angeles", "Los Angeles International Airport");

        when(repo.findAll()).thenReturn(List.of(team));
        when(flightRepo.findByCallsign("DAL8924")).thenReturn(Optional.of(flight));
        when(airportRepo.findById(1L)).thenReturn(Optional.of(departure));
        when(airportRepo.findById(2L)).thenReturn(Optional.of(arrival));

        ResponseEntity<List<Map<String, String>>> response = controller.getTeams();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).containsEntry("teamName", "Denver Nuggets")
                .containsEntry("callSign", "DAL8924")
                .containsEntry("status", "ACTIVE")
                .containsEntry("aircraftType", "B752")
                .containsEntry("origin", "Denver (DEN)")
                .containsEntry("destination", "Los Angeles (LAX)");
    }

    @Test
    void getTeams_usesNotFlyingStatusAndLastPositionFallback_whenUnknownFlightHasCoordinates() {
        Team team = createTeam("Denver Nuggets", "DEN", "Denver", "Northwest", "DAL8924");
        Flight flight = createFlight("DAL8924", "UNKNOWN");
        flight.setLiveLatitude(new BigDecimal("39.7392"));
        flight.setLiveLongitude(new BigDecimal("-104.9903"));

        when(repo.findAll()).thenReturn(List.of(team));
        when(flightRepo.findByCallsign("DAL8924")).thenReturn(Optional.of(flight));

        ResponseEntity<List<Map<String, String>>> response = controller.getTeams();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).containsEntry("status", "NOT_FLYING")
                .containsEntry("origin", "Last position · 39.7392°, -104.9903°");
        assertThat(response.getBody().get(0)).doesNotContainKey("destination");
    }

    @Test
    void getTeams_usesHomeCityFallback_whenNoFlightDataExists() {
        Team team = createTeam("Denver Nuggets", "DEN", "Denver", "Northwest", "DAL8924");

        when(repo.findAll()).thenReturn(List.of(team));
        when(flightRepo.findByCallsign("DAL8924")).thenReturn(Optional.empty());

        ResponseEntity<List<Map<String, String>>> response = controller.getTeams();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).containsEntry("origin", "Home city · Denver")
                .doesNotContainKey("status");
    }

    @Test
    void getFlyingTeams_returnsMatchedActiveFlights_andUsesInFlightFallbackWhenAirportsMissing() {
        Team team = createTeam("Denver Nuggets", "DEN", "Denver", "Northwest", "DAL8924");
        Flight matchedFlight = createFlight("DAL8924", "ACTIVE");
        matchedFlight.setAircraftType("B752");
        matchedFlight.setLiveLatitude(new BigDecimal("37.7298"));
        matchedFlight.setLiveLongitude(new BigDecimal("-102.7764"));

        Flight unmatchedFlight = createFlight("UNKNOWN999", "ACTIVE");

        when(flightRepo.findByStatus("ACTIVE")).thenReturn(List.of(matchedFlight, unmatchedFlight));
        when(repo.findByCallsign("DAL8924")).thenReturn(Optional.of(team));
        when(repo.findByCallsign("UNKNOWN999")).thenReturn(Optional.empty());

        ResponseEntity<List<Map<String, String>>> response = controller.getFlyingTeams();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).containsEntry("teamName", "Denver Nuggets")
                .containsEntry("status", "ACTIVE")
                .containsEntry("origin", "In flight · 37.7298°, -102.7764°")
                .containsEntry("aircraftType", "B752");
    }

    private Team createTeam(String name, String teamId, String city, String division, String callsign) {
        Team team = new Team();
        team.setName(name);
        team.setNbaTeamId(teamId);
        team.setCity(city);
        team.setDivision(division);
        team.setCallsign(callsign);
        return team;
    }

    private Flight createFlight(String callsign, String status) {
        Flight flight = new Flight();
        flight.setCallsign(callsign);
        flight.setStatus(status);
        return flight;
    }

    private Airport createAirport(String iata, String city, String name) {
        Airport airport = new Airport();
        airport.setIataCode(iata);
        airport.setCity(city);
        airport.setName(name);
        return airport;
    }
}
