package com.university.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class FlightRefreshServiceTest {

    private MockRestServiceServer mockServer;

    @Autowired
    private FlightRefreshService refreshService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    @Qualifier("airplanesLiveRestTemplate")
    private RestTemplate airplanesLiveRestTemplate;

    @BeforeEach
    void setUp() {
        mockServer = MockRestServiceServer.createServer(airplanesLiveRestTemplate);
    }

    @Test
    void refreshByCallsign_whenFlying_savesFlightWithLiveData() {
        Team team = new Team();
        team.setName("Denver Nuggets");
        team.setAbbreviation("DEN");
        team.setCity("Denver");
        team.setCallsign("DAL8924");
        teamRepository.save(team);

        String json = """
            {"total":1,"now":1772142652001,"ctime":1772142652001,"msg":"No error","ac":[{"r":"N662DN","t":"B752","lat":37.729844,"lon":-102.776443,"alt_baro":33000,"gs":559.9,"track":125.99}]}
            """;
        mockServer.expect(requestTo("https://api.airplanes.live/v2/callsign/DAL8924"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        boolean done = refreshService.refreshByCallsign("DAL8924");

        assertThat(done).isTrue();
        var saved = flightRepository.findByCallsign("DAL8924");
        assertThat(saved).isPresent();
        assertThat(saved.get().getStatus()).isEqualTo("ACTIVE");
        assertThat(saved.get().getTailNumber()).isEqualTo("N662DN");
        assertThat(saved.get().getLiveLatitude()).isEqualByComparingTo(new BigDecimal("37.729844"));
        assertThat(saved.get().getLiveAltitudeFt()).isEqualTo(33000);
        mockServer.verify();
    }

    @Test
    void refreshByCallsign_whenNotFlying_preservesExisting() {
        Team team = new Team();
        team.setName("Boston Celtics");
        team.setAbbreviation("BOS");
        team.setCity("Boston");
        team.setCallsign("DAL8919");
        teamRepository.save(team);

        Flight existing = new Flight();
        existing.setCallsign("DAL8919");
        existing.setStatus("ACTIVE");
        existing.setLiveLatitude(new BigDecimal("40.0"));
        existing.setLiveLongitude(new BigDecimal("-75.0"));
        flightRepository.save(existing);

        String json = """
            {"total":0,"now":1772142652001,"msg":"No error","ac":[]}
            """;
        mockServer.expect(requestTo("https://api.airplanes.live/v2/callsign/DAL8919"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        boolean done = refreshService.refreshByCallsign("DAL8919");

        assertThat(done).isTrue();
        var saved = flightRepository.findByCallsign("DAL8919");
        assertThat(saved).isPresent();
        assertThat(saved.get().getStatus()).isEqualTo("UNKNOWN");
        assertThat(saved.get().getLiveLatitude()).isEqualByComparingTo(new BigDecimal("40.0"));
        mockServer.verify();
    }

    @Test
    void refreshByCallsign_unknownCallsign_returnsFalse() {
        boolean done = refreshService.refreshByCallsign("UNKNOWN999");
        assertThat(done).isFalse();
    }
}
