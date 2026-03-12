package com.university.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "team_flights")
public class TeamFlight {

    public enum Role {
        TEAM_CHARTER,
        SHARED_CHARTER,
        UNKNOWN
    }

    @EmbeddedId
    private TeamFlightId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("teamId")
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("flightId")
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role = Role.TEAM_CHARTER;

    @Column
    private Short confidence;

    public TeamFlight() {
    }

    public TeamFlightId getId() {
        return id;
    }

    public void setId(TeamFlightId id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Short getConfidence() {
        return confidence;
    }

    public void setConfidence(Short confidence) {
        this.confidence = confidence;
    }
}