package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

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

        assertThat(createdResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(createdResponse.getBody()).containsEntry("callsign", "TEST123");

        ResponseEntity<Map<String, Object>> updatedResponse = controller.updateTracking(
                trackingId,
                Map.of("notificationEnabled", false)
        );

        assertThat(updatedResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updatedResponse.getBody()).containsEntry("notificationEnabled", false);

        ResponseEntity<Void> deletedResponse = controller.removeTracking(trackingId);
        assertThat(deletedResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}
