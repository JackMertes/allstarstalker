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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

@SpringBootTest
@AutoConfigureRestTestClient
@ActiveProfiles("test")
class TrackingControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private TrackingController controller;

    @MockitoBean
    private TrackingRepository trackingRepo;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
    }

    @Test
    void getAllTracking_returnsMappedResults() {
        TrackingItem item = new TrackingItem();
        item.setId(1L);
        item.setUserId(7L);
        item.setTeam("Chicago Bulls");
        item.setCallsign("DAL8922");
        item.setNotificationEnabled(true);

        when(trackingRepo.findAll()).thenReturn(List.of(item));

        ResponseEntity<?> response = controller.getAllTracking();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(List.class);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> body = (List<Map<String, Object>>) response.getBody();
        assertThat(body).hasSize(1);
        assertThat(body.get(0))
                .containsEntry("trackingId", 1L)
                .containsEntry("userId", 7L)
                .containsEntry("team", "Chicago Bulls")
                .containsEntry("callsign", "DAL8922")
                .containsEntry("notificationEnabled", true);
    }

    @Test
    void addTracking_returnsBadRequest_whenTeamMissing() {
        ResponseEntity<?> response = controller.addTracking(Map.of(
                "callsign", "TEST123",
                "notificationEnabled", true
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo(Map.of("error", "team is required"));
    }

    @Test
    void addTracking_savesAndReturnsMappedResults() {
        TrackingItem savedItem = new TrackingItem();
        savedItem.setId(42L);
        savedItem.setTeam("Chicago Bulls");
        savedItem.setCallsign("DAL8922");
        savedItem.setNotificationEnabled(true);

        when(trackingRepo.save(any(TrackingItem.class))).thenReturn(savedItem);
        when(trackingRepo.findAll()).thenReturn(List.of(savedItem));

        Map<String, Object> payload = Map.of(
                "team", "Chicago Bulls",
                "callsign", "DAL8922",
                "notificationEnabled", true
        );

        ResponseEntity<?> response = controller.addTracking(payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(List.class);
        List<?> body = (List<?>) response.getBody();
        assertThat(body).hasSize(1);
        assertThat(body.get(0)).isInstanceOf(Map.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> item = (Map<String, Object>) body.get(0);
        assertThat(item)
                .containsEntry("trackingId", 42L)
                .containsEntry("team", "Chicago Bulls")
                .containsEntry("callsign", "DAL8922")
                .containsEntry("notificationEnabled", true)
                .containsEntry("userId", null)
                .containsEntry("createdAt", null)
                .containsEntry("updatedAt", null);
    }

    @Test
    void removeTracking_returnsBadRequest_whenCallsignMissing() {
        ResponseEntity<String> response = controller.removeTracking("  ");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("delete failed: callsign is required");
    }

    @Test
    void removeTracking_returnsNoContent_whenDeleted() {
        when(trackingRepo.deleteByCallsignIgnoreCase("TEST123")).thenReturn(1L);

        ResponseEntity<String> response = controller.removeTracking("TEST123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(response.getBody()).isEqualTo("deleted successfully the TEST123");
    }
}
