package hutechso1vn.backend.repo;

import hutechso1vn.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {
    List<Team> findByChuDoiId(Integer chuDoiId);
}
