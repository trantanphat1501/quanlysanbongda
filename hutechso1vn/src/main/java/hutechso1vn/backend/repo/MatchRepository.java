package hutechso1vn.backend.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hutechso1vn.backend.entity.Match;
import hutechso1vn.backend.entity.Match.MatchStatus;

public interface MatchRepository extends JpaRepository<Match, Integer> {
    List<Match> findByDeletedFalse();
    List<Match> findByTournamentIdAndDeletedFalse(Integer tournamentId);
    List<Match> findByTournamentIdAndDeletedFalseOrderByMatchDateAsc(Integer tournamentId);
    List<Match> findByTournamentIdAndRoundAndDeletedFalse(Integer tournamentId, String round);
    List<Match> findByStatus(MatchStatus status);
    
    @Query("SELECT m FROM Match m WHERE m.deleted = false AND " +
           "(m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId)")
    List<Match> findByTeamId(@Param("teamId") Integer teamId);
    
    @Query("SELECT m FROM Match m WHERE m.deleted = false AND " +
           "m.matchDate BETWEEN :startDate AND :endDate ORDER BY m.matchDate ASC")
    List<Match> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);
}
