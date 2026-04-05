package hutechso1vn.backend.dto;

import java.time.LocalDate;
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
public class DatSanRequest {
    private Integer sanBongId;
    private Integer giaTienId;
    private LocalDate ngayDat;
}
