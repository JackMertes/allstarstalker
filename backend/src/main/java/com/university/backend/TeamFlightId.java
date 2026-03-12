package com.university.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TeamFlightId implements Serializable {

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "flight_id")
    private Long flightId;

    public TeamFlightId() {
    }

    public TeamFlightId(Long teamId, Long flightId) {
        this.teamId = teamId;
        this.flightId = flightId;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeamFlightId that)) return false;
        return Objects.equals(teamId, that.teamId) &&
               Objects.equals(flightId, that.flightId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(teamId, flightId);
    }
}