package com.university.backend;

import org.junit.jupiter.api.Test;
// import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;

// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.RestTestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;


/*
 * Set of tests for the TrackingController Services.
*/
@SpringBootTest
@AutoConfigureRestTestClient
@ActiveProfiles("test")
public class TrackingControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private TrackingController controller;

    @Autowired
    private MockDataService mds;

    //@Autowired
    //private MockMvc mvc;
    //RestTemplate templ = Mockito.mock(RestTemplate.class);
    //MockDataService mock = Mockito.mock(MockDataService.class);
    //TrackingController TC = new TrackingController(templ, mock);

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
     * Tests that all subservices in TrackingController are
     * maped correctly, return correct type, and are non-empty..
    */
    public void testTrackingControllerCalls() {
        testClient.get().uri("/api/tracking").exchange().expectStatus().isOk();
        //assert(testClient.get().uri("/api/tracking/").exchange().expectBody().returnResult().getResponseBody() != null);
        testClient.get().uri("/api/tracking/3").exchange().expectBody(List.class);

        
        testClient.get().uri("/api/tracking/user/3").exchange().expectStatus().isOk();
        testClient.get().uri("/api/tracking/user/3").exchange().expectBody(List.class);

        testClient.post().uri("/api/tracking").exchange().expectStatus().isOk();
        testClient.post().uri("/api/tracking").exchange().expectBody(String.class);

        testClient.delete().uri("/api/tracking/3").exchange().expectStatus().isOk();
        testClient.delete().uri("/api/tracking/3").exchange().expectBody(List.class);
    }

    /*
     * Tests the functionality of TrackingController#getAllTracking()
     * Checks are for mock data
     * Request is GET via "/api/tracking/"
    */
    @Test
    public void testGetAllTracking() {
        
        ResponseEntity<?> resp = controller.getAllTracking();
        List<Map<String, Object>> userTrackingsList = (List<Map<String, Object>>)resp.getBody();

        // assert(userTrackingsList.get(0).containsKey("trackingId"));
        // assert(userTrackingsList.get(1).containsKey("trackingId"));
        // assert(userTrackingsList.get(2).containsKey("trackingId"));

        // for userTracking mappings in MockDataService, check that each is of type team
        for (Map<String, Object> l : userTrackingsList) {
            assert(l.containsKey("trackingId"));
            assert(l.get("type").equals("team"));
        }
    }

    /*
     * Tests the functionality of TrackingController#getAddTracking()
     * Checks are for mock data
     * Request is GET via "/api/tracking/user/{userId}"
    */
    @Test
    public void testAddTracking() {

        int userId = 1;
        ResponseEntity<?> resp = controller.addTracking(); //addTracking(userId);
        List<Map<String, Object>> userTrackingList = (List<Map<String, Object>>)resp.getBody();

        assertEquals(((String)userTrackingList.get(0).get("trackingId")), "1");
        assertEquals(userTrackingList.get(userId-1).get("callsign"), "DAL8924");
        assertEquals(userTrackingList.get(userId-1).get("team"), "Denver Nuggets (back-end)");
        assertEquals(userTrackingList.get(userId-1).get("category"), "NBA");
        assertEquals(userTrackingList.get(userId-1).get("type"), "team");
        assertEquals(userTrackingList.get(userId-1).get("notificationEnabled"), true);
        assertEquals(userTrackingList.get(userId-1).get("createdAt"), "2024-02-01T10:00:00");
    }
    
    /*
     * Tests the functionality of TrackingController#getUserTracking()
     * Checks are for mock data
     * Request is POST via "/api/tracking/"
    */
    @Test
    public void testGetUserTracking() {assert(false);}

    /*
     * Tests the functionality of TrackingController#removeTracking()
     * Checks are for mock data
     * Request is DELETE via "/api/tracking/{trackingId}"
    */
    @Test
    public void testRemoveTracking() {assert(false);}
}