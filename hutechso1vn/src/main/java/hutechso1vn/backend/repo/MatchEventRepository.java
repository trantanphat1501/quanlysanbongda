package hutechso1vn.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hutechso1vn.backend.entity.MatchEvent;
import hutechso1vn.backend.entity.MatchEvent.EventType;

public interface MatchEventRepository extends JpaRepository<MatchEvent, Integer> {
    List<MatchEvent> findByMatchIdAndDeletedFalseOrderByMinuteAsc(Integer matchId);
    List<MatchEvent> findByMatchIdAndEventTypeAndDeletedFalse(Integer matchId, EventType eventType);
    List<MatchEvent> findByTeamIdAndDeletedFalse(Integer teamId);
    List<MatchEvent> findByPlayerIdAndDeletedFalse(Integer playerId);
}
