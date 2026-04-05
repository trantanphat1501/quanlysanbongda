package hutechso1vn.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hutechso1vn.backend.entity.GiaTien;

public interface GiaTienRepository extends JpaRepository<GiaTien, Integer> {

    List<GiaTien> findBySanBong_Id(Integer sanBongId);
}
