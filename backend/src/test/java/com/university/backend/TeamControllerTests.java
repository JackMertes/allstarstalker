package com.university.backend;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

import static org.assertj.core.api.Assertions.assertThat;

/*
 * Set of tests for the TeamController Services.
*/
@SpringBootTest
@AutoConfigureRestTestClient
@ActiveProfiles("test")
public class TeamControllerTests {
 
    @Autowired
    private RestTestClient testClient;

    @Autowired
    private TeamController controller;

    @Autowired
    private MockDataService mds;

    /**
     * Test that all autowired-annotated fields are correctly initialized
     * by Spring's dependency injection facilities.
    */
    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
        assertThat(mds).isNotNull();
    }


    /**
     * Tests TeamController.formatAirport
    */
    @Test
    void testFormatAirport() {

        Airport airport = new Airport();
        airport.setIataCode(null);
        airport.setCity(null);
        airport.setName("Dane County Regional Airport");

        String result = TeamController.formatAirport(airport);
        assertTrue(result.equals("Dane County Regional Airport"));

        airport.setIataCode("MSN");
        result = TeamController.formatAirport(airport);
        assertTrue(result.equals("MSN"));

        airport.setCity("Madison");
        result = TeamController.formatAirport(airport);
        assertTrue(result.equals("Madison (MSN)"));
    }

    @Test
    void testAirportLabel() {}

    @Test
    void testFormatLinePosition() {}

    @Test
    void hasLocationLine() {}

    public void testTeamControllerCalls() {}

}
