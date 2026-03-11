package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class TeamRepositoryTest {

    @Autowired
    private TeamRepository repository;

    @Test
    void findByCallsignIsNotNull_returnsOnlyTeamsWithCallsign() {
        Team withCallsign = new Team();
        withCallsign.setName("Atlanta Hawks");
        withCallsign.setAbbreviation("ATL");
        withCallsign.setCity("Atlanta");
        withCallsign.setCallsign("DAL8918");
        repository.save(withCallsign);

        Team withoutCallsign = new Team();
        withoutCallsign.setName("Some Other Team");
        withoutCallsign.setAbbreviation("SOT");
        withoutCallsign.setCity("Somewhere");
        withoutCallsign.setCallsign(null);
        repository.save(withoutCallsign);

        List<Team> withCallsigns = repository.findByCallsignIsNotNull();

        assertThat(withCallsigns).isNotEmpty();
        assertThat(withCallsigns).allMatch(t -> t.getCallsign() != null && !t.getCallsign().isEmpty());
        assertThat(withCallsigns.stream().filter(t -> "DAL8918".equals(t.getCallsign()))).hasSize(1);
    }

    @Test
    void findByCallsign_whenExists_returnsTeam() {
        Team team = new Team();
        team.setName("Boston Celtics");
        team.setAbbreviation("BOS");
        team.setCity("Boston");
        team.setCallsign("DAL8919");
        repository.save(team);

        assertThat(repository.findByCallsign("DAL8919")).isPresent();
        assertThat(repository.findByCallsign("DAL8919").get().getName()).isEqualTo("Boston Celtics");
    }
}
