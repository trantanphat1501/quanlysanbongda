package hutechso1vn.backend.controller;

import hutechso1vn.backend.dto.TournamentRequest;
import hutechso1vn.backend.entity.Tournament;
import hutechso1vn.backend.repo.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentRepository tournamentRepository;

    @GetMapping
    public ResponseEntity<List<Tournament>> getAll() {
        return ResponseEntity.ok(tournamentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getById(@PathVariable Integer id) {
        return tournamentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Tournament> create(@RequestBody TournamentRequest request) {
        Tournament tournament = Tournament.builder()
                .tenGiai(request.getTenGiai())
                .moTa(request.getMoTa())
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .soDoiToiDa(request.getSoDoiToiDa())
                .trangThai("DANG_MO")
                .build();
        return ResponseEntity.ok(tournamentRepository.save(tournament));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Tournament> update(@PathVariable Integer id, @RequestBody TournamentRequest request) {
        return tournamentRepository.findById(id)
                .map(tournament -> {
                    tournament.setTenGiai(request.getTenGiai());
                    tournament.setMoTa(request.getMoTa());
                    tournament.setNgayBatDau(request.getNgayBatDau());
                    tournament.setNgayKetThuc(request.getNgayKetThuc());
                    tournament.setSoDoiToiDa(request.getSoDoiToiDa());
                    if (request.getTrangThai() != null) {
                        tournament.setTrangThai(request.getTrangThai());
                    }
                    return ResponseEntity.ok(tournamentRepository.save(tournament));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        tournamentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
