package hutechso1vn.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NguoiDungUpdateRequest {

    private String name;
    private String soDienThoai;
    private String password; // có thể null / rỗng: không đổi mật khẩu
    private Integer vaiTroId; // id vai trò mới, có thể null: không đổi vai trò
}
