package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for tracking team flights.
 */
@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final MockDataService mock;

    public TrackingController(MockDataService mock) {
        this.mock = mock;
    }

    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getAllTracking() {
        return ResponseEntity.ok(mock.getUserTrackings());
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Object>> addTracking(@RequestBody Map<String, Object> trackingData) {
        return ResponseEntity.ok(mock.addUserTracking(trackingData));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserTracking(@PathVariable int userId) {
        return ResponseEntity.ok(mock.getUserTrackings());
    }

    @PatchMapping("/{trackingId}")
    public ResponseEntity<Map<String, Object>> updateTracking(
            @PathVariable String trackingId,
            @RequestBody Map<String, Object> updates) {
        Object enabled = updates.get("notificationEnabled");
        if (!(enabled instanceof Boolean notificationEnabled)) {
            return ResponseEntity.badRequest().build();
        }

        return mock.updateTrackingNotification(trackingId, notificationEnabled)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{trackingId}")
    public ResponseEntity<Void> removeTracking(@PathVariable String trackingId) {
        if (!mock.removeUserTracking(trackingId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
