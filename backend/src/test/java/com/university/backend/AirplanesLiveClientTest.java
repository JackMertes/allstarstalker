package com.university.backend;

import com.university.backend.airplanes.AircraftData;
import com.university.backend.airplanes.AirplanesLiveResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class AirplanesLiveClientTest {

    private MockRestServiceServer mockServer;

    @Autowired
    private AirplanesLiveClient client;

    @Autowired
    @Qualifier("airplanesLiveRestTemplate")
    private RestTemplate airplanesLiveRestTemplate;

    @BeforeEach
    void setUp() {
        mockServer = MockRestServiceServer.createServer(airplanesLiveRestTemplate);
    }

    @Test
    void fetchByCallsign_returnsParsedResponse() {
        String json = """
            {"total":1,"now":1772142652001,"ctime":1772142652001,"msg":"No error","ac":[{"r":"N662DN","t":"B752","lat":37.729844,"lon":-102.776443,"alt_baro":33000,"gs":559.9,"track":125.99}]}
            """;
        mockServer.expect(requestTo("https://api.airplanes.live/v2/callsign/DAL8924"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        AirplanesLiveResponse response = client.fetchByCallsign("DAL8924");

        assertThat(response).isNotNull();
        assertThat(response.getTotal()).isEqualTo(1);
        assertThat(response.getNow()).isEqualTo(1772142652001L);
        assertThat(response.getAircraft()).hasSize(1);
        AircraftData ac = response.getAircraft().get(0);
        assertThat(ac.getTailNumber()).isEqualTo("N662DN");
        assertThat(ac.getAircraftType()).isEqualTo("B752");
        assertThat(ac.getLatitude()).isEqualByComparingTo(new BigDecimal("37.729844"));
        assertThat(ac.getAltitudeBaro()).isEqualTo(33000);
        mockServer.verify();
    }

    @Test
    void fetchByCallsign_nullCallsign_returnsNull() {
        assertThat(client.fetchByCallsign(null)).isNull();
        assertThat(client.fetchByCallsign("")).isNull();
    }
}
