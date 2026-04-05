package hutechso1vn.backend.repo;

import hutechso1vn.backend.entity.TournamentTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentTeamRepository extends JpaRepository<TournamentTeam, Integer> {
    List<TournamentTeam> findByTournamentId(Integer tournamentId);
    Optional<TournamentTeam> findByTournamentIdAndTeamId(Integer tournamentId, Integer teamId);
}
