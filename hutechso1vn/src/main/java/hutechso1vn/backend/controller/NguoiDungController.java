package hutechso1vn.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hutechso1vn.backend.dto.NguoiDungUpdateRequest;
import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.entity.VaiTro;
import hutechso1vn.backend.repo.NguoiDungRepository;
import hutechso1vn.backend.repo.VaiTroRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nguoi-dung")
@RequiredArgsConstructor
public class NguoiDungController {

    private final NguoiDungRepository nguoiDungRepository;
    private final VaiTroRepository vaiTroRepository;
    private final PasswordEncoder passwordEncoder;

    // ================== APIs chỉ cho Quan_tri quản lý user ==================

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<List<NguoiDung>> getAll() {
        return ResponseEntity.ok(nguoiDungRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<NguoiDung> getById(@PathVariable Integer id) {
        return nguoiDungRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<NguoiDung> update(@PathVariable Integer id, @RequestBody NguoiDungUpdateRequest request) {
        return nguoiDungRepository.findById(id)
                .map(existing -> {
                    existing.setName(request.getName());
                    existing.setSoDienThoai(request.getSoDienThoai());
                    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                        existing.setPassword(passwordEncoder.encode(request.getPassword()));
                    }
                    if (request.getVaiTroId() != null) {
                        VaiTro vaiTro = vaiTroRepository.findById(request.getVaiTroId())
                                .orElseThrow(() -> new IllegalArgumentException("Vai tro khong ton tai"));
                        existing.setVaiTro(vaiTro);
                    }
                    return ResponseEntity.ok(nguoiDungRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!nguoiDungRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        nguoiDungRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<NguoiDung> searchByPhone(@RequestParam String soDienThoai) {
        return nguoiDungRepository.findBySoDienThoai(soDienThoai)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
