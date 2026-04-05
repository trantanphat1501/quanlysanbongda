package hutechso1vn.backend.dto;

import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.entity.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberResponse {
    private Integer id;
    private Team team;
    private NguoiDung nguoiDung;
    private String trangThai;
}
