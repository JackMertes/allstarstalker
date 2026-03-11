package com.university.backend;

import com.university.backend.airplanes.AirplanesLiveResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class AirplanesLiveClient {

    private static final String BASE_URL = "https://api.airplanes.live/v2/callsign";

    private final RestTemplate restTemplate;

    public AirplanesLiveClient(@Qualifier("airplanesLiveRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetches live ADS-B data for the given callsign.
     *
     * @param callsign e.g. "DAL8924"
     * @return response with total, now/ctime, and aircraft list; or null on error
     */
    public AirplanesLiveResponse fetchByCallsign(String callsign) {
        if (callsign == null || callsign.isBlank()) {
            return null;
        }
        String encoded = URLEncoder.encode(callsign.trim(), StandardCharsets.UTF_8);
        String url = BASE_URL + "/" + encoded;
        try {
            ResponseEntity<AirplanesLiveResponse> response = restTemplate.getForEntity(
                    URI.create(url),
                    AirplanesLiveResponse.class
            );
            return response.getBody();
        } catch (RestClientException e) {
            return null;
        }
    }
}
