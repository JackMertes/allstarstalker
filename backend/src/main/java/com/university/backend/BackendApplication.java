package com.university.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;

@SpringBootApplication
@RestController
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	/*
	 * Handles POST 
	*/
	@PostMapping("/api/tracked")
	public String search(@RequestBody celeb obj) {

		// some simple checks to ensure consistent input
		if (obj.getTrackingID != 1)
			return "Only celebs allowed so far(trackingID==1)";


		return "Message Received and Parsed";
	}

	/*
	 * Handles GET requests
	*/
	@GetMapping("/api/tracked")
	public String response(@RequestBody) {

		return "Implementation in Progress"
	}
	
}

// simplification of enums and classes/entities should be coord with frontend
//private enum ID {1, 2, 3, 4}
private enum EntityType {CELEBRITY, TEACHING_FACULTY}
private enum Type {FLIGHT, AIRCRAFT, ENTITY}

private static class celeb {
	private int trackingID = 1;
	private EntityType type;
	private String entityName;
	private boolean notif;
	private LocalDateTime time;
	private int getTrackingID() {return trackindID;}
}

private static class aircraft {
	private int trackingID = 2;
	private Type type;
	private int aircraftID;
	private String tailNum;
	private boolean notif;
	private LocalDateTime time;
}

private static class flight {
	private int trackingID = 3;
	private Type type = Type.FLIGHT;
	private String flightNum;
	private boolean notif;
	private LocalDateTime time;
}

private static class faculty {
	private int trackingID = 4;
	private Type type = Type.ENTITY;
	private String name;
	private EntityType entityType;
	private boolean notif;
	private LocalDateTime time;
}

/* For reference but to be deleted:
@SpringBootApplication
@RestController
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }
}


*/