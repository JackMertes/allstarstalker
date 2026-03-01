package com.university.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.List;

/**
 * GET /api/tracked - returns list of tracked items (expected by frontend TrackingPage).
 */
@RestController
@RequestMapping("/api")
public class TrackedController {

    @GetMapping("/tracked")
    public List<?> getTracked() {
        return Collections.emptyList();
    }
}
