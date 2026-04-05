package hutechso1vn.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hutechso1vn.backend.dto.SanBongRequest;
import hutechso1vn.backend.entity.HinhAnh;
import hutechso1vn.backend.entity.SanBong;
import hutechso1vn.backend.repo.HinhAnhRepository;
import hutechso1vn.backend.repo.SanBongRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/san-bong")
@RequiredArgsConstructor
public class SanBongController {

    private final SanBongRepository sanBongRepository;
    private final HinhAnhRepository hinhAnhRepository;

    private static final String UPLOAD_DIR = "D:\\Programing\\quanlisanbongda\\uploads";

    @GetMapping
    public ResponseEntity<List<SanBong>> getAll() {
        List<SanBong> sanList = sanBongRepository.findByDeletedFalse();
        // Force initialize lazy collections
        sanList.forEach(san -> {
            san.getGiaTiens().size();
            san.getHinhAnhs().size();
        });
        return ResponseEntity.ok(sanList);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<List<SanBong>> getAllForAdmin() {
        List<SanBong> sanList = sanBongRepository.findAllByOrderByDeletedAscIdAsc();
        // Force initialize lazy collections
        sanList.forEach(san -> {
            san.getGiaTiens().size();
            san.getHinhAnhs().size();
        });
        return ResponseEntity.ok(sanList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanBong> getById(@PathVariable Integer id) {
        return sanBongRepository.findById(id)
                .map(san -> {
                    // Force initialize lazy collections
                    san.getGiaTiens().size();
                    san.getHinhAnhs().size();
                    return ResponseEntity.ok(san);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<SanBong> create(@RequestBody SanBongRequest request) {
        SanBong sanBong = SanBong.builder()
                .soNguoi(request.getSoNguoi())
                .baoTri(request.getBaoTri())
                .deleted(false)
                .build();
        return ResponseEntity.ok(sanBongRepository.save(sanBong));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<SanBong> update(@PathVariable Integer id, @RequestBody SanBongRequest request) {
        return sanBongRepository.findById(id)
                .map(existing -> {
                    existing.setSoNguoi(request.getSoNguoi());
                    existing.setBaoTri(request.getBaoTri());
                    return ResponseEntity.ok(sanBongRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return sanBongRepository.findById(id)
                .map(sanBong -> {
                    sanBong.setDeleted(true);
                    sanBongRepository.save(sanBong);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<SanBong> restore(@PathVariable Integer id) {
        return sanBongRepository.findById(id)
                .map(sanBong -> {
                    sanBong.setDeleted(false);
                    return ResponseEntity.ok(sanBongRepository.save(sanBong));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/bao-tri")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<SanBong> updateBaoTri(@PathVariable Integer id, @RequestParam Boolean baoTri) {
        return sanBongRepository.findById(id)
                .map(sanBong -> {
                    sanBong.setBaoTri(baoTri);
                    return ResponseEntity.ok(sanBongRepository.save(sanBong));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/upload-anh")
    @PreAuthorize("hasAuthority('ROLE_Quan_tri')")
    public ResponseEntity<HinhAnh> uploadAnh(@PathVariable Integer id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "thuTu", required = false) Integer thuTu) throws IOException {
        SanBong sanBong = sanBongRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("San bong khong ton tai"));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String storedFileName = System.currentTimeMillis() + "_" + originalFilename;
        Path targetPath = uploadPath.resolve(storedFileName);

        file.transferTo(targetPath.toFile());

        String publicUrl = "http://localhost:8080/uploads/" + storedFileName;

        HinhAnh hinhAnh = HinhAnh.builder()
                .thuTu(thuTu)
                .url(publicUrl)
                .sanBong(sanBong)
                .build();

        return ResponseEntity.ok(hinhAnhRepository.save(hinhAnh));
    }
}
