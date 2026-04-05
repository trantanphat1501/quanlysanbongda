package hutechso1vn.backend.repo;

import hutechso1vn.backend.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
    List<TeamMember> findByTeamId(Integer teamId);
    Optional<TeamMember> findByTeamIdAndNguoiDungId(Integer teamId, Integer nguoiDungId);
    List<TeamMember> findByNguoiDungId(Integer nguoiDungId);
}
