package hutechso1vn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StandingUpdateRequest {
    private Integer soTranThang;
    private Integer soTranHoa;
    private Integer soTranThua;
    private Integer soBanThang;
    private Integer soBanThua;
    private Integer diem;
}
