package com.university.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByCallsign(String callsign);

    List<Flight> findByStatus(String status);
}
