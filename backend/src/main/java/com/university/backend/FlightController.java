package com.university.backend;

// import org.apache.catalina.connector.Response;
// import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.stream.Collectors;


/**
 * Directs HTTP requests mapped to "/api/flights/..." to the proper endpoints
 * Services in this module respond to GET requests.
*/
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    /** Used to query about flights */
    private final FlightRepository repo;

    public FlightController(FlightRepository repo) {
        this.repo = repo;
    }

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
        if (flights.isEmpty()) {return ResponseEntity.ok(new ArrayList<>());}

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
        // respond with error (400) if client does not provide search term
        if (searchTerm == null || searchTerm.isBlank()) {return ResponseEntity.badRequest().build();}

        // query database
        Optional<Flight> repoFlights = repo.findByCallsign(searchTerm);
        
        // if db does not return anything, respond with 404
        if (repoFlights.isEmpty()) {return ResponseEntity.notFound().build();}
        Map<String, String> flightDataSet = new HashMap<>();

        Flight flight = repoFlights.get();
        flightDataSet.put("externalFlightId", flight.getExternalFlightId());
        flightDataSet.put("aircraftType", flight.getAircraftType());
        flightDataSet.put("callSign", flight.getCallsign());
        flightDataSet.put("flightNumber", flight.getFlightNumber());
        flightDataSet.put("airlineIata", flight.getAirlineIata());
        if (flight.getDepartureScheduledUtc() != null) {
            flightDataSet.put("departureScheduleUtc", flight.getDepartureScheduledUtc().toString());
        }
        flightDataSet.put("tailNumber", flight.getTailNumber());
        
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
        Optional<Flight> flightOpt = repo.findById(flightId);
        if (flightOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, String> flightData = new HashMap<>();
        Flight flight = flightOpt.get();
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
        Optional<Flight> flightOpt = repo.findById(flightId);
        if (flightOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Flight flight = flightOpt.get();

        Map<String, String> flightData = new HashMap<>();
        flightData.put("id", flight.getId().toString());
        flightData.put("externalFlightId", flight.getExternalFlightId());
        flightData.put("aircraftType", flight.getAircraftType());
        flightData.put("callSign", flight.getCallsign());
        flightData.put("flightNumber", flight.getFlightNumber());
        flightData.put("airlineIata", flight.getAirlineIata());
        if (flight.getDepartureScheduledUtc() != null) {
            flightData.put("departureScheduleUtc", flight.getDepartureScheduledUtc().toString());
        }
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

        List<Flight> flights = repo.findByStatus("ACTIVE");
        if (flights.isEmpty()) return ResponseEntity.ok(new ArrayList<>());

        List<Map<String, String>> flightDataMappings = flights.stream()
                .map(f -> {
                    Map<String, String> flightData = new HashMap<>();
                    flightData.put("id", f.getId().toString());
                    flightData.put("callSign", f.getCallsign());
                    flightData.put("flightNumber", f.getFlightNumber());
                    return flightData;
                })
                .collect(Collectors.toList());

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
        
        Optional<Flight> flightOpt = repo.findById(flightId);
        if (flightOpt.isEmpty()) {return ResponseEntity.notFound().build();}
        Flight flight = flightOpt.get();

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
