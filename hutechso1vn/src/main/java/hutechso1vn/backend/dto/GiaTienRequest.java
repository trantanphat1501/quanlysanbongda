package hutechso1vn.backend.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GiaTienRequest {

    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private BigDecimal giaTien;
    private Integer sanBongId;
}
