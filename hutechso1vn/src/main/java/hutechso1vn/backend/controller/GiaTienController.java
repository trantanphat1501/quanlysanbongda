package hutechso1vn.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hutechso1vn.backend.dto.GiaTienRequest;
import hutechso1vn.backend.entity.GiaTien;
import hutechso1vn.backend.entity.SanBong;
import hutechso1vn.backend.repo.GiaTienRepository;
import hutechso1vn.backend.repo.SanBongRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gia-tien")
@RequiredArgsConstructor
public class GiaTienController {

    private final GiaTienRepository giaTienRepository;
    private final SanBongRepository sanBongRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<List<GiaTien>> getAll(
            @RequestParam(value = "sanBongId", required = false) Integer sanBongId) {
        if (sanBongId != null) {
            return ResponseEntity.ok(giaTienRepository.findBySanBong_Id(sanBongId));
        }
        return ResponseEntity.ok(giaTienRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<GiaTien> getById(@PathVariable Integer id) {
        return giaTienRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<GiaTien> create(@RequestBody GiaTienRequest request) {
        SanBong sanBong = sanBongRepository.findById(request.getSanBongId())
                .orElseThrow(() -> new IllegalArgumentException("San bong khong ton tai"));

        GiaTien giaTien = GiaTien.builder()
                .gioBatDau(request.getGioBatDau())
                .gioKetThuc(request.getGioKetThuc())
                .giaTien(request.getGiaTien())
                .sanBong(sanBong)
                .build();

        return ResponseEntity.ok(giaTienRepository.save(giaTien));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<GiaTien> update(@PathVariable Integer id, @RequestBody GiaTienRequest request) {
        return giaTienRepository.findById(id)
                .map(existing -> {
                    existing.setGioBatDau(request.getGioBatDau());
                    existing.setGioKetThuc(request.getGioKetThuc());
                    existing.setGiaTien(request.getGiaTien());
                    if (request.getSanBongId() != null) {
                        SanBong sanBong = sanBongRepository.findById(request.getSanBongId())
                                .orElseThrow(() -> new IllegalArgumentException("San bong khong ton tai"));
                        existing.setSanBong(sanBong);
                    }
                    return ResponseEntity.ok(giaTienRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!giaTienRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        giaTienRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
