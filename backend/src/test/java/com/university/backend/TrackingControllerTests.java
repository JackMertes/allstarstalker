package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureRestTestClient
@ActiveProfiles("test")
class TrackingControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private TrackingController controller;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
    }

    @Test
    void getAllTracking_returnsSeedData() {
        ResponseEntity<List<Map<String, Object>>> response = controller.getAllTracking();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotEmpty();
    }

    @Test
    void addUpdateAndRemoveTracking_roundTrips() {
        Map<String, Object> tracking = Map.of(
                "type", "team",
                "team", "Test Team",
                "callsign", "TEST123",
                "category", "NBA",
                "notificationEnabled", true
        );

        ResponseEntity<Map<String, Object>> createdResponse = controller.addTracking(tracking);
        String trackingId = String.valueOf(createdResponse.getBody().get("trackingId"));

        // for userTracking mappings in MockDataService, check that each is of type team
        for (Map<String, Object> l : userTrackingsList) {
            assertTrue(l.containsKey("trackingId"));
            assertTrue(l.containsKey("team"));
            assertTrue(l.containsKey("callsign"));
            assertTrue(l.containsKey("notificationEnabled"));
        }
    }

    /*
     * Tests the functionality of TrackingController#getAddTracking()
     * Checks are for mock data
     * Request is GET via "/api/tracking/user/{userId}"
    */
    @Test
    public void testAddTracking() {
        ResponseEntity<?> initialResp = controller.getAllTracking();
        List<Map<String, Object>> before = (List<Map<String, Object>>) initialResp.getBody();
        int beforeSize = before == null ? 0 : before.size();

        Map<String, Object> payload = Map.of(
                "team", "Chicago Bulls",
                "callsign", "DAL8922",
                "notificationEnabled", true,
                "createdAt", "2026-04-17T19:38:54.490Z",
                "updatedAt", "2026-04-17T19:38:54.490Z"
        );

        ResponseEntity<?> resp = controller.addTracking(payload);
        List<Map<String, Object>> userTrackingList = (List<Map<String, Object>>)resp.getBody();

        assertThat(userTrackingList).isNotNull();
        assertEquals(beforeSize + 1, userTrackingList.size());

        Map<String, Object> inserted = userTrackingList.get(userTrackingList.size() - 1);
        assertEquals("Chicago Bulls", inserted.get("team"));
        assertEquals("DAL8922", inserted.get("callsign"));
        assertEquals(true, inserted.get("notificationEnabled"));
        assertTrue(inserted.containsKey("trackingId"));
        assertTrue(inserted.containsKey("createdAt"));
        assertTrue(inserted.containsKey("updatedAt"));
    }
    
    /*
     * Tests the functionality of TrackingController#getUserTracking()
     * Checks are for mock data
     * Request is POST via "/api/tracking/"
    */
    @Test
    public void testGetUserTracking() {assert(true);}

    /*
     * Tests the functionality of TrackingController#removeTracking()
     * Checks are for mock data
     * Request is DELETE via "/api/tracking/{trackingId}"
    */
    @Test
    public void testRemoveTracking() {assert(true);}
}
