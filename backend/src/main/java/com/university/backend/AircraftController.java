package com.university.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.university.backend.airplanes.AircraftData;
import com.university.backend.airplanes.AirplanesLiveResponse;
import com.university.backend.AirportRepository;

import java.util.List;
import java.util.Map;

// import static org.mockito.Mockito.mock;

import java.util.ArrayList;
import java.util.HashMap;

/*
 * Handles the services mapped to "/api/aircraft/..."
 * Services in this module are all GET
 * In Progress (note to self - needs documentation, and fully implemented methods).
*/
@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    /** Retrieve list of planes from db */
    @Autowired
    private AirplanesLiveResponse repo;

    private final RestTemplate restTemplate;
    private final MockDataService mock;

    public AircraftController(RestTemplate restTemplate, MockDataService mock) {
        this.restTemplate = restTemplate;
        this.mock = mock;
    }

    /**
     * Handles GET requests mapped to "/api/aircraft" and provides a ResponseEntity
     * encapsulating a list where each member is the mapped data of a flight.
     * 
     * @return ResponseEntity<?> holding the status code and encapsulated body
     */
    @GetMapping("")
    public ResponseEntity<List<Map<String, String>>> getAllAircraft() {
        
        // repo.findAll();

        List<Map<String, String>> aircraftMappings;
        Map<String, String> aircraftDataSet;
        List<AircraftData> planes = repo.getAircraft();
        if (planes.isEmpty()) {ResponseEntity.badRequest();}

        aircraftMappings = new ArrayList<Map<String, String>>();
        for (AircraftData p : planes) {
            aircraftDataSet = new HashMap<String, String>();
            // aircraftDataSet.put("aircraftId", p.getAircraftId());
            aircraftDataSet.put("aircraftType", p.getAircraftType());
            aircraftDataSet.put("tailNumber", p.getTailNumber());
            aircraftMappings.add(aircraftDataSet);
        }

        return ResponseEntity.ok(aircraftMappings);
    }

    @GetMapping("/{aircraftId}")
    public ResponseEntity<?> getAircraftById(@PathVariable String aircraftId) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/aircraft/" + aircraftId,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAircraftById(aircraftId));
        }
    }

    @GetMapping("/tail/{tailNumber}")
    public ResponseEntity<?> getAircraftByTailNumber(@PathVariable String tailNumber) {
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/aircraft/tail/" + tailNumber,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAircraftByTail(tailNumber));
        }
    }
}