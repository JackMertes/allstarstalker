package com.university.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final MockDataService mockDataService;

    @Autowired
    public TeamController(MockDataService mockDataService) {
        this.mockDataService = mockDataService;
    }

    @GetMapping("")
    public List<Map<String, Object>> getTeams() {
        return mockDataService.getTeams();
    }
}
