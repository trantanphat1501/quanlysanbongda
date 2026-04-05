package hutechso1vn.backend.dto;

import hutechso1vn.backend.entity.MatchEvent.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchEventRequest {
    private Integer matchId;
    private Integer teamId;
    private Integer playerId;
    private EventType eventType;
    private Integer minute;
    private String description;
}
