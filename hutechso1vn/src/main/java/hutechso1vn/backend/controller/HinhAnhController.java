package hutechso1vn.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hutechso1vn.backend.repo.HinhAnhRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hinh-anh")
@RequiredArgsConstructor
public class HinhAnhController {

    private final HinhAnhRepository hinhAnhRepository;

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!hinhAnhRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hinhAnhRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

