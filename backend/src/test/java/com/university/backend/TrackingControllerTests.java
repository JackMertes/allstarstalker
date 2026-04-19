package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.client.RestTestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

        // for userTracking mappings in MockDataService, check that each is of type team
        for (Map<String, Object> l : userTrackingsList) {
            assertTrue(l.containsKey("trackingId"));
            assertTrue(l.containsKey("team"));
            assertTrue(l.containsKey("callsign"));
            assertTrue(l.containsKey("notificationEnabled"));
        }
    }

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
