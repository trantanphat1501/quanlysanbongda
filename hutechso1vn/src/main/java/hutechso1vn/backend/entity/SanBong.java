package hutechso1vn.backend.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "san_bong")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SanBong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "so_nguoi")
    private Integer soNguoi;

    @Column(name = "bao_tri")
    private Boolean baoTri;

    @Column(name = "deleted")
    private Boolean deleted = false;

    @OneToMany(mappedBy = "sanBong", fetch = FetchType.LAZY)
    private List<LichSu> lichSus;

    @OneToMany(mappedBy = "sanBong", fetch = FetchType.LAZY)
    private List<GiaTien> giaTiens;

    @OneToMany(mappedBy = "sanBong", fetch = FetchType.LAZY)
    private List<HinhAnh> hinhAnhs;
}