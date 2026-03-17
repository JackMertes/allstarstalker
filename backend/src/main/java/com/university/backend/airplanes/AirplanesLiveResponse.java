package com.university.backend.airplanes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AirplanesLiveResponse {

    private Integer total;
    private Long now;
    private Long ctime;
    private String msg;

    @JsonProperty("ac")
    private List<AircraftData> aircraft;

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Long getNow() {
        return now;
    }

    public void setNow(Long now) {
        this.now = now;
    }

    public Long getCtime() {
        return ctime;
    }

    public void setCtime(Long ctime) {
        this.ctime = ctime;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public List<AircraftData> getAircraft() {
        return aircraft;
    }

    public void setAircraft(List<AircraftData> aircraft) {
        this.aircraft = aircraft;
    }
}
