package com.university.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByCallsignIsNotNull();

    Optional<Team> findByCallsign(String callsign);
}
