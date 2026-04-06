package com.university.backend;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.HashMap;
import java.util.Map;

//import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;


/**
 * Directs HTTP requests mapped to "/api/tracking/..." to the proper endpoints
 * Services in this module respond to GET / POST / DELETE requests.
 * In Progress (note to self - needs documentation, and fully implemented methods).
 *  - User is not implemented, cannot 
 */
@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final RestTemplate restTemplate;
    private final MockDataService mock;
    Team team;

    public TrackingController(RestTemplate restTemplate, MockDataService mock) {
        this.restTemplate = restTemplate;
        this.mock = mock;
    }

    /**
     * 
     * @return
     */
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
    
    /**
     * 
     * @return
     */
    @PostMapping("") //@GetMapping("/user/{userId}")
    public ResponseEntity<?> addTracking(/*@PathVariable int userId*/) {
        /*try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/tracking/user/" + userId,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getUserTrackings());
        }*/
       return ResponseEntity.ok(mock.getUserTrackings());
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

    @DeleteMapping("/{trackingId}")
    public ResponseEntity<String> removeTracking(@PathVariable int trackingId) {
        return ResponseEntity.ok("Implement DELETE service. Given trackingID: " + trackingId);
    }

    /*
     * Internal class intended as DTO to match Frontend needs 
     * deprecated for ResponseEntity?
    */
    // private static class Celeb {
    //     private int trackingID = 1;
    //     private String type;
    //     private String entityName;
    //     private boolean notif;
    //     public int getTrackingID() { return trackingID; }
    // }
}
