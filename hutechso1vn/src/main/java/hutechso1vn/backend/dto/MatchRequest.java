package hutechso1vn.backend.dto;

import java.time.LocalDateTime;

import hutechso1vn.backend.entity.Match.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {
    private Integer tournamentId;
    private Integer homeTeamId;
    private Integer awayTeamId;
    private Integer sanBongId;
    private LocalDateTime matchDate;
    private String round;
    private Integer homeScore;
    private Integer awayScore;
    private MatchStatus status;
    private String referee;
    private String notes;
}
