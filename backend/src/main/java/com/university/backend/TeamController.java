package com.university.backend;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

/**
 * Directs HTTP requests to "/api/teams/..." to the proper endpoints
 * Services in this module respond to GET requests.
 */
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    /** Used to query about teams */
   @Autowired
   TeamRepository repo;

    /**
     * Handles GET requests to "/api/teams" and provides a ResonseEntity
     * encapsulating a list where each member is the mapped data of a team.
     * 
     * @return RespnseEntity<?> holding a status code and encapsulated body
     */
    @GetMapping("")
    public ResponseEntity<List<Map<String, String>>> getTeams() {
        // all flights from FlightRepository,
        List<Team> teams = repo.findAll();
        if (teams.isEmpty()) {return ResponseEntity.status(500).build();}

        // one set of mappings per team (teamDataSet), all teams held in teamMappings
        List<Map<String, String>> teamMappings;
        Map<String, String> teamDataSet;

        // map data for each team
        teamMappings = new ArrayList<Map<String, String>>();
        for (Team t : teams) {
            teamDataSet = new HashMap<String, String>();
            teamDataSet.put("teamName", t.getName());
            teamDataSet.put("teamId", t.getNbaTeamId());
            teamDataSet.put("division", t.getDivision());
            teamDataSet.put("city", t.getCity());
            teamDataSet.put("callSign", t.getCallsign());
            teamMappings.add(teamDataSet);
        }
        // encapsulate list of team mappings into a response body, with code 200 
        return ResponseEntity.ok(teamMappings);
    }
}
