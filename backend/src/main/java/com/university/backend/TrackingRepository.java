package com.university.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TrackingRepository extends JpaRepository<TrackingItem, Long> {
	@Transactional
	@Modifying
	@Query("DELETE FROM TrackingItem t WHERE LOWER(t.callsign) = LOWER(:callsign)")
	long deleteByCallsignIgnoreCase(@Param("callsign") String callsign);
}
