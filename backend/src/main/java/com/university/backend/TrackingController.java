package com.university.backend;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final RestTemplate restTemplate;
    private final MockDataService mock;

    public TrackingController(RestTemplate restTemplate, MockDataService mock) {
        this.restTemplate = restTemplate;
        this.mock = mock;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTracking() {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/tracking",
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getUserTrackings());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> addTracking(@PathVariable int userId) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/tracking/user/" + userId,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getUserTrackings());
        }
    }

    @PostMapping("")
    public ResponseEntity<String> getUserTracking(@RequestBody Celeb obj) {
        if (obj.getTrackingID() != 1)
            return ResponseEntity.badRequest().body("Only celebs allowed so far(trackingID==1)");

        return ResponseEntity.ok("Impl in progress. Compare output with arguments.");
    }

    @DeleteMapping("/{trackingId}")
    public ResponseEntity<String> removeTracking(@PathVariable int trackingId) {
        return ResponseEntity.ok("Implement DELETE service. Given trackingID: " + trackingId);
    }

    private static class Celeb {
        private int trackingID = 1;
        private String type;
        private String entityName;
        private boolean notif;
        public int getTrackingID() { return trackingID; }
    }
}
