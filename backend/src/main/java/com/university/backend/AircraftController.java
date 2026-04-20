package com.university.backend;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/*
 * Handles the services mapped to "/api/aircraft/..."
 * Services in this module are all GET
 * In Progress (note to self - aircraftID needs implementation in database before fix).
*/
@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    private final MockDataService mock;

    public AircraftController(MockDataService mock) {
        this.mock = mock;
    }

    /**
     * Handles GET requests mapped to "/api/aircraft" and provides a ResponseEntity
     * encapsulating a list where each member is the mapped data of a flight.
     * 
     * @return ResponseEntity<?> holding the status code and encapsulated body
     */
    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getAllAircraft() {
        return ResponseEntity.ok(mock.getAllAircraft());
    }

    /**
     * Handles GET requests mapped to "/api/aircraft/{aircraftId}" and returns a
     * response encapsulating the aircraft identified by the param
     * 
     * aircraftID is not available from databasem, so mock implementation is left
     * 
     * @param aircraftId is ?
     * @return RespnseEntity<?> holding a satus code and encapsulated body
     */
    @GetMapping("/{aircraftId}")
    public ResponseEntity<?> getAircraftById(@PathVariable String aircraftId) {
        Map<String, Object> aircraft = mock.getAircraftById(aircraftId);
        if (aircraft.containsKey("error")) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(aircraft);
    }

    /**
     * Handles GET requests mapped to "/api/aircrat/tail/{tailNumber}" and returns
     * a response encapsulating the aircraft identified by the param 
     * 
     * @param tailNumber used to uniquely identift an aircraft
     * @return ResponseEntity<?> encapsulating status code and aircraft details
     */
    @GetMapping("/tail/{tailNumber}")
    public ResponseEntity<?> getAircraftByTailNumber(@PathVariable String tailNumber) {
        Map<String, Object> aircraft = mock.getAircraftByTail(tailNumber);
        if (aircraft.containsKey("error")) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(aircraft);
    }
}
