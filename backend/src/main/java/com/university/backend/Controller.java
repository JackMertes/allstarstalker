package com.university.backend;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class Controller {
    
    /*
	 * Handles POST 
	*/
	@PostMapping("/tracking") // Maps handling to /api/tracked
	public String search(@RequestBody Celeb obj) {

		// a simple checks to ensure consistent input
		if (obj.getTrackingID() != 1)
			return "Only celebs allowed so far(trackingID==1)";

		System.out.println("Tracking ID: " + obj.getTrackingID() + "\n" + 
                            "Entity Type: " + obj.getEntityType() + "\n"  +  
                            "Name: " + obj.getName() + "\n" + 
                            "Time: " + obj.getTime()
        );

		return "Message Received and Parsed";
	}

	/*
	 * Handles GET requests
	*/
	@GetMapping("tracked")
	public String response(@RequestBody) {return "Implementation in Progress"}


}

// simplification of enums and classes/entities should be coord with frontend
//private enum ID {1, 2, 3, 4}
private enum EntityType {CELEBRITY, TEACHING_FACULTY}
private enum Type {FLIGHT, AIRCRAFT, ENTITY}

/*
// common object between entities to inherit from, refactor after 
private static class entity {}
*/
private static class Celeb {
	private int trackingID = 1;
	private EntityType type;
	private String entityName;
	private boolean notif;
	private LocalDateTime time;

	public int getTrackingID() {return trackingID;}
    public String getEntityType() {return type.toString();}
    public String getName() {return entityName;}
    public String getTime() {return time.toString();}
}

private static class Aircraft {
	private int trackingID = 2;
	private Type type;
	private int aircraftID;
	private String tailNum;
	private boolean notif;
	private LocalDateTime time;
}

private static class Flight {
	private int trackingID = 3;
	private Type type = Type.FLIGHT;
	private String flightNum;
	private boolean notif;
	private LocalDateTime time;
}

private static class Faculty {
	private int trackingID = 4;
	private Type type = Type.ENTITY;
	private String name;
	private EntityType entityType;
	private boolean notif;
	private LocalDateTime time;
}
