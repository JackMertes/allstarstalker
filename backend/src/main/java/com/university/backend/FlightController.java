package com.university.backend;

// import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


/**
 * Directs HTTP requests mapped to "/api/flights/..." to the proper endpoints
 * Services in this module respond to GET requests.
*/
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    /** Used to query about flights */
    @Autowired
    private FlightRepository repo;

    /**
     * Handles GET requests to "/api/flights" and provides a RepsonseEntity 
     * encapsulating a list where each member is the mapped data of a flight.
     * 
     * @return ResponseEntity<?> holding a status code and encapsulated body   
    */
    @GetMapping("")
    public ResponseEntity<List<Map<String, String>>> getAllFlights() {
        // all flights from db
        List<Flight> flights = repo.findAll();
        if (flights.isEmpty()) {return ResponseEntity.status(500).build();}

        // one set of mappings per flight (flightDataSet), all flights held in flightMappings
        List<Map<String, String>> flightMappings;
        Map<String, String> flightDataSet;

        // map data for each flight 
        flightMappings = new ArrayList<Map<String, String>>();
        for (Flight f : flights) {
            flightDataSet = new HashMap<String, String>();
            flightDataSet.put("externalFlightId", f.getExternalFlightId());
            flightDataSet.put("aircraftType", f.getAircraftType());
            flightDataSet.put("callSign", f.getCallsign());
            flightDataSet.put("flightNumber", f.getFlightNumber());
            flightDataSet.put("airlineIata", f.getAirlineIata());
            flightDataSet.put("departureScheduleUtc", f.getDepartureScheduledUtc().toString());
            flightDataSet.put("tailNumber", f.getTailNumber());
            flightMappings.add(flightDataSet);
        }

        // encapsulate list of flight mappings into a response body, with code 200
        return ResponseEntity.ok(flightMappings);
    }

    /**
     * Handles GET requests to "/api/flights/search" and provides a ResponseEntity
     * encapsulating a key/value mapping of one flight's data.
     * 
     * @param String searchTerm is used to filter through flights by propery: ?, default to null
     * @return ResponseEntity<?> holding a status code and encapsulated body
    */
    @GetMapping("/search")
    public ResponseEntity<Map<String, String>> search(@RequestParam(required = false) String searchTerm) {

        // query database
        Optional<Flight> repoFlights = repo.findByCallsign(searchTerm);

        // respond with error (400) if client does not provide search term
        if (searchTerm == null) {return ResponseEntity.badRequest().build();}
        
        // if db does not return anoything, respond with error (500)
        if (!repoFlights.isPresent()) {return ResponseEntity.status(500).build();}
        Map<String, String> flightDataSet = new HashMap<>();

        flightDataSet.put("externalFlightId", repoFlights.get().getExternalFlightId());
        flightDataSet.put("aircraftType", repoFlights.get().getAircraftType());
        flightDataSet.put("callSign", repoFlights.get().getCallsign());
        flightDataSet.put("flightNumber", repoFlights.get().getFlightNumber());
        flightDataSet.put("airlineIata", repoFlights.get().getAirlineIata());
        flightDataSet.put("departureScheduleUtc()", repoFlights.get().getDepartureScheduledUtc().toString());
        flightDataSet.put("tailNumber", repoFlights.get().getTailNumber());
        
        return ResponseEntity.ok(flightDataSet);
    }

    /**
     * Handles GET requests to "/api/flights/{flightId}" and provides a ResponseEntity
     * encapsulating a key/value mapping of one flight's data.
     * 
     * @param long flightId is a search term used to filter through flights
     * @return ResponseEntity<?> holding a status code and encapsulated body
    */
    @GetMapping("/{flightId}")
    public ResponseEntity<Map<String, String>> getByFlightID(@PathVariable long flightId) {
        Map<String, String> flightData = new HashMap<>();
        Flight flight = repo.getReferenceById(flightId);

        flightData.put("id", flight.getId().toString());
        //flightData.put("externalFlightId", flight.getExternalFlightId());
        //flightData.put("aircraftType", flight.getAircraftType());
        flightData.put("callSign", flight.getCallsign());
        flightData.put("flightNumber", flight.getFlightNumber());
        //flightData.put("airlineIata", flight.getAirlineIata());
        //flightData.put("departureScheduleUtc", flight.getDepartureScheduledUtc().toString());
        //flightData.put("tailNumber", flight.getTailNumber());
        flightData.put("status", flight.getStatus());

        return ResponseEntity.ok(flightData);
    }

    /**
     * Handles GET requests to "/api/flights/{flightId}/details" and provides a
     * ResponseEntity encapsulating a key/value mapping of one flight's data.
     * 
     * Similar to getByFlightID but provides more details. 
     * 
     * @param long flightId is a search term used to filter through flights
     * @return ResponseEntity<?> holding a status code and encapsulated body
    */
    @GetMapping("/{flightId}/details")
    public ResponseEntity<Map<String, String>> getDetails(@PathVariable long flightId) {
        Flight flight = repo.getReferenceById(flightId);

        Map<String, String> flightData = new HashMap<>();
        flightData.put("id", flight.getId().toString());
        flightData.put("externalFlightId", flight.getExternalFlightId());
        flightData.put("aircraftType", flight.getAircraftType());
        flightData.put("callSign", flight.getCallsign());
        flightData.put("flightNumber", flight.getFlightNumber());
        flightData.put("airlineIata", flight.getAirlineIata());
        flightData.put("departureScheduleUtc", flight.getDepartureScheduledUtc().toString());
        flightData.put("tailNumber", flight.getTailNumber());
        flightData.put("status", flight.getStatus());

        // encapsulate flight data map into a response body, with code 200
        return ResponseEntity.ok(flightData);
    }

    /**
     * Handles GET requests to "/api/flights/active" and provides a ResponseEntity
     * encapsulating a list of active flights. 
     * 
     * @return ResponseEntity<?> holding a status code and encapsulated body
    */
    @GetMapping("/active")
    public ResponseEntity<List<Map<String, String>>> getActive() {

        // query the databse, return status code 400 if nothing found
        List<Flight> flights = repo.findAll();
        if (flights.isEmpty()) return ResponseEntity.badRequest().build();

        // one set of mappings per flight (flightDataSet) all to be held in flightMappings
        List<Map<String, String>> flightDataMappings;
        Map<String, String> flightData;

        // map data for each flight
        flightDataMappings = new ArrayList<Map<String, String>>();
        for (Flight f : flights) {
            if (f.getStatus().equals("active")) {
                flightData = new HashMap<String, String>();

                flightData.put("id", f.getId().toString());
                flightData.put("callSign", f.getCallsign());
                flightData.put("flightNumber", f.getFlightNumber());
                flightDataMappings.add(flightData);
            }
        }

        // encapsulate list of flight mappings into a response body, with code 200
        return ResponseEntity.ok(flightDataMappings);
    }

    /**
     * Handles GET requests to "/api/flights/{flightId}/positions" and provides a 
     * ResponseEntity encapsulating the position of flights identified by flightId
     * 
     * @param long flightId is a search term used to filter through flights
     * @return ResponseEntity<?> holding status code and encapsulated body
    */
    @GetMapping("/{flightId}/positions")
    public ResponseEntity<Map<String, Object>> getPositions(@PathVariable long flightId) {
        
        // query result
        Flight flight = repo.getReferenceById(flightId);
        if (flight == null) {return ResponseEntity.status(500).build();}

        // map flight's position-relevant data
        Map<String, Object> flightData = new HashMap<String, Object>();
        flightData.put("flightId", flightId);
        flightData.put("liveLatitude", flight.getLiveLatitude());
        flightData.put("liveLongitude", flight.getLiveLongitude());
        flightData.put("liveAltitudeFt", flight.getLiveAltitudeFt());
        flightData.put("liveHeadingDeg", flight.getLiveHeadingDeg());
        flightData.put("lastSeenUtc", flight.getLastSeenUtc());
        flightData.put("updatedAt", flight.getUpdatedAt());
        flightData.put("departureScheduledUtc", flight.getDepartureScheduledUtc());
        flightData.put("liveHeadingDegree", flight.getLiveHeadingDeg());

        // encapsulate the body with status 200
        return ResponseEntity.ok(flightData);
    }
    
}