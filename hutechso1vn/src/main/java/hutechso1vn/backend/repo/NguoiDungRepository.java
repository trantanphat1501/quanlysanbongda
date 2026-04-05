package hutechso1vn.backend.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hutechso1vn.backend.entity.NguoiDung;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {

    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);
}

