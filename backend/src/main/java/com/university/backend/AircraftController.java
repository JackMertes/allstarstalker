package com.university.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    @GetMapping("")
    public ResponseEntity<String> getAllAircraft() {
        return ResponseEntity.ok("Implement by returning all aircraft");
    }

    @GetMapping("/{aircraftId}")
    public ResponseEntity<String> getAircraftById(@PathVariable String aircraftId) {
        return ResponseEntity.ok("Implement. Return the plane: " + aircraftId);
    }

    @GetMapping("/tail/{tailNumber}")
    public ResponseEntity<String> getAircraftByTailNumber(@PathVariable String tailNumber) {
        return ResponseEntity.ok("Implement. Return plane with tail #" + tailNumber);
    }
}
