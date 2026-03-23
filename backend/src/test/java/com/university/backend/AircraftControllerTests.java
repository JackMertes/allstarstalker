package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;

import java.util.List;
import java.util.Map;

/*
 * Set of tests for the AircraftController Services.
 * Inspiration taken from tutorial on https://spring.io/guides/gs/testing-web
*/
@SpringBootTest
@AutoConfigureRestTestClient
@ActiveProfiles("test")
public class AircraftControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private AircraftController controller;

    @Autowired
    private MockDataService mds;

    /*
     * Test that all autowired-annotated fields are correctly initialized
     * by Spring's dependency injection facilities.
    */
    @Test
    void contextLoads() throws Exception {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
        assertThat(mds).isNotNull();
    }

    /*
     * Test that all subservices in AircraftController are 
     * mapped correctly, return correct type, and are non-empty.
    */
    @Test
    void testAircraftControllerCalls() {
        
        testClient.get().uri("/api/aircraft").exchange().expectStatus().isOk();
        //testClient.get().uri("/api/aircraft").exchange().expectBody().isEmpty();
        //assert(testClient.get().uri("/api/aircraft").exchange().expectBody().returnResult().getResponseBody() != null);
        testClient.get().uri("/api/aircraft").exchange().expectBody(List.class);

        testClient.get().uri("/api/aircraft/3").exchange().expectStatus().isOk();
        //testClient.get().uri("/api/aircraft/3").exchange().expectBody().isEmpty();
        //assert(testClient.get().uri("/api/aircraft3").exchange().expectBody().returnResult().getResponseBody() != null);
        testClient.get().uri("/api/aircraft/3").exchange().expectBody(Map.class);

        testClient.get().uri("/api/aircraft/tail/3").exchange().expectStatus().isOk();
        //testClient.get().uri("/api/aircraft/tail/3").exchange().expectBody().isEmpty();
        //assert(testClient.get().uri("/api/aircraft/tail/3").exchange().expectBody().returnResult().getResponseBody() != null);
        testClient.get().uri("/api/aircraft/tail/3").exchange().expectBody(Map.class);
    }

    /*
     * Tests the functionality of AircraftController#getAllAircraft()
     * Checks are for mock data
     * Request is GET via mappping: "/api/aircraft/" 
    */
    @Test
    void testGetAllAircraft() {

        ResponseEntity<?> resp = controller.getAllAircraft();
        //ResponseSpec spec = testClient.get().uri("/api/aircraft").exchange();
        List<Map<String, Object>> aircraftList = (List<Map<String, Object>>)resp.getBody();
        
        //spec.expectBody(List.class);
        assert(aircraftList.get(0).get("aircraftId") != null);
        assert(aircraftList.get(1).get("aircraftId") != null);

        assert((int)aircraftList.get(0).get("aircraftId") == 1);
        assertEquals(aircraftList.get(0).get("tailNumber"),  "N628TS");
        assertEquals(aircraftList.get(0).get("aircraftType"), "Gulfstream G650");
    }

    /*
     * Test the funcitonality of AircraftController#getAircraftByID()
     * Request is GET via mapping: "/api/aircraft/{aircraftId}"
    */
    @Test
    void testGetAircraftByID() {
        ResponseEntity<?> resp = controller.getAircraftById("1");
        assert (resp.hasBody());

        resp = controller.getAircraftById("4");
        assert(resp.hasBody());

        Map<String, Object> plane = (Map<String, Object>)resp.getBody();
        assertEquals(plane.get("tailNumber"), "N1KE");
        assertEquals(plane.get("aircraftType"), "Gulfstream G-V");

   }

    /*
    * Test the functionality of AircraftController.
    */
    @Test
    void testGetAircraftByTailNumber() {

    ResponseEntity<?> resp;
    
    resp = controller.getAircraftByTailNumber("N628TS");
    assert(resp.hasBody());

    resp = controller.getAircraftByTailNumber("N1KE");
    assert (resp.hasBody());

    Map<String, Object> plane = (Map<String, Object>)resp.getBody();
    assertEquals((int)plane.get("aircraftId"), 4);
    assertEquals(plane.get("aircraftType"), "Gulfstream G-V");
    
  }
}
