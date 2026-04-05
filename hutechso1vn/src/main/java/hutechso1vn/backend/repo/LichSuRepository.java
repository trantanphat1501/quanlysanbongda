package hutechso1vn.backend.repo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import hutechso1vn.backend.entity.LichSu;

@Repository
public interface LichSuRepository extends JpaRepository<LichSu, Integer> {
    List<LichSu> findByNguoiDungIdOrderByNgayDatDescGioBatDauDesc(Integer nguoiDungId);
    List<LichSu> findBySanBongIdOrderByNgayDatDescGioBatDauDesc(Integer sanBongId);
    
    @Query("SELECT COUNT(l) > 0 FROM LichSu l WHERE l.sanBong.id = :sanBongId " +
           "AND l.ngayDat = :ngayDat " +
           "AND l.gioBatDau = :gioBatDau " +
           "AND l.gioKetThuc = :gioKetThuc " +
           "AND l.trangThai != 'DA_HUY'")
    boolean existsBySanBongAndTimeSlot(@Param("sanBongId") Integer sanBongId,
                                       @Param("ngayDat") LocalDate ngayDat,
                                       @Param("gioBatDau") LocalTime gioBatDau,
                                       @Param("gioKetThuc") LocalTime gioKetThuc);
}
