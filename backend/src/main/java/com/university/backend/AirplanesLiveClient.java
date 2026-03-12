package com.university.backend;

import com.university.backend.airplanes.AirplanesLiveResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class AirplanesLiveClient {

    private static final Logger log = LoggerFactory.getLogger(AirplanesLiveClient.class);
    private static final String BASE_URL = "https://api.airplanes.live/v2/callsign";
    private static final int MAX_RETRIES = 2;
    private static final long RETRY_DELAY_MS = 60_000;

    private final RestTemplate restTemplate;

    public AirplanesLiveClient(@Qualifier("airplanesLiveRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetches live ADS-B data for the given callsign. On 429 Too Many Requests,
     * waits 60 seconds and retries up to 2 times before returning null.
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

        int attempts = 0;
        while (true) {
            try {
                ResponseEntity<AirplanesLiveResponse> response = restTemplate.getForEntity(
                        URI.create(url),
                        AirplanesLiveResponse.class
                );
                return response.getBody();
            } catch (RestClientException e) {
                if (e instanceof HttpStatusCodeException ex && ex.getStatusCode().value() == 429
                        && attempts < MAX_RETRIES) {
                    attempts++;
                    log.warn("Airplanes.live 429 rate limit for {} - retry {}/{} in {}s", callsign, attempts, MAX_RETRIES, RETRY_DELAY_MS / 1000);
                    try {
                        Thread.sleep(RETRY_DELAY_MS);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.warn("Airplanes.live fetch interrupted for {}", callsign);
                        return null;
                    }
                } else {
                    String msg = e instanceof HttpStatusCodeException ex ? ex.getStatusCode() + " " + ex.getStatusText() : e.getMessage();
                    log.warn("Airplanes.live error for {}: {} - returning null", callsign, msg);
                    return null;
                }
            }
        }
    }
}
