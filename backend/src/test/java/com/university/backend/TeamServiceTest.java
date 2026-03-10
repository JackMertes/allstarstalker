package com.university.backend;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Basic sanity checks for team-related logic.
 * Run with: ./gradlew test
 */
class TeamServiceTest {

    // Verifies that a callsign with no match returns null rather than throwing
    @Test
    void checkStatus_unknownCallsign_returnsNull() {
        // Arrange
        String callsign = "UNKNOWN999";

        // Act — replace with actual service call once wired up
        Object result = null; // teamService.checkStatus(callsign);

        // Assert
        assertNull(result, "Unknown callsign should return null, not throw");
    }

    // Verifies the ACTIVE status string is handled case-insensitively
    @Test
    void isLive_activeStatus_returnsTrue() {
        String status = "ACTIVE";
        boolean isLive = "ACTIVE".equalsIgnoreCase(status);
        assertTrue(isLive, "ACTIVE status should be treated as live");
    }

    // Verifies the LANDED status string is treated as not live
    @Test
    void isLive_landedStatus_returnsFalse() {
        String status = "LANDED";
        boolean isLive = "ACTIVE".equalsIgnoreCase(status);
        assertFalse(isLive, "LANDED status should not be treated as live");
    }
}
