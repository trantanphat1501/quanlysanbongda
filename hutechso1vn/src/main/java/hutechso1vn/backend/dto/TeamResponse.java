package hutechso1vn.backend.dto;

import hutechso1vn.backend.entity.NguoiDung;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private Integer id;
    private String tenDoi;
    private String moTa;
    private NguoiDung chuDoi;
    private Boolean isOwner;
}
