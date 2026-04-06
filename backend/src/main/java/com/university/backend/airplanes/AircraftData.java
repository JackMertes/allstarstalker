package com.university.backend.airplanes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AircraftData {

    @JsonProperty("r")
    private String tailNumber;

    @JsonProperty("t")
    private String aircraftType;

    @JsonProperty("lat")
    private BigDecimal latitude;

    @JsonProperty("lon")
    private BigDecimal longitude;

    @JsonProperty("alt_baro")
    private Integer altitudeBaro;

    @JsonProperty("alt_geom")
    private Integer altitudeGeom;

    @JsonProperty("gs")
    private BigDecimal groundSpeed;

    @JsonProperty("track")
    private BigDecimal track;

    @JsonProperty("baro_rate")
    private Integer baroRate;

    @JsonProperty("flight")
    private String flightNumber;

    @JsonProperty("squawk")
    private String squawk;

    @JsonProperty("desc")
    private String description;

    @JsonProperty("ownOp")
    private String ownerOperator;

    @JsonProperty("year")
    private String year;

    @JsonProperty("seen")
    private Double seen;

    public String getTailNumber() {
        return tailNumber;
    }

    public void setTailNumber(String tailNumber) {
        this.tailNumber = tailNumber;
    }

    public String getAircraftType() {
        return aircraftType;
    }

    public void setAircraftType(String aircraftType) {
        this.aircraftType = aircraftType;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public Integer getAltitudeBaro() {
        return altitudeBaro;
    }

    public void setAltitudeBaro(Integer altitudeBaro) {
        this.altitudeBaro = altitudeBaro;
    }

    public BigDecimal getGroundSpeed() {
        return groundSpeed;
    }

    public void setGroundSpeed(BigDecimal groundSpeed) {
        this.groundSpeed = groundSpeed;
    }

    public BigDecimal getTrack() {
        return track;
    }

    public void setTrack(BigDecimal track) {
        this.track = track;
    }

    public Integer getAltitudeGeom() {
        return altitudeGeom;
    }

    public void setAltitudeGeom(Integer altitudeGeom) {
        this.altitudeGeom = altitudeGeom;
    }

    public Integer getBaroRate() {
        return baroRate;
    }

    public void setBaroRate(Integer baroRate) {
        this.baroRate = baroRate;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getSquawk() {
        return squawk;
    }

    public void setSquawk(String squawk) {
        this.squawk = squawk;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerOperator() {
        return ownerOperator;
    }

    public void setOwnerOperator(String ownerOperator) {
        this.ownerOperator = ownerOperator;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Double getSeen() {
        return seen;
    }

    public void setSeen(Double seen) {
        this.seen = seen;
    }
}
