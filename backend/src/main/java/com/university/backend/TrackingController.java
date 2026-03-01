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

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    @PostMapping("")
    public ResponseEntity<String> getUserTracking(@RequestBody Celeb obj) {
        if (obj.getTrackingID() != 1)
            return ResponseEntity.badRequest().body("Only celebs allowed so far(trackingID==1)");

        System.out.println("Tracking ID: " + obj.getTrackingID() + "\n" +
                            "Entity Type: " + obj.getEntityType() + "\n"  +
                            "Name: " + obj.getName() + "\n" +
                            "Time: " + obj.getTime());

        return ResponseEntity.ok("Impl in progress. Compare output with arguments.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<String> addTracking(@PathVariable int userId) {
        return ResponseEntity.ok("Implement GET service. Given userID: " + userId);
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
        private LocalDateTime time;
        public int getTrackingID() { return trackingID; }
        public String getEntityType() { return type; }
        public String getName() { return entityName; }
        public LocalDateTime getTime() { return time; }
    }
}
