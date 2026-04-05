package hutechso1vn.backend.controller;

import hutechso1vn.backend.dto.TeamMemberRequest;
import hutechso1vn.backend.dto.TeamMemberResponse;
import hutechso1vn.backend.dto.TeamRequest;
import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.entity.Team;
import hutechso1vn.backend.entity.TeamMember;
import hutechso1vn.backend.entity.Tournament;
import hutechso1vn.backend.entity.TournamentTeam;
import hutechso1vn.backend.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final TournamentRepository tournamentRepository;
    private final TournamentTeamRepository tournamentTeamRepository;

    @GetMapping
    public ResponseEntity<List<Team>> getAll() {
        return ResponseEntity.ok(teamRepository.findAll());
    }

    @GetMapping("/my-teams")
    public ResponseEntity<List<Team>> getMyTeams(Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Lấy team mà user là chủ đội
        List<Team> allTeams = new java.util.ArrayList<>(teamRepository.findByChuDoiId(user.getId()));
        
        // Lấy team mà user là thành viên đã chấp nhận
        List<TeamMember> acceptedMemberships = teamMemberRepository.findByNguoiDungId(user.getId())
                .stream()
                .filter(tm -> "DA_CHAP_NHAN".equals(tm.getTrangThai()))
                .toList();
        
        // Thêm các team từ membership vào danh sách
        for (TeamMember tm : acceptedMemberships) {
            Team team = teamRepository.findById(tm.getTeam().getId())
                    .orElse(null);
            if (team != null && !allTeams.stream().anyMatch(t -> t.getId().equals(team.getId()))) {
                allTeams.add(team);
            }
        }
        
        return ResponseEntity.ok(allTeams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getById(@PathVariable Integer id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Team> create(@RequestBody TeamRequest request, Authentication auth) {
        NguoiDung chuDoi = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = Team.builder()
                .tenDoi(request.getTenDoi())
                .moTa(request.getMoTa())
                .chuDoi(chuDoi)
                .build();
        return ResponseEntity.ok(teamRepository.save(team));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> update(@PathVariable Integer id, @RequestBody TeamRequest request, Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return teamRepository.findById(id)
                .map(team -> {
                    if (!team.getChuDoi().getId().equals(user.getId())) {
                        throw new RuntimeException("Only team owner can update");
                    }
                    team.setTenDoi(request.getTenDoi());
                    team.setMoTa(request.getMoTa());
                    return ResponseEntity.ok(teamRepository.save(team));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getChuDoi().getId().equals(user.getId())) {
            throw new RuntimeException("Only team owner can delete");
        }

        teamRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<?> inviteMember(@PathVariable Integer teamId, @RequestBody TeamMemberRequest request, Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getChuDoi().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Only team owner can invite members");
        }

        NguoiDung member = nguoiDungRepository.findById(request.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (teamMemberRepository.findByTeamIdAndNguoiDungId(teamId, member.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Member already in team");
        }

        TeamMember teamMember = TeamMember.builder()
                .team(team)
                .nguoiDung(member)
                .trangThai("CHO_XAC_NHAN")
                .build();

        TeamMember saved = teamMemberRepository.save(teamMember);
        
        TeamMemberResponse response = TeamMemberResponse.builder()
                .id(saved.getId())
                .team(saved.getTeam())
                .nguoiDung(saved.getNguoiDung())
                .trangThai(saved.getTrangThai())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponse>> getMembers(@PathVariable Integer teamId) {
        List<TeamMemberResponse> responses = teamMemberRepository.findByTeamId(teamId)
                .stream()
                .map(tm -> TeamMemberResponse.builder()
                        .id(tm.getId())
                        .team(tm.getTeam())
                        .nguoiDung(tm.getNguoiDung())
                        .trangThai(tm.getTrangThai())
                        .build())
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/members/{memberId}/status")
    public ResponseEntity<?> updateMemberStatus(@PathVariable Integer memberId, @RequestParam String status, Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getNguoiDung().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("You can only update your own status");
        }

        member.setTrangThai(status);
        TeamMember saved = teamMemberRepository.save(member);
        
        TeamMemberResponse response = TeamMemberResponse.builder()
                .id(saved.getId())
                .team(saved.getTeam())
                .nguoiDung(saved.getNguoiDung())
                .trangThai(saved.getTrangThai())
                .build();
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable Integer memberId, Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getTeam().getChuDoi().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Only team owner can remove members");
        }

        teamMemberRepository.deleteById(memberId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{teamId}/register-tournament/{tournamentId}")
    public ResponseEntity<?> registerTournament(@PathVariable Integer teamId, @PathVariable Integer tournamentId, Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getChuDoi().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Chỉ chủ đội mới có quyền đăng ký tham gia giải đấu");
        }

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (!"DANG_MO".equals(tournament.getTrangThai())) {
            return ResponseEntity.badRequest().body("Tournament is not open for registration");
        }

        if (tournamentTeamRepository.findByTournamentIdAndTeamId(tournamentId, teamId).isPresent()) {
            return ResponseEntity.badRequest().body("Team already registered");
        }

        long registeredCount = tournamentTeamRepository.findByTournamentId(tournamentId).stream()
                .filter(tt -> "DA_DUYET".equals(tt.getTrangThai()))
                .count();

        if (registeredCount >= tournament.getSoDoiToiDa()) {
            return ResponseEntity.badRequest().body("Tournament is full");
        }

        TournamentTeam tournamentTeam = TournamentTeam.builder()
                .tournament(tournament)
                .team(team)
                .trangThai("CHO_DUYET")
                .build();

        return ResponseEntity.ok(tournamentTeamRepository.save(tournamentTeam));
    }

    @GetMapping("/my-invitations")
    public ResponseEntity<List<TeamMemberResponse>> getMyInvitations(Authentication auth) {
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TeamMemberResponse> responses = teamMemberRepository.findByNguoiDungId(user.getId())
                .stream()
                .map(tm -> TeamMemberResponse.builder()
                        .id(tm.getId())
                        .team(tm.getTeam())
                        .nguoiDung(tm.getNguoiDung())
                        .trangThai(tm.getTrangThai())
                        .build())
                .toList();
        
        return ResponseEntity.ok(responses);
    }
}
