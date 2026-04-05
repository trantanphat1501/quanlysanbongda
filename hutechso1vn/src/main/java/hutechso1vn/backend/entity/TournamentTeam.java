package hutechso1vn.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tournament_team")
public class TournamentTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    @JsonIgnore
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "trang_thai")
    private String trangThai; // CHO_DUYET, DA_DUYET, TU_CHOI

    // Bảng xếp hạng
    @Column(name = "so_tran_thang")
    private Integer soTranThang = 0;

    @Column(name = "so_tran_hoa")
    private Integer soTranHoa = 0;

    @Column(name = "so_tran_thua")
    private Integer soTranThua = 0;

    @Column(name = "so_ban_thang")
    private Integer soBanThang = 0;

    @Column(name = "so_ban_thua")
    private Integer soBanThua = 0;

    @Column(name = "diem")
    private Integer diem = 0;

    // Tính toán
    public Integer getSoTranDau() {
        return (soTranThang != null ? soTranThang : 0) + 
               (soTranHoa != null ? soTranHoa : 0) + 
               (soTranThua != null ? soTranThua : 0);
    }

    public Integer getHieuSo() {
        return (soBanThang != null ? soBanThang : 0) - 
               (soBanThua != null ? soBanThua : 0);
    }
}
