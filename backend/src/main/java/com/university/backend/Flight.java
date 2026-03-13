package com.university.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_flight_id", length = 64)
    private String externalFlightId;

    @Column(name = "flight_date")
    private LocalDate flightDate;

    @Column(name = "flight_status_raw", length = 16)
    private String flightStatusRaw;

    @Column(name = "tail_number", length = 16)
    private String tailNumber;

    @Column(length = 16)
    private String callsign;

    @Column(name = "airline_icao", length = 3)
    private String airlineIcao;

    @Column(name = "airline_iata", length = 2)
    private String airlineIata;

    @Column(name = "flight_number", length = 16)
    private String flightNumber;

    @Column(name = "flight_iata", length = 16)
    private String flightIata;

    @Column(name = "flight_icao", length = 16)
    private String flightIcao;

    @Column(name = "aircraft_type", length = 16)
    private String aircraftType;

    @Column(name = "departure_airport_id", nullable = false)
    private Long departureAirportId;

    @Column(name = "arrival_airport_id", nullable = false)
    private Long arrivalAirportId;

    @Column(name = "departure_scheduled_utc")
    private LocalDateTime departureScheduledUtc;

    @Column(name = "arrival_scheduled_utc")
    private LocalDateTime arrivalScheduledUtc;

    @Column(length = 16)
    private String status;

    @Column(name = "total_flight_time_min")
    private Integer totalFlightTimeMin;

    @Column(name = "live_updated_utc")
    private LocalDateTime liveUpdatedUtc;

    @Column(name = "live_latitude", precision = 9, scale = 6)
    private BigDecimal liveLatitude;

    @Column(name = "live_longitude", precision = 9, scale = 6)
    private BigDecimal liveLongitude;

    @Column(name = "live_altitude_m", precision = 10, scale = 3)
    private BigDecimal liveAltitudeM;

    @Column(name = "max_altitude_m", precision = 10, scale = 3)
    private BigDecimal maxAltitudeM;

    @Column(name = "last_seen_utc")
    private LocalDateTime lastSeenUtc;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalFlightId() {
        return externalFlightId;
    }

    public void setExternalFlightId(String externalFlightId) {
        this.externalFlightId = externalFlightId;
    }

    public LocalDate getFlightDate() {
        return flightDate;
    }

    public void setFlightDate(LocalDate flightDate) {
        this.flightDate = flightDate;
    }

    public String getFlightStatusRaw() {
        return flightStatusRaw;
    }

    public void setFlightStatusRaw(String flightStatusRaw) {
        this.flightStatusRaw = flightStatusRaw;
    }

    public String getTailNumber() {
        return tailNumber;
    }

    public void setTailNumber(String tailNumber) {
        this.tailNumber = tailNumber;
    }

    public String getCallsign() {
        return callsign;
    }

    public void setCallsign(String callsign) {
        this.callsign = callsign;
    }

    public String getAirlineIcao() {
        return airlineIcao;
    }

    public void setAirlineIcao(String airlineIcao) {
        this.airlineIcao = airlineIcao;
    }

    public String getAirlineIata() {
        return airlineIata;
    }

    public void setAirlineIata(String airlineIata) {
        this.airlineIata = airlineIata;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getFlightIata() {
        return flightIata;
    }

    public void setFlightIata(String flightIata) {
        this.flightIata = flightIata;
    }

    public String getFlightIcao() {
        return flightIcao;
    }

    public void setFlightIcao(String flightIcao) {
        this.flightIcao = flightIcao;
    }

    public String getAircraftType() {
        return aircraftType;
    }

    public void setAircraftType(String aircraftType) {
        this.aircraftType = aircraftType;
    }

    public Long getDepartureAirportId() {
        return departureAirportId;
    }

    public void setDepartureAirportId(Long departureAirportId) {
        this.departureAirportId = departureAirportId;
    }

    public Long getArrivalAirportId() {
        return arrivalAirportId;
    }

    public void setArrivalAirportId(Long arrivalAirportId) {
        this.arrivalAirportId = arrivalAirportId;
    }

    public LocalDateTime getDepartureScheduledUtc() {
        return departureScheduledUtc;
    }

    public void setDepartureScheduledUtc(LocalDateTime departureScheduledUtc) {
        this.departureScheduledUtc = departureScheduledUtc;
    }

    public LocalDateTime getArrivalScheduledUtc() {
        return arrivalScheduledUtc;
    }

    public void setArrivalScheduledUtc(LocalDateTime arrivalScheduledUtc) {
        this.arrivalScheduledUtc = arrivalScheduledUtc;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalFlightTimeMin() {
        return totalFlightTimeMin;
    }

    public void setTotalFlightTimeMin(Integer totalFlightTimeMin) {
        this.totalFlightTimeMin = totalFlightTimeMin;
    }

    public LocalDateTime getLiveUpdatedUtc() {
        return liveUpdatedUtc;
    }

    public void setLiveUpdatedUtc(LocalDateTime liveUpdatedUtc) {
        this.liveUpdatedUtc = liveUpdatedUtc;
    }

    public BigDecimal getLiveLatitude() {
        return liveLatitude;
    }

    public void setLiveLatitude(BigDecimal liveLatitude) {
        this.liveLatitude = liveLatitude;
    }

    public BigDecimal getLiveLongitude() {
        return liveLongitude;
    }

    public void setLiveLongitude(BigDecimal liveLongitude) {
        this.liveLongitude = liveLongitude;
    }

    public BigDecimal getLiveAltitudeM() {
        return liveAltitudeM;
    }

    public void setLiveAltitudeM(BigDecimal liveAltitudeM) {
        this.liveAltitudeM = liveAltitudeM;
    }

    public BigDecimal getMaxAltitudeM() {
        return maxAltitudeM;
    }

    public void setMaxAltitudeM(BigDecimal maxAltitudeM) {
        this.maxAltitudeM = maxAltitudeM;
    }

    public LocalDateTime getLastSeenUtc() {
        return lastSeenUtc;
    }

    public void setLastSeenUtc(LocalDateTime lastSeenUtc) {
        this.lastSeenUtc = lastSeenUtc;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}