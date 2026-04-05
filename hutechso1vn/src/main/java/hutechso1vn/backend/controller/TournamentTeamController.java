package hutechso1vn.backend.controller;

import hutechso1vn.backend.entity.TournamentTeam;
import hutechso1vn.backend.repo.TournamentTeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournament-teams")
@RequiredArgsConstructor
public class TournamentTeamController {

    private final TournamentTeamRepository tournamentTeamRepository;

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<TournamentTeam>> getByTournament(@PathVariable Integer tournamentId) {
        return ResponseEntity.ok(tournamentTeamRepository.findByTournamentId(tournamentId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<TournamentTeam> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return tournamentTeamRepository.findById(id)
                .map(tt -> {
                    tt.setTrangThai(status);
                    return ResponseEntity.ok(tournamentTeamRepository.save(tt));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/standing")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<TournamentTeam> updateStanding(@PathVariable Integer id, @RequestBody hutechso1vn.backend.dto.StandingUpdateRequest request) {
        return tournamentTeamRepository.findById(id)
                .map(tt -> {
                    if (request.getSoTranThang() != null) tt.setSoTranThang(request.getSoTranThang());
                    if (request.getSoTranHoa() != null) tt.setSoTranHoa(request.getSoTranHoa());
                    if (request.getSoTranThua() != null) tt.setSoTranThua(request.getSoTranThua());
                    if (request.getSoBanThang() != null) tt.setSoBanThang(request.getSoBanThang());
                    if (request.getSoBanThua() != null) tt.setSoBanThua(request.getSoBanThua());
                    if (request.getDiem() != null) tt.setDiem(request.getDiem());
                    return ResponseEntity.ok(tournamentTeamRepository.save(tt));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
