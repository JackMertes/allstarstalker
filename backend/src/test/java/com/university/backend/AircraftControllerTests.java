package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureRestTestClient
@ActiveProfiles("test")
class AircraftControllerTests {

    @Autowired
    private RestTestClient testClient;

    @Autowired
    private AircraftController controller;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
        assertThat(testClient).isNotNull();
    }

    @Test
    void getAllAircraft_returnsMockAircraft() {
        ResponseEntity<List<Map<String, Object>>> response = controller.getAllAircraft();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotEmpty();
        assertThat(response.getBody().get(0)).containsKeys("aircraftId", "tailNumber", "aircraftType");
    }

    @Test
    void getAircraftById_returnsNotFound_forUnknownAircraft() {
        ResponseEntity<?> response = controller.getAircraftById("999");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
