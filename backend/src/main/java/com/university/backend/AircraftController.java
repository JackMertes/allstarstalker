package com.university.backend;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.university.backend.airplanes.AircraftData;
import com.university.backend.airplanes.AirplanesLiveResponse;
// import com.university.backend.AirportRepository;

import java.util.List;
import java.util.Map;

// import static org.mockito.Mockito.mock;

import java.util.ArrayList;
import java.util.HashMap;

/*
 * Handles the services mapped to "/api/aircraft/..."
 * Services in this module are all GET
 * In Progress (note to self - aircraftID needs implementation in database before fix).
*/
@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    /** Retrieve list of planes from db */
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
        if (planes.isEmpty()) {return ResponseEntity.status(500).build();}

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
        try {
            return restTemplate.getForEntity(
                    "https://allanswers.com/api/aircraft/" + aircraftId,
                    Object.class);
        } catch (Exception e) {
            return ResponseEntity.ok(mock.getAircraftById(aircraftId));
        }
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

        List<AircraftData> planes = repo.getAircraft();
        if (planes == null) {return ResponseEntity.status(500).build();}

        AircraftData desiredAircraft = null;
        for (AircraftData aircraft : planes) {
            if (tailNumber.equals(aircraft.getTailNumber())){
                desiredAircraft = aircraft;
            }
        }
        if (desiredAircraft == null) {return ResponseEntity.status(500).build();}

        Map<String, String> aircraftData = new HashMap<String, String>();
        aircraftData.put("aircraftType", desiredAircraft.getAircraftType());
        aircraftData.put("track", desiredAircraft.getTrack().toString());
        aircraftData.put("latitude", desiredAircraft.getLatitude().toString());
        aircraftData.put("longitude", desiredAircraft.getLatitude().toString());

        return ResponseEntity.ok(aircraftData);
    }
}