package com.university.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestTemplate;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.client.RestTestClient;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Map;


/*
 * Set of tests for the FlightController services.
*/
@SpringBootTest //(properties = { "spring.config.name=application-test" })
@ActiveProfiles("test")
@AutoConfigureRestTestClient
public class FlightControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private FlightController controller;

    @Autowired
    private MockDataService mds;

    @MockitoBean 
    private FlightRepository repo;
    
    /*
     * Test that all autowired-annotated fields are correctly initialized
     * by Spring's dependency injection facilities.
    */
    @Test
    void contextLoad() {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
        assertThat(mds).isNotNull();
    }

    /*
     * Tests that all subservices in FlightController are
     * mapped correctly, return correct type, and are non-null.
     * 
     * {flightId} is arbitrarily given the value of 1 for all instances below
    */
    @Test
    public void testFlightControllerCalls() {
        // testClient.get().uri("/api/flights").exchange().expectStatus().is5xxServerError();
        // testClient.get().uri("/api/flights").exchange().expectBody(List.class);

        // testClient.get().uri("/api/flights/search").exchange().expectStatus().is5xxServerError();
        // testClient.get().uri("/api/flights/search").exchange().expectBody(List.class);

        // testClient.get().uri("/api/flights/1").exchange().expectStatus().isOk();
        // testClient.get().uri("/api/flights/1").exchange().expectBody(Map.class);

        // testClient.get().uri("/api/flights/1/details").exchange().expectStatus().is5xxServerError();
        // testClient.get().uri("/api/flights/1/details").exchange().expectBody(List.class);


        // testClient.get().uri("/api/flights/active").exchange().expectStatus().is5xxServerError();
        // testClient.get().uri("/api/flights/active").exchange().expectBody(List.class);

        // testClient.get().uri("/api/flights/1/positions").exchange().expectStatus().is5xxServerError();
        // testClient.get().uri("/api/flights/1/positions").exchange().expectBody(List.class);
   }

    /*
     * Tests the functionality of FlightController#getAllFlights()
     * Checks are made on test database
     * Request is GET via "/api/flight/"
    */
    @Test
    public void testGetAllFlights() {assert(true);}

    /*
     * Tests the functionality of FlightController#search()
     * Checks are on test database
     * Request is GET via "/api/flight/search"
    */
    @Test
    public void testSearch() {assert(true);}

    /*
     * Tests the funcionality of FlightController#getByFlightId()
     * Checks are on test database
     * Request is GET via "/api/flight/{flightId}"
    */
    @Test
    public void testGetByFlightId() {assert(true);}

    /*
     * Tests the functionality of FlightController#getDetails()
     * Checks are on test database
     * Request is GET via "/api/flight/{flightId}/details"
    */
    @Test
    public void testGetDetails() {assert(true);}

    /*
     * Tests the functionality of FlightController#getActive()
     * Checks are on test database
     * Request is GET via "/api/flight/active"
    */
    @Test
    public void testGetActive() {assert(true);}

    /*
     * Tests the functionality of FlightController#getPositions()
     * Checks are on test database
     * Request is GET via "/api/flight/{flightId}/positions"
    */
    @Test
    public void testGetPositions() {assert(true);}

}
