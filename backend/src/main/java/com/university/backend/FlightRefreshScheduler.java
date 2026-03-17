package com.university.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled jobs for flight data ingestion.
 * Full refresh every 2h; flying teams refresh every 10 min.
 */
@Component
public class FlightRefreshScheduler {

    private static final Logger log = LoggerFactory.getLogger(FlightRefreshScheduler.class);

    private final FlightRefreshService refreshService;

    public FlightRefreshScheduler(FlightRefreshService refreshService) {
        this.refreshService = refreshService;
    }

    /** Full refresh of all teams every 2 hours (configurable via ingestion.full-refresh-cron) */
    @Scheduled(cron = "${ingestion.full-refresh-cron:0 0 */2 * * *}")
    public void scheduledFullRefresh() {
        log.debug("Scheduled full refresh triggered");
        int count = refreshService.startRefreshAllAsync();
        if (count == -1) {
            log.debug("Full refresh skipped - already in progress");
        }
    }

    /** Refresh only flying (ACTIVE) teams every 10 min at :05,:15,:25,:35,:45,:55 - never at :00 when full runs */
    @Scheduled(cron = "${ingestion.flying-refresh-cron:0 5,15,25,35,45,55 * * * *}")
    public void scheduledFlyingRefresh() {
        log.debug("Scheduled flying teams refresh triggered");
        refreshService.refreshFlyingTeams();
    }
}
