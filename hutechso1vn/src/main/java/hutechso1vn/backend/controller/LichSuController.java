package hutechso1vn.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hutechso1vn.backend.dto.DatSanRequest;
import hutechso1vn.backend.dto.LichSuResponse;
import hutechso1vn.backend.entity.GiaTien;
import hutechso1vn.backend.entity.LichSu;
import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.entity.SanBong;
import hutechso1vn.backend.entity.enums.LichSuStatus;
import hutechso1vn.backend.repo.GiaTienRepository;
import hutechso1vn.backend.repo.LichSuRepository;
import hutechso1vn.backend.repo.NguoiDungRepository;
import hutechso1vn.backend.repo.SanBongRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lich-su")
@RequiredArgsConstructor
public class LichSuController {

    private final LichSuRepository lichSuRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final SanBongRepository sanBongRepository;
    private final GiaTienRepository giaTienRepository;

    @PostMapping("/dat-san")
    public ResponseEntity<?> datSan(@RequestBody DatSanRequest request, Authentication auth) {
        String soDienThoai = auth.getName();
        NguoiDung nguoiDung = nguoiDungRepository.findBySoDienThoai(soDienThoai)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        SanBong sanBong = sanBongRepository.findById(request.getSanBongId())
                .orElseThrow(() -> new RuntimeException("Sân bóng không tồn tại"));

        if (sanBong.getBaoTri()) {
            return ResponseEntity.badRequest().body("Sân đang bảo trì");
        }

        GiaTien giaTien = giaTienRepository.findById(request.getGiaTienId())
                .orElseThrow(() -> new RuntimeException("Khung giờ không tồn tại"));

        if (!giaTien.getSanBong().getId().equals(request.getSanBongId())) {
            return ResponseEntity.badRequest().body("Khung giờ không thuộc sân này");
        }

        LocalDate ngayDat = request.getNgayDat();
        if (ngayDat.isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Không thể đặt sân trong quá khứ");
        }

        boolean isBooked = lichSuRepository.existsBySanBongAndTimeSlot(
                request.getSanBongId(),
                ngayDat,
                giaTien.getGioBatDau(),
                giaTien.getGioKetThuc()
        );

        if (isBooked) {
            return ResponseEntity.badRequest().body("Khung giờ này đã được đặt");
        }

        LichSu lichSu = LichSu.builder()
                .nguoiDung(nguoiDung)
                .sanBong(sanBong)
                .ngayDat(ngayDat)
                .gioBatDau(giaTien.getGioBatDau())
                .gioKetThuc(giaTien.getGioKetThuc())
                .giaTien(giaTien.getGiaTien())
                .trangThai(LichSuStatus.CHO_XAC_NHAN)
                .build();

        lichSuRepository.save(lichSu);
        return ResponseEntity.ok(mapToResponse(lichSu));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<LichSuResponse>> getMyBookings(Authentication auth) {
        String soDienThoai = auth.getName();
        NguoiDung nguoiDung = nguoiDungRepository.findBySoDienThoai(soDienThoai)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        List<LichSu> lichSus = lichSuRepository.findByNguoiDungIdOrderByNgayDatDescGioBatDauDesc(nguoiDung.getId());
        return ResponseEntity.ok(lichSus.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/san/{sanBongId}")
    public ResponseEntity<List<LichSuResponse>> getBySanBong(@PathVariable Integer sanBongId) {
        List<LichSu> lichSus = lichSuRepository.findBySanBongIdOrderByNgayDatDescGioBatDauDesc(sanBongId);
        return ResponseEntity.ok(lichSus.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<LichSuResponse>> getAll() {
        List<LichSu> lichSus = lichSuRepository.findAll();
        return ResponseEntity.ok(lichSus.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody LichSuStatus status) {
        LichSu lichSu = lichSuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch sử không tồn tại"));
        lichSu.setTrangThai(status);
        lichSuRepository.save(lichSu);
        return ResponseEntity.ok(mapToResponse(lichSu));
    }

    private LichSuResponse mapToResponse(LichSu lichSu) {
        return LichSuResponse.builder()
                .id(lichSu.getId())
                .sanBongId(lichSu.getSanBong().getId())
                .soNguoi(lichSu.getSanBong().getSoNguoi())
                .nguoiDungName(lichSu.getNguoiDung().getName())
                .ngayDat(lichSu.getNgayDat())
                .gioBatDau(lichSu.getGioBatDau())
                .gioKetThuc(lichSu.getGioKetThuc())
                .giaTien(lichSu.getGiaTien())
                .trangThai(lichSu.getTrangThai())
                .build();
    }
}
