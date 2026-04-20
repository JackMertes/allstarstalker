package com.university.backend;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("flywaymysql")
@Tag("mysql")
class FlywayMySqlIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TrackingRepository trackingRepository;

    @Test
    void contextLoads_withFlywayOnCleanMySql_createsTrackedItemsSchemaAndSeedData() {
        Integer trackedItemsTableCount = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = DATABASE()
                  AND table_name = 'tracked_items'
                """,
                Integer.class
        );

        Integer appliedMigrationCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success = 1",
                Integer.class
        );

        assertThat(trackedItemsTableCount).isEqualTo(1);
        assertThat(appliedMigrationCount).isGreaterThanOrEqualTo(6);
        assertThat(trackingRepository.count()).isEqualTo(4);
    }
}
