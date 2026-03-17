package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class FlightRepositoryTest {

    @Autowired
    private FlightRepository repository;

    @Test
    void findByCallsign_whenExists_returnsFlight() {
        Flight flight = new Flight();
        flight.setCallsign("DAL8924");
        flight.setTailNumber("N662DN");
        flight.setStatus("ACTIVE");
        repository.save(flight);

        Optional<Flight> found = repository.findByCallsign("DAL8924");

        assertThat(found).isPresent();
        assertThat(found.get().getCallsign()).isEqualTo("DAL8924");
        assertThat(found.get().getTailNumber()).isEqualTo("N662DN");
    }

    @Test
    void findByCallsign_whenNotExists_returnsEmpty() {
        Optional<Flight> found = repository.findByCallsign("UNKNOWN999");
        assertThat(found).isEmpty();
    }
}
