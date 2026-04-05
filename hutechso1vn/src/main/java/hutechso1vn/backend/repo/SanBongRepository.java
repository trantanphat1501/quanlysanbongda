package hutechso1vn.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hutechso1vn.backend.entity.SanBong;

public interface SanBongRepository extends JpaRepository<SanBong, Integer> {
    List<SanBong> findByDeletedFalse();
    List<SanBong> findAllByOrderByDeletedAscIdAsc();
}
