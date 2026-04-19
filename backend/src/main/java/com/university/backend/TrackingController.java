package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;


/**
 * REST endpoints for tracking team flights.
 */
@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingRepository trackingRepo;

    public TrackingController(TrackingRepository trackingRepo) {
        this.trackingRepo = trackingRepo;
    }

    private List<Map<String, Object>> toTrackingMappings(List<TrackingItem> trackedItems) {
        List<Map<String, Object>> trackingMappings = new ArrayList<>();
        for (TrackingItem item : trackedItems) {
            Map<String, Object> row = new HashMap<>();
            row.put("trackingId", item.getId());
            row.put("userId", item.getUserId());
            row.put("team", item.getTeam());
            row.put("callsign", item.getCallsign());
            row.put("notificationEnabled", item.getNotificationEnabled());
            row.put("createdAt", item.getCreatedAt());
            row.put("updatedAt", item.getUpdatedAt());
            trackingMappings.add(row);
        }
        return trackingMappings;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTracking() {
        return ResponseEntity.ok(toTrackingMappings(trackingRepo.findAll()));
    }
    
    /**
     * 
     * @return
     */
    @PostMapping("") //@GetMapping("/user/{userId}")
    public ResponseEntity<?> addTracking(@RequestBody Map<String, Object> request) {
        Object teamValue = request != null ? request.get("team") : null;
        String teamName = teamValue instanceof String ? ((String) teamValue).trim() : null;
        if (teamName == null || teamName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "team is required"));
        }

        Object callsignValue = request.get("callsign");
        String callsign = callsignValue instanceof String ? (String) callsignValue : null;

        Boolean notificationEnabled = Boolean.TRUE;
        Object notifValue = request.get("notificationEnabled");
        if (notifValue instanceof Boolean) {
            notificationEnabled = (Boolean) notifValue;
        }

        TrackingItem item = new TrackingItem();
        item.setTeam(teamName);
        item.setCallsign(callsign);
        item.setNotificationEnabled(notificationEnabled);

        trackingRepo.save(item);
        return ResponseEntity.ok(toTrackingMappings(trackingRepo.findAll()));
    }

    /*
     * Change out DTO for Mock obj variable
    */
    @GetMapping("/user/{userId}") //@PostMapping("")
    public ResponseEntity<Map<String, String>> getUserTracking(@PathVariable int userId) {

        /*if (obj.getTrackingID() != 1)
            return ResponseEntity.badRequest().body("Only celebs allowed so far(trackingID==1)");

        return ResponseEntity.ok("Impl in progress. Compare output with arguments.");
        
       /*if (team == null) {team = new Team();}
        Map<String, String> dataMap = new HashMap<String, String>();

        dataMap.put("teamName", team.getName());
        team.getNbaTeamId();
        team.getCity();
        team.getConference();
        */
        
        ResponseEntity<Map<String, String>> resp = ResponseEntity.ok().build();
        return resp;
    }

    @DeleteMapping("")
    public ResponseEntity<String> removeTracking(@RequestParam String callsign) {
        if (callsign == null || callsign.isBlank()) {
            return ResponseEntity.badRequest().body("delete failed: callsign is required");
        }

        try {
            long deletedCount = trackingRepo.deleteByCallsignIgnoreCase(callsign.trim());
            if (deletedCount > 0) {
                return ResponseEntity.status(204).body("deleted successfully the " + callsign.trim());
            }
            return ResponseEntity.status(404).body("delete failed: callsign not found " + callsign.trim());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("delete failed: internal server error");
        }
    }
}
