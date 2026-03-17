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

    @JsonProperty("gs")
    private BigDecimal groundSpeed;

    @JsonProperty("track")
    private BigDecimal track;

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
}
