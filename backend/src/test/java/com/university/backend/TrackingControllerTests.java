package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class TrackingControllerTests {

    @Autowired
    private TrackingController controller;

    @MockitoBean
    private MockDataService mock;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    @Test
    void getAllTracking_returnsMockResults() {
        when(mock.getUserTrackings()).thenReturn(List.of(Map.of(
                "trackingId", "1",
                "callsign", "DAL8924",
                "notificationEnabled", true
        )));

        ResponseEntity<List<Map<String, Object>>> response = controller.getAllTracking();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).containsEntry("callsign", "DAL8924");
    }

    @Test
    void addTracking_returnsCreatedTracking() {
        Map<String, Object> createdTracking = Map.of(
                "trackingId", "10",
                "type", "team",
                "team", "Denver Nuggets",
                "callsign", "DAL8924",
                "notificationEnabled", true
        );
        when(mock.addUserTracking(anyMap())).thenReturn(createdTracking);

        ResponseEntity<Map<String, Object>> response = controller.addTracking(Map.of(
                "type", "team",
                "team", "Denver Nuggets",
                "callsign", "DAL8924"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("trackingId", "10")
                .containsEntry("callsign", "DAL8924");
    }

    @Test
    void updateTracking_returnsBadRequest_whenNotificationEnabledIsMissing() {
        ResponseEntity<Map<String, Object>> response = controller.updateTracking("10", Map.of());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void updateTracking_returnsNotFound_whenTrackingDoesNotExist() {
        when(mock.updateTrackingNotification("99", false)).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = controller.updateTracking(
                "99",
                Map.of("notificationEnabled", false)
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void updateTracking_returnsUpdatedTracking_whenTrackingExists() {
        Map<String, Object> updatedTracking = Map.of(
                "trackingId", "10",
                "callsign", "DAL8924",
                "notificationEnabled", false
        );
        when(mock.updateTrackingNotification("10", false)).thenReturn(Optional.of(updatedTracking));

        ResponseEntity<Map<String, Object>> response = controller.updateTracking(
                "10",
                Map.of("notificationEnabled", false)
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("notificationEnabled", false);
    }

    @Test
    void removeTracking_returnsNotFound_whenTrackingDoesNotExist() {
        when(mock.removeUserTracking("99")).thenReturn(false);

        ResponseEntity<Void> response = controller.removeTracking("99");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void removeTracking_returnsNoContent_whenTrackingExists() {
        when(mock.removeUserTracking("10")).thenReturn(true);

        ResponseEntity<Void> response = controller.removeTracking("10");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}
