package hutechso1vn.backend.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hutechso1vn.backend.entity.VaiTro;

public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {

    Optional<VaiTro> findByName(String name);
}

