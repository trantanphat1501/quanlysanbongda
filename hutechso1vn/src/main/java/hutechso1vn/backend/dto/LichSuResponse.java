package hutechso1vn.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import hutechso1vn.backend.entity.enums.LichSuStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LichSuResponse {
    private Integer id;
    private Integer sanBongId;
    private Integer soNguoi;
    private String nguoiDungName;
    private LocalDate ngayDat;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private BigDecimal giaTien;
    private LichSuStatus trangThai;
}
